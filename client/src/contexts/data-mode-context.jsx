import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '@/lib/mock-data';

// Create context for data mode (mock vs real)
const DataModeContext = createContext();

export function DataModeProvider({ children }) {
  const [useMockData, setUseMockData] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [mockDataStorage, setMockDataStorage] = useState(mockData);

  // Load settings from local storage
  useEffect(() => {
    const savedSettings = localStorage.getItem('smarthaven_data_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setUseMockData(settings.useMockData ?? true);
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
    resetMockData
  };

  return <DataModeContext.Provider value={value}>{children}</DataModeContext.Provider>;
}

// Hook to use data mode context
export function useDataMode() {
  const context = useContext(DataModeContext);
  
  if (!context) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  
  return context;
}