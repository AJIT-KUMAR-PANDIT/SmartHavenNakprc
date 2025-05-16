import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useDevices } from '@/hooks/use-devices';
import { AlertCircle, AlertTriangle, Zap, DollarSign, Clock, Battery } from 'lucide-react';

const ElectricityMonitor = () => {
  const { devices } = useDevices();
  const [electricityRate, setElectricityRate] = useState(0.15); // Default rate per kWh
  const [deviceConsumption, setDeviceConsumption] = useState({});
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [timeFrame, setTimeFrame] = useState('daily');
  const [showSettings, setShowSettings] = useState(false);
  
  // Load saved electricity rate from localStorage
  useEffect(() => {
    const savedRate = localStorage.getItem('electricityRate');
    if (savedRate) {
      setElectricityRate(parseFloat(savedRate));
    }
    
    const savedConsumption = localStorage.getItem('deviceConsumption');
    if (savedConsumption) {
      setDeviceConsumption(JSON.parse(savedConsumption));
    } else {
      // Initialize device consumption data
      const initialConsumption = {};
      devices.forEach(device => {
        initialConsumption[device.id] = {
          wattage: getDefaultWattage(device.type),
          hoursPerDay: 5,
          isActive: true
        };
      });
      setDeviceConsumption(initialConsumption);
      localStorage.setItem('deviceConsumption', JSON.stringify(initialConsumption));
    }
  }, [devices]);
  
  // Calculate electricity consumption and cost whenever relevant data changes
  useEffect(() => {
    calculateConsumption();
  }, [deviceConsumption, electricityRate, timeFrame]);
  
  // Function to get default wattage based on device type
  const getDefaultWattage = (deviceType) => {
    const wattageMap = {
      'light': 60,
      'fan': 75,
      'ac': 1500,
      'tv': 100,
      'refrigerator': 150,
      'waterheater': 4000,
      'computer': 200,
      'speaker': 30,
      'switch': 5,
      'sensor': 2,
      'default': 50
    };
    
    return wattageMap[deviceType] || wattageMap.default;
  };
  
  // Calculate the consumption and cost
  const calculateConsumption = () => {
    let totalKwh = 0;
    
    Object.entries(deviceConsumption).forEach(([deviceId, data]) => {
      if (data.isActive) {
        const device = devices.find(d => d.id === deviceId);
        if (device && device.status === 'online') {
          // Calculate kWh: (wattage × hours used per day ÷ 1000)
          const dailyKwh = (data.wattage * data.hoursPerDay) / 1000;
          
          // Calculate based on timeframe
          let timeFrameKwh = dailyKwh;
          if (timeFrame === 'weekly') {
            timeFrameKwh = dailyKwh * 7;
          } else if (timeFrame === 'monthly') {
            timeFrameKwh = dailyKwh * 30;
          } else if (timeFrame === 'yearly') {
            timeFrameKwh = dailyKwh * 365;
          }
          
          totalKwh += timeFrameKwh;
        }
      }
    });
    
    setTotalConsumption(totalKwh);
    setTotalCost(totalKwh * electricityRate);
  };
  
  // Handle changing device consumption values
  const handleDeviceConsumptionChange = (deviceId, field, value) => {
    setDeviceConsumption(prev => {
      const updated = {
        ...prev,
        [deviceId]: {
          ...prev[deviceId],
          [field]: field === 'isActive' ? value : parseFloat(value)
        }
      };
      
      localStorage.setItem('deviceConsumption', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Save electricity rate
  const saveElectricityRate = () => {
    localStorage.setItem('electricityRate', electricityRate);
    setShowSettings(false);
  };
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-3xl font-bold mb-6">Electricity Monitor</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-[#1e1e2e] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-blue-500/10">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Consumption</p>
                <h3 className="text-2xl font-bold">{formatNumber(totalConsumption)} kWh</h3>
                <p className="text-xs text-gray-500">{timeFrame} usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1e1e2e] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-green-500/10">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Estimated Cost</p>
                <h3 className="text-2xl font-bold">${formatNumber(totalCost)}</h3>
                <p className="text-xs text-gray-500">{timeFrame} bill</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1e1e2e] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-purple-500/10">
                <Battery className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Current Rate</p>
                <h3 className="text-2xl font-bold">${electricityRate}/kWh</h3>
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className="text-xs text-blue-500 hover:underline"
                >
                  Change rate
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Rate settings popup */}
      {showSettings && (
        <Card className="bg-[#1e1e2e] border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>Electricity Rate Settings</CardTitle>
            <CardDescription>Update your electricity cost per kWh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="electricity-rate">Cost per kWh ($)</Label>
                  <Input
                    id="electricity-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(parseFloat(e.target.value))}
                    className="bg-[#121218] border-gray-700"
                  />
                </div>
                <Button onClick={saveElectricityRate}>Save Rate</Button>
              </div>
              
              <div className="text-sm text-gray-400">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                This rate will be used to calculate electricity costs for all your devices.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Time frame selector */}
      <div className="mb-8">
        <Tabs defaultValue="daily" value={timeFrame} onValueChange={setTimeFrame}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Device consumption list */}
      <Card className="bg-[#1e1e2e] border-gray-700">
        <CardHeader>
          <CardTitle>Device Consumption Settings</CardTitle>
          <CardDescription>
            Configure power consumption for each device for accurate calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <p className="text-lg font-medium">No devices found</p>
                <p className="text-sm">Add devices to track their energy consumption</p>
              </div>
            ) : (
              devices.map(device => {
                const consumption = deviceConsumption[device.id] || {
                  wattage: getDefaultWattage(device.type),
                  hoursPerDay: 5,
                  isActive: true
                };
                
                const isActive = consumption.isActive && device.status === 'online';
                const dailyKwh = (consumption.wattage * consumption.hoursPerDay) / 1000;
                const dailyCost = dailyKwh * electricityRate;
                
                // Calculate based on timeframe
                let timeFrameKwh = dailyKwh;
                let timeFrameCost = dailyCost;
                if (timeFrame === 'weekly') {
                  timeFrameKwh = dailyKwh * 7;
                  timeFrameCost = dailyCost * 7;
                } else if (timeFrame === 'monthly') {
                  timeFrameKwh = dailyKwh * 30;
                  timeFrameCost = dailyCost * 30;
                } else if (timeFrame === 'yearly') {
                  timeFrameKwh = dailyKwh * 365;
                  timeFrameCost = dailyCost * 365;
                }
                
                return (
                  <div key={device.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'} mr-3`}></div>
                        <h3 className="text-lg font-medium">{device.name}</h3>
                        <Badge variant="outline" className="ml-2">
                          {device.type}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={consumption.isActive}
                            onChange={(e) => handleDeviceConsumptionChange(device.id, 'isActive', e.target.checked)}
                            disabled={device.status !== 'online'}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ml-3 text-sm font-medium text-gray-400">
                            {consumption.isActive ? 'Tracking' : 'Excluded'}
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`wattage-${device.id}`}>Power (Watts)</Label>
                        <Input
                          id={`wattage-${device.id}`}
                          type="number"
                          value={consumption.wattage}
                          onChange={(e) => handleDeviceConsumptionChange(device.id, 'wattage', e.target.value)}
                          className="bg-[#121218] border-gray-700"
                          disabled={!consumption.isActive || device.status !== 'online'}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`hours-${device.id}`}>Hours/Day</Label>
                        <Input
                          id={`hours-${device.id}`}
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={consumption.hoursPerDay}
                          onChange={(e) => handleDeviceConsumptionChange(device.id, 'hoursPerDay', e.target.value)}
                          className="bg-[#121218] border-gray-700"
                          disabled={!consumption.isActive || device.status !== 'online'}
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            Consumption: <span className="font-semibold text-white">{timeFrameKwh.toFixed(2)} kWh</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Cost: <span className="font-semibold text-green-500">${timeFrameCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ElectricityMonitor;