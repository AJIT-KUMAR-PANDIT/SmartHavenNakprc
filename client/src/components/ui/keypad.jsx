import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Keypad = ({ onComplete, pinLength = 4, onError }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  
  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9' && pin.length < pinLength) {
        setPin(prev => prev + e.key);
      } else if (e.key === 'Backspace') {
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter' && pin.length === pinLength) {
        handleEnter();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, pinLength]);
  
  // Check if PIN is complete
  useEffect(() => {
    if (pin.length === pinLength) {
      setTimeout(() => {
        handleEnter();
      }, 300);
    }
  }, [pin, pinLength]);
  
  const handleKeyPress = (key) => {
    if (key === 'clear') {
      setPin('');
    } else if (key === 'enter') {
      handleEnter();
    } else if (pin.length < pinLength) {
      setPin(prev => prev + key);
    }
  };
  
  const handleEnter = () => {
    if (pin.length === pinLength) {
      const result = onComplete(pin);
      if (result === false) {
        setShake(true);
        
        // Reset shake animation after it completes
        setTimeout(() => {
          setShake(false);
          setPin('');
          if (onError) onError('Invalid PIN');
        }, 500);
      }
    }
  };
  
  return (
    <div className="w-full max-w-md">
      {/* PIN dots display */}
      <motion.div 
        className="flex justify-center space-x-4 mb-8"
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: pinLength }).map((_, index) => (
          <div 
            key={index}
            className={`h-4 w-4 rounded-full ${
              index < pin.length 
                ? 'bg-[#2563eb] border-[#2563eb]' 
                : 'border-2 border-gray-600'
            }`}
          ></div>
        ))}
      </motion.div>
      
      {/* Keypad grid */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <motion.button
            key={num}
            className="pin-button h-20 rounded-xl bg-[#1e1e2e] text-2xl font-medium focus:outline-none"
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(num.toString())}
          >
            {num}
          </motion.button>
        ))}
        
        <motion.button
          className="pin-button h-20 rounded-xl bg-[#1e1e2e] text-xl font-medium focus:outline-none"
          whileTap={{ scale: 0.95 }}
          onClick={() => handleKeyPress('clear')}
        >
          <i className="ri-delete-back-2-line text-xl"></i>
        </motion.button>
        
        <motion.button
          className="pin-button h-20 rounded-xl bg-[#1e1e2e] text-2xl font-medium focus:outline-none"
          whileTap={{ scale: 0.95 }}
          onClick={() => handleKeyPress('0')}
        >
          0
        </motion.button>
        
        <motion.button
          className="pin-button h-20 rounded-xl bg-[#2563eb] text-2xl font-medium focus:outline-none"
          whileTap={{ scale: 0.95 }}
          onClick={() => handleKeyPress('enter')}
        >
          <i className="ri-arrow-right-line"></i>
        </motion.button>
      </div>
    </div>
  );
};

export default Keypad;
