import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DeviceCard from "@/components/ui/device-card";
import DeviceModal from "@/components/device-modal";
import useDevices from "@/hooks/use-devices";
import useRooms from "@/hooks/use-rooms"; // Import useRooms hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Devices = () => {
  const {
    devices,
    isLoading,
    error,
    loadDevices,
    createDevice,
    editDevice,
    deleteDevice,
    toggleDevice,
  } = useDevices();
  const { rooms, isLoading: isLoadingRooms, error: errorRooms } = useRooms(); // Fetch rooms

  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Apply filtering when devices, search query, or filter type changes
  useEffect(() => {
    if (!devices) return;

    let filtered = [...devices];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(query) ||
          device.route.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((device) => device.type === filterType);
    }

    setFilteredDevices(filtered);
  }, [devices, searchQuery, filterType]);

  const handleEditDevice = (device) => {
    setSelectedDevice(device);
    setDeviceModalOpen(true);
  };

  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      await deleteDevice(deviceId);
    }
  };

  const handleSaveDevice = async (deviceData, deviceId = null) => {
    if (deviceId) {
      await editDevice(deviceId, deviceData);
    } else {
      await createDevice(deviceData);
    }
    setSelectedDevice(null);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <motion.div
        className="mb-6 flex justify-between items-center p-6 bg-gradient-to-r from-[#1e1e2e]/50 to-[#1e1e2e]/80 rounded-lg backdrop-blur-sm border border-gray-800/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Devices
          </h2>
          <p className="text-gray-400 mt-2">
            Manage and control your IoT devices
          </p>
        </div>
        <Button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          onClick={() => {
            setSelectedDevice(null);
            setDeviceModalOpen(true);
          }}
        >
          <i className="ri-add-line"></i>
          Add Device
        </Button>
      </motion.div>

      {/* Filter Controls */}
      <motion.div
        className="bg-gradient-to-r from-[#1e1e2e] to-[#1e1e2e]/90 p-6 rounded-lg mb-6 border border-gray-800/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search devices by name or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121218] border-gray-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600"
            />
          </div>
          <div className="sm:w-48">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-[#121218] border-gray-700 transition-all duration-200 hover:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e2e] border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="switch">Switch</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="sensor">Sensor</SelectItem>
                <SelectItem value="fan">Fan</SelectItem>
                <SelectItem value="door">Door</SelectItem>
                <SelectItem value="camera">Camera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Devices Grid */}
      {isLoading ? (
        <motion.div
          className="text-center py-12 bg-gradient-to-r from-[#1e1e2e]/50 to-[#1e1e2e]/80 rounded-lg border border-gray-800/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <i className="ri-loader-4-line text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"></i>
          </motion.div>
          <p className="mt-4 text-gray-400 text-lg">Loading devices...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          className="text-center py-12 bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-800/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <i className="ri-error-warning-line text-6xl text-red-500 animate-pulse"></i>
          <p className="mt-4 text-red-300 text-lg">{error}</p>
          <Button
            variant="secondary"
            className="mt-6 border-red-700 hover:bg-red-900/20 transition-all duration-200 transform hover:scale-105"
            onClick={loadDevices}
          >
            Retry
          </Button>
        </motion.div>
      ) : filteredDevices.length === 0 ? (
        <motion.div
          className="text-center py-12 bg-gradient-to-r from-[#1e1e2e] to-[#1e1e2e]/90 rounded-lg border border-gray-800/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <i className="ri-device-line text-6xl bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent"></i>
          <p className="mt-4 text-gray-400 text-lg">
            {searchQuery || filterType !== "all"
              ? "No devices match your search criteria"
              : "No devices added yet"}
          </p>
          {searchQuery || filterType !== "all" ? (
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button
              className="mt-4 bg-[#2563eb]"
              onClick={() => {
                setSelectedDevice(null);
                setDeviceModalOpen(true);
              }}
            >
              Add Your First Device
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={toggleDevice}
              onEdit={handleEditDevice}
              onDelete={handleDeleteDevice}
            />
          ))}
        </div>
      )}

      {/* Device Modal */}
      <DeviceModal
        isOpen={deviceModalOpen}
        rooms={rooms} // Pass rooms data to DeviceModal
        onClose={() => {
          setDeviceModalOpen(false);
          setSelectedDevice(null);
        }}
        onSave={handleSaveDevice}
        device={selectedDevice}
      />
    </div>
  );
};

export default Devices;
