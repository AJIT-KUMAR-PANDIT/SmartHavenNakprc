import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [location] = useLocation();
  
  // Navigation items definition
  const navItems = [
    { path: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { path: '/devices', icon: 'ri-device-line', label: 'Devices' },
    { path: '/routes', icon: 'ri-route-line', label: 'Routes' },
    { path: '/automations', icon: 'ri-flow-chart', label: 'Automations' },
    { path: '/logs', icon: 'ri-file-list-3-line', label: 'Logs' },
    { path: '/settings', icon: 'ri-settings-3-line', label: 'Settings' },
  ];
  
  return (
    <aside className="hidden lg:block w-64 bg-[#1e1e2e]">
      <div className="h-full flex flex-col py-6">
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={`flex items-center px-4 py-3 rounded-lg ${
                location === item.path
                  ? 'text-white bg-[#2563eb]/10 border-l-4 border-[#2563eb]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
                <i className={`${item.icon} text-xl mr-3`}></i>
                <span>{item.label}</span>
                
                {/* Active indicator animation */}
                {location === item.path && (
                  <motion.div
                    className="ml-auto h-2 w-2 rounded-full bg-[#2563eb]"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="px-4 py-4 mt-6">
          <div className="bg-[#121218] p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <i className="ri-information-line text-[#8b5cf6] mr-2"></i>
              <h3 className="font-medium">Device Status</h3>
            </div>
            <p className="text-sm text-gray-400">Connected to MQTT broker</p>
            <div className="mt-2 text-xs grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-[#10b981] mr-1"></span>
                <span>4 Online</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-[#ef4444] mr-1"></span>
                <span>1 Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
