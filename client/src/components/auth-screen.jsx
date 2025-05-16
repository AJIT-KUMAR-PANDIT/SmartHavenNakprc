import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Keypad from '@/components/ui/keypad';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle } from 'lucide-react';

const AuthScreen = () => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, signup, authError, isLoading } = useAuth();
  
  const handlePinComplete = async (pin) => {
    setError('');
    
    if (!username) {
      setError('Please enter a username');
      return false;
    }
    
    try {
      if (mode === 'login') {
        const success = await login(username, pin);
        return success;
      } else {
        const success = await signup(username, pin);
        return success;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121218] px-4 animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <i className="ri-hub-fill text-7xl text-[#2563eb]"></i>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#10b981] animate-pulse-slow"></div>
          </div>
          <h1 className="text-3xl font-bold mt-4 mb-2">SmartHaven</h1>
          <p className="text-gray-400">
            {mode === 'login' ? 'Enter your PIN to unlock' : 'Create a new account'}
          </p>
          
          {/* Username input field */}
          <div className="mt-4 mb-6">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {(error || authError) && (
            <motion.div 
              className="mb-4 p-3 rounded-md bg-red-900/20 border border-red-800 text-red-200 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error || authError}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Keypad 
          onComplete={handlePinComplete} 
          pinLength={4} 
          onError={setError}
        />
        
        <div className="mt-8 flex justify-between">
          <button 
            className="text-[#8b5cf6] hover:underline"
            onClick={toggleMode}
          >
            {mode === 'login' ? 'Create Account' : 'Login Instead'}
          </button>
          
          <button className="text-[#8b5cf6] hover:underline flex items-center">
            <i className="ri-fingerprint-line mr-1"></i> Use Biometric
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthScreen;
