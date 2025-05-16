import React from 'react';
import { motion } from 'framer-motion';

// Status card for dashboard to show metrics and quick stats
const StatusCard = ({ title, value, icon, color, delay = 0, unit = '' }) => {
  return (
    <motion.div 
      className="bg-[#1e1e2e] rounded-xl p-4 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold">
            {value}
            {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
          </h3>
        </div>
        <div className={`h-12 w-12 rounded-full bg-[${color}]/20 flex items-center justify-center`}>
          <i className={`${icon} text-2xl text-[${color}]`}></i>
        </div>
      </div>
    </motion.div>
  );
};

// Special status card that shows an animated connection status
export const ConnectionStatusCard = ({ connected, host, delay = 0 }) => {
  return (
    <motion.div 
      className="bg-[#1e1e2e] rounded-xl p-4 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">MQTT Status</p>
          <h3 className="flex items-center text-md font-semibold">
            <span className="relative flex h-2.5 w-2.5 mr-2">
              {connected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
              )}
            </span>
            {connected ? 'Connected' : 'Disconnected'}
          </h3>
          {host && <p className="text-xs text-gray-500 mt-1">{host}</p>}
        </div>
        <div className="h-12 w-12 rounded-full bg-[#10b981]/20 flex items-center justify-center">
          <i className="ri-broadcast-line text-2xl text-[#10b981]"></i>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;
