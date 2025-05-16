import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '@/lib/mock-data';
import * as dbService from '@/lib/db';

// Create context for data mode (mock vs real)
const DataModeContext = createContext(null);

export function DataModeProvider({ children }) {
  const [useMockData, setUseMockData] = useState(false); // Default to real data
  const [showGuide, setShowGuide] = useState(true);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [mockDataStorage, setMockDataStorage] = useState(mockData);
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  // Initialize local database
  useEffect(() => {
    const initDb = async () => {
      try {
        await dbService.initializeDB();
        
        // Check if we have any data in the local database
        const existingDevices = await dbService.getAllDevices();
        const existingUsers = await dbService.getAllUsers();
        
        // If no real data exists yet, initialize with mock data in database
        if ((existingDevices && existingDevices.length === 0) && 
            (existingUsers && existingUsers.length === 0)) {
          console.log('No existing data found, initializing with mock data');
          
          // Initialize with a sample user if none exists
          if (mockData.users.length > 0) {
            await dbService.createUser(mockData.users[0]);
          }
          
          // Add sample devices
          if (mockData.devices.length > 0) {
            for (const device of mockData.devices) {
              await dbService.addDevice(device);
            }
          }
          
          // Add sample routes
          if (mockData.routes.length > 0) {
            for (const route of mockData.routes) {
              await dbService.addRoute(route);
            }
          }
          
          // Add sample logs
          if (mockData.logs.length > 0) {
            for (const log of mockData.logs) {
              await dbService.addLog(log.action, log.message);
            }
          }
          
          // Add default settings
          if (mockData.settings) {
            await dbService.saveSettings(mockData.settings);
          }
        }
        
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        // If we can't initialize the database, fall back to mock data
        setUseMockData(true);
      }
    };
    
    initDb();
  }, []);

  // Load settings from local storage
  useEffect(() => {
    const loadDataSettings = async () => {
      const savedSettings = localStorage.getItem('smarthaven_data_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setUseMockData(settings.useMockData ?? false);
        setShowGuide(settings.showGuide ?? true);
        setCurrentGuideStep(settings.currentGuideStep ?? 0);
      }
      
      // Also try to load any modified mock data
      const savedMockData = localStorage.getItem('smarthaven_mock_data');
      if (savedMockData) {
        try {
          const data = JSON.parse(savedMockData);
          setMockDataStorage(data);
        } catch (error) {
          console.error('Error loading mock data from storage:', error);
          // Fall back to default mock data
          setMockDataStorage(mockData);
        }
      }
    };
    
    loadDataSettings();
  }, []);

  // Save settings to local storage when they change
  useEffect(() => {
    const settings = {
      useMockData,
      showGuide,
      currentGuideStep
    };
    localStorage.setItem('smarthaven_data_settings', JSON.stringify(settings));
  }, [useMockData, showGuide, currentGuideStep]);

  // Save modified mock data to local storage
  const saveModifiedMockData = (updatedData) => {
    setMockDataStorage(updatedData);
    localStorage.setItem('smarthaven_mock_data', JSON.stringify(updatedData));
  };

  // Toggle between mock and real data
  const toggleMockData = () => {
    if (!isDbInitialized && !useMockData) {
      console.warn('Cannot switch to real data - database not initialized');
      return;
    }
    setUseMockData(!useMockData);
  };

  // Toggle guide visibility
  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  // Reset guide to beginning
  const resetGuide = () => {
    setCurrentGuideStep(0);
    setShowGuide(true);
  };

  // Advance to next guide step
  const nextGuideStep = () => {
    if (currentGuideStep < mockDataStorage.guideSteps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1);
    } else {
      // If we've reached the end of the guide, hide it
      setShowGuide(false);
    }
  };

  // Go back to previous guide step
  const prevGuideStep = () => {
    if (currentGuideStep > 0) {
      setCurrentGuideStep(currentGuideStep - 1);
    }
  };

  // Get current guide step
  const getCurrentGuideStep = () => {
    return mockDataStorage.guideSteps[currentGuideStep];
  };

  // Reset mock data to original values
  const resetMockData = () => {
    setMockDataStorage(mockData);
    localStorage.removeItem('smarthaven_mock_data');
  };

  // Synchronize real data from database to local storage
  const syncToLocalDb = async () => {
    if (useMockData) {
      try {
        // Add all mock devices to the real database
        for (const device of mockDataStorage.devices) {
          await dbService.addDevice(device);
        }
        
        // Add all mock routes to the real database
        for (const route of mockDataStorage.routes) {
          await dbService.addRoute(route);
        }
        
        // Add settings
        if (mockDataStorage.settings) {
          await dbService.saveSettings(mockDataStorage.settings);
        }
        
        return true;
      } catch (error) {
        console.error('Failed to sync mock data to database:', error);
        return false;
      }
    }
    return false;
  };

  // Context value to provide
  const value = {
    useMockData,
    toggleMockData,
    showGuide,
    toggleGuide,
    resetGuide,
    currentGuideStep,
    setCurrentGuideStep,
    nextGuideStep,
    prevGuideStep,
    getCurrentGuideStep,
    mockData: mockDataStorage,
    updateMockData: saveModifiedMockData,
    resetMockData,
    syncToLocalDb,
    isDbInitialized
  };

  return <DataModeContext.Provider value={value}>{children}</DataModeContext.Provider>;
}

// Hook to use data mode context
export function useDataMode() {
  const context = useContext(DataModeContext);
  
  if (context === undefined) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  
  return context;
}