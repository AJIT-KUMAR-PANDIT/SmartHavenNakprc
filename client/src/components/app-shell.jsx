import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import Sidebar from '@/components/sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const AppShell = ({ children }) => {
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mqttStatus, setMqttStatus] = useState('connected'); // connected, disconnected, reconnecting, error

  // Get MQTT status indicators
  const getMqttStatusIndicator = () => {
    switch (mqttStatus) {
      case 'connected':
        return (
          <div className="hidden sm:flex items-center text-sm">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
            </span>
            <span>Connected</span>
          </div>
        );
      case 'disconnected':
        return (
          <div className="hidden sm:flex items-center text-sm">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ef4444]"></span>
            </span>
            <span>Disconnected</span>
          </div>
        );
      case 'reconnecting':
        return (
          <div className="hidden sm:flex items-center text-sm">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f59e0b]"></span>
            </span>
            <span>Reconnecting</span>
          </div>
        );
      default:
        return (
          <div className="hidden sm:flex items-center text-sm">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6b7280]"></span>
            </span>
            <span>Unknown</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation/Status Bar */}
      <header className="bg-[#1e1e2e] shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <i className="ri-home-smile-line text-2xl text-[#2563eb] mr-2"></i>
              <h1 className="font-semibold text-xl">SmartHaven</h1>
            </div>
            <div className="flex items-center space-x-4">
              {getMqttStatusIndicator()}
              
              <button className="relative p-2 rounded-full hover:bg-opacity-10 hover:bg-white">
                <i className="ri-notification-2-line text-xl"></i>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#8b5cf6]"></span>
              </button>
              
              <button className="p-1 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6]">
                <i className="ri-user-3-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <main className="flex-grow flex">
        {/* Sidebar (desktop) */}
        <Sidebar />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={location}
            className="flex-1 bg-[#121218] overflow-auto px-4 py-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1e1e2e] shadow-lg border-t border-gray-800 z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/dashboard">
            <a className={`flex flex-col items-center pt-3 pb-2 px-3 ${location === '/dashboard' ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              <div className={`p-2 rounded-full ${location === '/dashboard' ? 'bg-[#2563eb]/10' : ''}`}>
                <i className="ri-dashboard-line text-xl"></i>
              </div>
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          
          <Link href="/devices">
            <a className={`flex flex-col items-center pt-3 pb-2 px-3 ${location === '/devices' ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              <div className={`p-2 rounded-full ${location === '/devices' ? 'bg-[#2563eb]/10' : ''}`}>
                <i className="ri-device-line text-xl"></i>
              </div>
              <span className="text-xs mt-1">Devices</span>
            </a>
          </Link>
          
          <Link href="/routes">
            <a className={`flex flex-col items-center pt-3 pb-2 px-3 ${location === '/routes' ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              <div className={`p-2 rounded-full ${location === '/routes' ? 'bg-[#2563eb]/10' : ''}`}>
                <i className="ri-route-line text-xl"></i>
              </div>
              <span className="text-xs mt-1">Routes</span>
            </a>
          </Link>
          
          <Link href="/automations">
            <a className={`flex flex-col items-center pt-3 pb-2 px-3 ${location === '/automations' ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              <div className={`p-2 rounded-full ${location === '/automations' ? 'bg-[#2563eb]/10' : ''}`}>
                <i className="ri-flow-chart text-xl"></i>
              </div>
              <span className="text-xs mt-1">Automations</span>
            </a>
          </Link>
          
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex flex-col items-center pt-3 pb-2 px-3 text-gray-400"
          >
            <div className={`p-2 rounded-full ${showMobileMenu ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]' : ''}`}>
              <i className="ri-more-2-fill text-xl"></i>
            </div>
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
              className="absolute bottom-[4.5rem] right-1 w-48 bg-[#1e1e2e] shadow-lg rounded-lg overflow-hidden z-50 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/logs">
                <a className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5">
                  <i className="ri-file-list-3-line text-base mr-3"></i>
                  <span>Logs</span>
                </a>
              </Link>
              
              <Link href="/settings">
                <a className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5">
                  <i className="ri-settings-3-line text-base mr-3"></i>
                  <span>Settings</span>
                </a>
              </Link>
              
              <button className="flex w-full items-center px-4 py-3 text-gray-400 hover:bg-white/5">
                <i className="ri-logout-box-line text-base mr-3"></i>
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Add bottom padding to account for fixed navbar on mobile */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default AppShell;
