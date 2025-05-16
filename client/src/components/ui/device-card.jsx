import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getDeviceIcon, formatDate, timeElapsedSince } from '@/lib/utils';

const DeviceCard = ({ device, onToggle, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  
  const handleToggle = async () => {
    if (device.status === 'offline' && device.type !== 'sensor') {
      setLoading(true);
      await onToggle(device.id, 'on');
      setLoading(false);
    } else if (device.status === 'online' && device.type !== 'sensor') {
      setLoading(true);
      await onToggle(device.id, 'off');
      setLoading(false);
    }
  };
  
  // Determine card class based on device status
  const getCardClass = () => {
    let baseClass = "device-card bg-[#1e1e2e] rounded-xl p-5";
    if (device.status === 'online') {
      baseClass += " active";
    } else if (device.status === 'offline') {
      baseClass += " offline";
    }
    return baseClass;
  };

  // Render device controls based on type
  const renderControls = () => {
    switch (device.type) {
      case 'light':
        return (
          <div className="mt-4">
            <div className="h-1 w-full bg-gray-700 rounded-full">
              <div className="h-1 bg-gradient-to-r from-[#2563eb] to-[#8b5cf6] rounded-full" style={{ width: `${device.brightness || 60}%` }}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Brightness</span>
              <span>{device.brightness || 60}%</span>
            </div>
          </div>
        );
      
      case 'door':
        return (
          <div className="mt-4 flex space-x-2">
            <button 
              className="flex-1 py-1 px-3 bg-[#2563eb]/10 text-[#2563eb] text-sm rounded-md hover:bg-[#2563eb]/20"
              onClick={() => onToggle(device.id, 'open')}
              disabled={device.status === 'offline'}
            >
              Open
            </button>
            <button 
              className="flex-1 py-1 px-3 bg-gray-700 text-gray-300 text-sm rounded-md hover:bg-gray-600"
              onClick={() => onToggle(device.id, 'close')}
              disabled={device.status === 'offline'}
            >
              Close
            </button>
          </div>
        );
      
      case 'fan':
        return (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <button 
                className="p-2 bg-[#121218] rounded-md text-gray-400 hover:text-white"
                onClick={() => onToggle(device.id, 'speed_down')}
                disabled={device.status === 'offline'}
              >
                <i className="ri-speed-down-line"></i>
              </button>
              <span className="font-medium text-lg">Level {device.level || 2}</span>
              <button 
                className="p-2 bg-[#121218] rounded-md text-gray-400 hover:text-white"
                onClick={() => onToggle(device.id, 'speed_up')}
                disabled={device.status === 'offline'}
              >
                <i className="ri-speed-up-line"></i>
              </button>
            </div>
          </div>
        );
      
      case 'camera':
        return (
          <div className="mt-4 text-center">
            <div className="w-full h-20 bg-[#121218] rounded-md flex items-center justify-center">
              {device.status === 'online' ? (
                <motion.i 
                  className="ri-camera-line text-2xl text-[#10b981]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              ) : (
                <i className="ri-camera-line text-2xl text-gray-500"></i>
              )}
            </div>
          </div>
        );
      
      case 'sensor':
        return (
          <div className="mt-4 text-gray-500">
            <span className="text-xl">{device.status === 'online' ? `${device.value || '--'}${device.unit || '°C'}` : '--°C'}</span>
            <p className="text-xs">Last seen: {device.lastSeen ? timeElapsedSince(device.lastSeen) : 'N/A'}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render status indicator
  const renderStatus = () => {
    let iconClass = '';
    let statusText = '';
    let textClass = '';
    
    if (device.status === 'online') {
      iconClass = 'ri-checkbox-circle-line';
      statusText = 'Connected';
      textClass = 'text-[#10b981]';
    } else if (device.status === 'offline') {
      iconClass = 'ri-error-warning-line';
      statusText = 'Offline';
      textClass = 'text-[#ef4444]';
    } else if (device.status === 'warning') {
      iconClass = 'ri-signal-wifi-1-line';
      statusText = 'Weak Connection';
      textClass = 'text-[#f59e0b]';
    }
    
    return (
      <div className={`flex items-center text-sm ${textClass}`}>
        <i className={`${iconClass} mr-1`}></i>
        <span>{statusText}</span>
      </div>
    );
  };

  return (
    <motion.div 
      className={getCardClass()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium">{device.name}</h4>
          <p className="text-xs text-gray-400 font-mono">{device.route}</p>
        </div>
        <label className={`toggle-switch ${device.status === 'offline' && device.type === 'sensor' ? 'device-disabled' : ''}`}>
          <input 
            type="checkbox" 
            checked={device.status === 'online'}
            disabled={loading || (device.status === 'offline' && device.type === 'sensor')}
            onChange={handleToggle}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      
      {renderStatus()}
      {renderControls()}
      
      <div className="mt-3 flex justify-end space-x-2">
        <button 
          onClick={() => onEdit(device)}
          className="p-1 text-sm text-[#2563eb] hover:text-[#2563eb]/80"
        >
          <i className="ri-edit-line"></i>
        </button>
        <button 
          onClick={() => onDelete(device.id)}
          className="p-1 text-sm text-[#ef4444] hover:text-[#ef4444]/80"
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </div>
    </motion.div>
  );
};

export default DeviceCard;
