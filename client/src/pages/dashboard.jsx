import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusCard, { ConnectionStatusCard } from '@/components/status-card';
import DeviceCard from '@/components/ui/device-card';
import DeviceModal from '@/components/device-modal';
import useDevices from '@/hooks/use-devices';
import useRoutes from '@/hooks/use-routes';
import { formatFileSize } from '@/lib/utils';
import { getConnectionStatus } from '@/lib/mqtt';

const Dashboard = () => {
  const { devices, isLoading: devicesLoading, toggleDevice, createDevice, editDevice, deleteDevice } = useDevices();
  const { routes, isLoading: routesLoading } = useRoutes();
  const [mqttStatus, setMqttStatus] = useState(getConnectionStatus());
  const [logSize, setLogSize] = useState('42 MB');
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Update MQTT status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMqttStatus(getConnectionStatus());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle device actions
  const handleDeviceToggle = async (deviceId, command) => {
    await toggleDevice(deviceId, command);
  };
  
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
  
  // Calculate stats
  const onlineDevicesCount = devices?.filter(d => d.status === 'online').length || 0;
  const totalDevicesCount = devices?.length || 0;
  const routeCount = routes?.length || 0;
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-gray-400">Monitor and control your IoT devices</p>
      </div>
      
      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard 
          title="Connected Devices" 
          value={onlineDevicesCount}
          icon="ri-device-line" 
          color="#2563eb" 
          delay={0.1}
        />
        
        <StatusCard 
          title="Active Routes" 
          value={routeCount}
          icon="ri-route-line" 
          color="#8b5cf6" 
          delay={0.2}
        />
        
        <ConnectionStatusCard 
          connected={mqttStatus === 'connected'} 
          host="mqtt://broker.example.com"
          delay={0.3}
        />
        
        <StatusCard 
          title="Log Size" 
          value="42"
          unit="MB"
          icon="ri-file-list-3-line" 
          color="#f59e0b" 
          delay={0.4}
        />
      </div>
      
      {/* Device Control Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Device Control</h3>
          <button 
            className="text-sm flex items-center text-[#2563eb]"
            onClick={() => {
              setSelectedDevice(null);
              setDeviceModalOpen(true);
            }}
          >
            <i className="ri-add-line mr-1"></i> Add Device
          </button>
        </div>
        
        {devicesLoading ? (
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
        ) : devices.length === 0 ? (
          <div className="text-center py-8 bg-[#1e1e2e] rounded-lg">
            <i className="ri-device-line text-5xl text-gray-500"></i>
            <p className="mt-2 text-gray-400">No devices added yet</p>
            <button 
              className="mt-4 px-4 py-2 rounded-md bg-[#2563eb] text-white text-sm"
              onClick={() => {
                setSelectedDevice(null);
                setDeviceModalOpen(true);
              }}
            >
              Add Your First Device
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device, index) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleDeviceToggle}
                onEdit={handleEditDevice}
                onDelete={handleDeleteDevice}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Routes Management Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Dynamic Routes</h3>
          <button className="text-sm flex items-center text-[#2563eb]">
            <i className="ri-add-line mr-1"></i> Add Route
          </button>
        </div>
        
        {routesLoading ? (
          <div className="text-center py-8">
            <motion.div
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <i className="ri-loader-4-line text-3xl text-gray-400"></i>
            </motion.div>
            <p className="mt-2 text-gray-400">Loading routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-8 bg-[#1e1e2e] rounded-lg">
            <i className="ri-route-line text-5xl text-gray-500"></i>
            <p className="mt-2 text-gray-400">No routes added yet</p>
            <button className="mt-4 px-4 py-2 rounded-md bg-[#2563eb] text-white text-sm">
              Add Your First Route
            </button>
          </div>
        ) : (
          <div className="bg-[#1e1e2e] rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#1e1e2e]/80">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Route</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Access</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-[#1e1e2e]">
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{route.route}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{route.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#10b981]/20 text-[#10b981]">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {route.lastAccessed ? new Date(route.lastAccessed).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex space-x-2">
                          <button className="text-[#2563eb] hover:text-[#2563eb]/80"><i className="ri-edit-line"></i></button>
                          <button className="text-[#ef4444] hover:text-[#ef4444]/80"><i className="ri-delete-bin-line"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
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

export default Dashboard;
