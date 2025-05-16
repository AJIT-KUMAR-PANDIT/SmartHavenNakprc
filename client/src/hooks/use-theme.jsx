import { useState, useEffect, createContext, useContext } from 'react';

// Create a context for theme management
const ThemeContext = createContext(null);

// Theme provider component
export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark'); // default to dark mode
  const [systemTheme, setSystemTheme] = useState('dark');
  
  // Check for system preference on component mount
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('smartHavenTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemTheme(prefersDark ? 'dark' : 'light');
    
    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
      
      // If current theme is 'system', apply the system preference
      if (currentTheme === 'system') {
        document.documentElement.className = e.matches ? 'dark' : 'light';
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);
  
  // Apply theme changes
  useEffect(() => {
    if (currentTheme === 'system') {
      document.documentElement.className = systemTheme;
    } else {
      document.documentElement.className = currentTheme;
    }
  }, [currentTheme, systemTheme]);
  
  // Function to change theme
  const setTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('smartHavenTheme', theme);
  };
  
  // Provider value
  const value = {
    theme: currentTheme,
    systemTheme,
    setTheme,
    isDark: currentTheme === 'dark' || (currentTheme === 'system' && systemTheme === 'dark')
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}