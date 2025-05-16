
import React from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Search } from 'lucide-react';
import VoiceControl from './voice-control';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomNav = ({ onSearchOpen, onMenuOpen }) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { path: '/dashboard', icon: 'ri-dashboard-line', label: 'Home' },
    { path: '/devices', icon: 'ri-device-line', label: 'Devices' },
    { type: 'voice', label: 'Voice' },
    { path: '/notifications', icon: 'ri-notification-3-line', label: 'Status' },
    { path: '/settings', icon: 'ri-settings-3-line', label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e1e2e] shadow-lg border-t border-gray-800 z-40 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-xl mx-auto relative">
        {/* Left side menu button */}
        <button 
          onClick={onMenuOpen}
          className="flex flex-col items-center justify-center w-12 h-12 text-gray-400"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Main navigation items */}
        <div className="flex-1 flex justify-center items-center">
          {navItems.map((item, index) => {
            if (item.type === 'voice') {
              return (
                <div key="voice-control" className="flex flex-col items-center px-4">
                  <div className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-[#2563eb]'}`}>
                    <VoiceControl compact={true} />
                  </div>
                  <span className="text-xs mt-1 text-gray-400">{item.label}</span>
                </div>
              );
            }

            const isActive = location === item.path || 
                           (item.path === '/dashboard' && location === '/');

            return (
              <Link key={item.path} href={item.path}>
                <a className="flex flex-col items-center px-4">
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
    </nav>
  );
};

export default BottomNav;
