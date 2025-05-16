import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <label className={`toggle-switch ${disabled ? 'device-disabled' : ''}`}>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <motion.span 
        className="toggle-slider"
        animate={checked ? {
          backgroundColor: '#10b981'
        } : {
          backgroundColor: '#374151'
        }}
        transition={{ duration: 0.2 }}
      ></motion.span>
    </label>
  );
};

export default ToggleSwitch;
