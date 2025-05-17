import { useState, useEffect } from "react";
import {
  addDevice,
  updateDevice,
  removeDevice,
  getAllDevices,
  updateDeviceStatus,
  addLog,
} from "@/lib/db";
import { controlDevice } from "@/lib/mqtt";
import { useDataMode } from "@/contexts/data-mode-context";

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { useMockData, mockData, isDbInitialized } = useDataMode();

  // Load all devices when component mounts or when data mode changes
  useEffect(() => {
    loadDevices();
  }, [useMockData]);

  // Function to load devices
  const loadDevices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data when in demo mode
        setDevices(mockData.devices);
      } else {
        // Use real data from local database
        const allDevices = await getAllDevices();
        setDevices(allDevices);
      }
    } catch (err) {
      console.error("Failed to load devices:", err);
      setError("Failed to load devices");
      addLog("Error", `Failed to load devices: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new device
  const createDevice = async (deviceData) => {
    try {
      if (useMockData) {
        // In mock mode, add to the mock data
        const newDevice = {
          ...deviceData,
          id: `device_${Date.now()}`,
          status: "offline",
          roomId: deviceData.roomId || null,
          lastSeen: null,
        };

        const updatedDevices = [...mockData.devices, newDevice];
        mockData.devices = updatedDevices;
        setDevices(updatedDevices);

        return newDevice;
      } else {
        // In real mode, add to the database
        const newDevice = await addDevice(deviceData);
        setDevices((prev) => [...prev, newDevice]);
        return newDevice;
      }
    } catch (err) {
      console.error("Failed to add device:", err);
      setError("Failed to add device");
      addLog("Error", `Failed to add device: ${err.message}`);
      return null;
    }
  };

  // Function to update an existing device
  const editDevice = async (id, deviceData) => {
    try {
      if (useMockData) {
        // In mock mode, update the mock data
        const index = mockData.devices.findIndex((d) => d.id === id);
        if (index !== -1) {
          const updated = {
            ...mockData.devices[index],
            ...deviceData,
            roomId:
              deviceData.roomId === undefined
                ? mockData.devices[index].roomId
                : deviceData.roomId,
          };
          const updatedDevices = [...mockData.devices];
          updatedDevices[index] = updated;
          mockData.devices = updatedDevices;
          setDevices(updatedDevices);
          return updated;
        }
        return null;
      } else {
        // In real mode, update in the database
        const updated = await updateDevice(id, deviceData);
        if (updated) {
          setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
        } else {
          // If update failed, reload devices to reflect actual state
          loadDevices();
        }
        return updated;
      }
    } catch (err) {
      console.error("Failed to update device:", err);
      setError("Failed to update device");
      addLog("Error", `Failed to update device: ${err.message}`);
      return null;
    }
  };

  // Function to delete a device
  const deleteDevice = async (id) => {
    try {
      if (useMockData) {
        // In mock mode, remove from mock data
        const updatedDevices = mockData.devices.filter((d) => d.id !== id);
        mockData.devices = updatedDevices;
        setDevices(updatedDevices);
        return true;
      } else {
        // In real mode, remove from database
        const success = await removeDevice(id);
        if (success) {
          setDevices((prev) => prev.filter((d) => d.id !== id));
        }
        return success;
      }
    } catch (err) {
      console.error("Failed to delete device:", err);
      setError("Failed to delete device");
      addLog("Error", `Failed to delete device: ${err.message}`);
      return false;
    }
  };

  // Function to control a device (turn on/off)
  const toggleDevice = async (id, command) => {
    try {
      // First optimistically update the UI
      setDevices((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: command === "on" ? "online" : "offline" }
            : d
        )
      );

      if (useMockData) {
        // In mock mode, update the mock data
        const index = mockData.devices.findIndex((d) => d.id === id);
        if (index !== -1) {
          mockData.devices[index].status =
            command === "on" ? "online" : "offline";
          mockData.devices[index].lastSeen = new Date().toISOString();
          // Log the action
          addLog(
            "Device Control",
            `${mockData.devices[index].name} turned ${command}`
          );
          return true;
        }
        return false;
      } else {
        // In real mode, send the actual command
        const result = await controlDevice(id, command);
        return result;
      }
    } catch (err) {
      console.error("Failed to control device:", err);
      setError("Failed to control device");
      addLog("Error", `Failed to control device: ${err.message}`);

      // Revert the optimistic update
      loadDevices();
      return null;
    }
  };

  // Function to update a device's status
  const updateStatus = async (id, status) => {
    try {
      if (useMockData) {
        // In mock mode, update the mock data
        const index = mockData.devices.findIndex((d) => d.id === id);
        if (index !== -1) {
          const updated = {
            ...mockData.devices[index],
            status,
            lastSeen: new Date().toISOString(),
          };
          mockData.devices[index] = updated;
          setDevices([...mockData.devices]);
          return updated;
        }
        return null;
      } else {
        // In real mode, update in the database
        const updated = await updateDeviceStatus(id, status);
        if (updated) {
          setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
        }
        return updated;
      }
    } catch (err) {
      console.error("Failed to update device status:", err);
      setError("Failed to update device status");
      addLog("Error", `Failed to update device status: ${err.message}`);
      return null;
    }
  };

  return {
    devices,
    isLoading,
    error,
    loadDevices,
    createDevice,
    editDevice,
    deleteDevice,
    toggleDevice,
    updateStatus,
  };
}

export default useDevices;
