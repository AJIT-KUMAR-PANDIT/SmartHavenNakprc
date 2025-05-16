import React from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const MobileMenu = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  
  // All menu items for the hamburger menu
  const menuItems = [
    { path: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { path: '/devices', icon: 'ri-device-line', label: 'Devices' },
    { path: '/rooms', icon: 'ri-home-line', label: 'Rooms' },
    { path: '/scenes', icon: 'ri-film-line', label: 'Scenes' },
    { path: '/routes', icon: 'ri-route-line', label: 'Routes' },
    { path: '/automations', icon: 'ri-flow-chart', label: 'Automations' },
    { path: '/analytics', icon: 'ri-bar-chart-line', label: 'Analytics' },
    { path: '/electricity', icon: 'ri-flashlight-line', label: 'Electricity Monitor' },
    { path: '/logs', icon: 'ri-file-list-3-line', label: 'Logs' },
    { path: '/settings', icon: 'ri-settings-3-line', label: 'Settings' }
  ];
  
  // Group menu items into sections
  const menuSections = [
    {
      title: 'Main',
      items: menuItems.slice(0, 4)
    },
    {
      title: 'System',
      items: menuItems.slice(4, 8)
    },
    {
      title: 'Management',
      items: menuItems.slice(8)
    }
  ];
  
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Side menu */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#1e1e2e] shadow-xl z-50 lg:hidden overflow-auto border-r border-gray-800"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold">SmartHaven</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            {/* Menu sections */}
            <div className="py-4 px-2">
              {menuSections.map((section) => (
                <div key={section.title} className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link 
                        key={item.path} 
                        href={item.path}
                        onClick={onClose}
                      >
                        <a className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg">
                          <i className={`${item.icon} text-xl mr-3`} />
                          <span>{item.label}</span>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Logout button */}
              <div className="px-3 pt-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                >
                  <i className="ri-logout-box-line text-xl mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;