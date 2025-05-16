import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';

const BottomNav = ({ onSearchOpen, onMenuOpen }) => {
  const [location] = useLocation();
  
  // Primary navigation items for bottom bar
  const navItems = [
    { path: '/dashboard', icon: 'ri-dashboard-line', label: 'Home' },
    { path: '/devices', icon: 'ri-device-line', label: 'Devices' },
    { path: '/electricity', icon: 'ri-flashlight-line', label: 'Energy' },
    { path: '/rooms', icon: 'ri-home-line', label: 'Rooms' },
    { path: '/settings', icon: 'ri-settings-3-line', label: 'Settings' }
  ];
  
  // Calculate center position for floating mic button
  const centerIndex = Math.floor(navItems.length / 2);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e2e] shadow-lg border-t border-gray-800 z-40 lg:hidden">
      <div className="flex justify-between items-center h-16 px-4">
        {/* Left side menu button */}
        <button 
          onClick={onMenuOpen}
          className="flex flex-col items-center justify-center w-12 h-12 text-gray-400"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Main navigation items */}
        <div className="flex justify-center items-center space-x-6">
          {navItems.map((item, index) => {
            const isActive = location === item.path || 
                             (item.path === '/dashboard' && location === '/');
                             
            // Skip rendering the middle item to make space for the floating button
            if (index === centerIndex) {
              return <div key={item.path} className="w-12" />; // Spacer
            }
                             
            return (
              <Link key={item.path} href={item.path}>
                <a className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${isActive ? 'bg-[#2563eb]/10' : ''}`}>
                    <i className={`${item.icon} text-xl ${isActive ? 'text-[#2563eb]' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'text-[#2563eb]' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
        
        {/* Right side search button */}
        <button 
          onClick={onSearchOpen}
          className="flex flex-col items-center justify-center w-12 h-12 text-gray-400"
        >
          <Search className="h-6 w-6" />
        </button>
      </div>
      
      {/* Floating microphone button will be rendered outside this component */}
    </div>
  );
};

export default BottomNav;