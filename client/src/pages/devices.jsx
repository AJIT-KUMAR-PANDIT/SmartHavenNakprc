import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DeviceCard from '@/components/ui/device-card';
import DeviceModal from '@/components/device-modal';
import useDevices from '@/hooks/use-devices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Devices = () => {
  const { devices, isLoading, error, loadDevices, createDevice, editDevice, deleteDevice, toggleDevice } = useDevices();
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Apply filtering when devices, search query, or filter type changes
  useEffect(() => {
    if (!devices) return;

    let filtered = [...devices];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(device => 
        device.name.toLowerCase().includes(query) || 
        device.route.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(device => device.type === filterType);
    }
    
    setFilteredDevices(filtered);
  }, [devices, searchQuery, filterType]);

  const handleEditDevice = (device) => {
    setSelectedDevice(device);
    setDeviceModalOpen(true);
  };

  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Devices</h2>
          <p className="text-gray-400">Manage and control your IoT devices</p>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#2563eb]"
          onClick={() => {
            setSelectedDevice(null);
            setDeviceModalOpen(true);
          }}
        >
          <i className="ri-add-line"></i>
          Add Device
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#1e1e2e] p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search devices by name or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121218] border-gray-700"
            />
          </div>
          <div className="sm:w-48">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-[#121218] border-gray-700">
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
      </div>

      {/* Devices Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <motion.div
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <i className="ri-loader-4-line text-3xl text-gray-400"></i>
          </motion.div>
          <p className="mt-2 text-gray-400">Loading devices...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-red-900/20 rounded-lg border border-red-800">
          <i className="ri-error-warning-line text-5xl text-red-500"></i>
          <p className="mt-2 text-red-300">{error}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={loadDevices}
          >
            Retry
          </Button>
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="text-center py-10 bg-[#1e1e2e] rounded-lg">
          <i className="ri-device-line text-5xl text-gray-500"></i>
          <p className="mt-2 text-gray-400">
            {searchQuery || filterType !== 'all'
              ? 'No devices match your search criteria'
              : 'No devices added yet'}
          </p>
          {searchQuery || filterType !== 'all' ? (
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
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
        </div>
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

      {/* Status summary */}
      {filteredDevices.length > 0 && (
        <div className="mt-6 p-4 bg-[#1e1e2e] rounded-lg text-sm text-gray-400 flex justify-between items-center">
          <div>
            <span className="font-medium">Total: {filteredDevices.length} devices</span>
            <span className="mx-2">|</span>
            <span className="inline-flex items-center">
              <span className="h-2 w-2 rounded-full bg-[#10b981] mr-1"></span> 
              {filteredDevices.filter(d => d.status === 'online').length} Online
            </span>
            <span className="mx-2">|</span>
            <span className="inline-flex items-center">
              <span className="h-2 w-2 rounded-full bg-[#ef4444] mr-1"></span> 
              {filteredDevices.filter(d => d.status === 'offline').length} Offline
            </span>
          </div>
          <button
            className="text-[#2563eb] hover:underline flex items-center"
            onClick={loadDevices}
          >
            <i className="ri-refresh-line mr-1"></i> Refresh
          </button>
        </div>
      )}

      {/* Device Modal */}
      <DeviceModal
        isOpen={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
        onSave={handleSaveDevice}
        device={selectedDevice}
      />
    </div>
  );
};

export default Devices;
