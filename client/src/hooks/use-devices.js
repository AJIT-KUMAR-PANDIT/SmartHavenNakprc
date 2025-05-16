import { useState, useEffect } from 'react';
import { addDevice, updateDevice, removeDevice, getAllDevices, updateDeviceStatus } from '@/lib/db';
import { controlDevice } from '@/lib/mqtt';
import { addLog } from '@/lib/db';

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load all devices on initial mount
  useEffect(() => {
    loadDevices();
  }, []);
  
  // Function to load devices
  const loadDevices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allDevices = await getAllDevices();
      setDevices(allDevices);
    } catch (err) {
      console.error('Failed to load devices:', err);
      setError('Failed to load devices');
      addLog('Error', `Failed to load devices: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to add a new device
  const createDevice = async (deviceData) => {
    try {
      const newDevice = await addDevice(deviceData);
      setDevices(prev => [...prev, newDevice]);
      return newDevice;
    } catch (err) {
      console.error('Failed to add device:', err);
      setError('Failed to add device');
      addLog('Error', `Failed to add device: ${err.message}`);
      return null;
    }
  };
  
  // Function to update an existing device
  const editDevice = async (id, deviceData) => {
    try {
      const updated = await updateDevice(id, deviceData);
      if (updated) {
        setDevices(prev => prev.map(d => d.id === id ? updated : d));
      }
      return updated;
    } catch (err) {
      console.error('Failed to update device:', err);
      setError('Failed to update device');
      addLog('Error', `Failed to update device: ${err.message}`);
      return null;
    }
  };
  
  // Function to delete a device
  const deleteDevice = async (id) => {
    try {
      const success = await removeDevice(id);
      if (success) {
        setDevices(prev => prev.filter(d => d.id !== id));
      }
      return success;
    } catch (err) {
      console.error('Failed to delete device:', err);
      setError('Failed to delete device');
      addLog('Error', `Failed to delete device: ${err.message}`);
      return false;
    }
  };
  
  // Function to control a device (turn on/off)
  const toggleDevice = async (id, command) => {
    try {
      // First optimistically update the UI
      setDevices(prev => 
        prev.map(d => d.id === id 
          ? { ...d, status: command === 'on' ? 'online' : 'offline' } 
          : d
        )
      );
      
      // Then send the actual command
      const result = await controlDevice(id, command);
      return result;
    } catch (err) {
      console.error('Failed to control device:', err);
      setError('Failed to control device');
      addLog('Error', `Failed to control device: ${err.message}`);
      
      // Revert the optimistic update
      loadDevices();
      return null;
    }
  };
  
  // Function to update a device's status
  const updateStatus = async (id, status) => {
    try {
      const updated = await updateDeviceStatus(id, status);
      if (updated) {
        setDevices(prev => prev.map(d => d.id === id ? updated : d));
      }
      return updated;
    } catch (err) {
      console.error('Failed to update device status:', err);
      setError('Failed to update device status');
      addLog('Error', `Failed to update device status: ${err.message}`);
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
    updateStatus
  };
}

export default useDevices;
