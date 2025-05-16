import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ visible, message, detail, type = 'success', onClose }) => {
  // Auto-hide after 5 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'ri-checkbox-circle-line text-[#10b981]';
      case 'error':
        return 'ri-error-warning-line text-[#ef4444]';
      case 'warning':
        return 'ri-alert-line text-[#f59e0b]';
      default:
        return 'ri-information-line text-[#2563eb]';
    }
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed top-4 right-4 max-w-xs w-full bg-[#1e1e2e] shadow-lg rounded-lg p-4 z-50"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <i className={`${getIcon()} text-xl`}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message}</p>
              {detail && <p className="mt-1 text-xs text-gray-400">{detail}</p>}
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button 
                  className="p-1.5 rounded-md text-gray-400 hover:text-white"
                  onClick={onClose}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
