import React from 'react';
import { useTheme } from '@/hooks/use-theme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="bg-[#1e1e2e] rounded-xl p-5 shadow-md border border-gray-800">
      <h3 className="text-lg font-medium mb-4">Appearance</h3>
      
      <div className="grid grid-cols-3 gap-3">
        <div 
          className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border transition-all ${
            theme === 'light' 
              ? 'border-[#2563eb] bg-[#2563eb]/10' 
              : 'border-gray-700 hover:bg-gray-800'
          }`}
          onClick={() => setTheme('light')}
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2">
            <i className="ri-sun-line text-[#1e1e2e] text-xl"></i>
          </div>
          <span className={theme === 'light' ? 'text-white' : 'text-gray-400'}>Light</span>
        </div>
        
        <div 
          className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border transition-all ${
            theme === 'dark' 
              ? 'border-[#2563eb] bg-[#2563eb]/10' 
              : 'border-gray-700 hover:bg-gray-800'
          }`}
          onClick={() => setTheme('dark')}
        >
          <div className="w-10 h-10 bg-[#121218] rounded-full flex items-center justify-center mb-2">
            <i className="ri-moon-clear-line text-white text-xl"></i>
          </div>
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-400'}>Dark</span>
        </div>
        
        <div 
          className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border transition-all ${
            theme === 'system' 
              ? 'border-[#2563eb] bg-[#2563eb]/10' 
              : 'border-gray-700 hover:bg-gray-800'
          }`}
          onClick={() => setTheme('system')}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-white to-[#121218] rounded-full flex items-center justify-center mb-2">
            <i className="ri-computer-line text-gray-200 text-xl"></i>
          </div>
          <span className={theme === 'system' ? 'text-white' : 'text-gray-400'}>System</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        {theme === 'system' 
          ? 'Following your device settings. Currently using ' 
            + (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
            + ' mode.'
          : theme === 'dark'
            ? 'Using dark mode for all devices.'
            : 'Using light mode for all devices.'
        }
      </p>
    </div>
  );
}

export default ThemeToggle;