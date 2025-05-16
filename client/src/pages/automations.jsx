import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Plus, X, Clock, Play, Pause, Save } from 'lucide-react';
import useDevices from '@/hooks/use-devices';

// Simplified automation page for IoT controls
// In a real application, this would have complete CRUD operations
// and integration with a rule engine

const Automations = () => {
  const { devices } = useDevices();
  const [automations, setAutomations] = useState([
    {
      id: '1',
      name: 'Turn on lights at sunset',
      enabled: true,
      trigger: {
        type: 'time',
        time: '18:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      },
      action: {
        type: 'device',
        deviceId: 'light-1',
        command: 'on'
      }
    },
    {
      id: '2',
      name: 'Turn off lights at midnight',
      enabled: true,
      trigger: {
        type: 'time',
        time: '00:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      },
      action: {
        type: 'device',
        deviceId: 'light-1',
        command: 'off'
      }
    },
    {
      id: '3',
      name: 'Temperature alert',
      enabled: false,
      trigger: {
        type: 'condition',
        deviceId: 'sensor-1',
        property: 'temperature',
        operator: '>',
        value: '30'
      },
      action: {
        type: 'notification',
        message: 'Temperature is too high!'
      }
    }
  ]);
  
  const [showNewAutomation, setShowNewAutomation] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    enabled: true,
    trigger: {
      type: 'time',
      time: '12:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    },
    action: {
      type: 'device',
      deviceId: '',
      command: 'on'
    }
  });
  
  const toggleAutomation = (id) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === id 
          ? { ...automation, enabled: !automation.enabled } 
          : automation
      )
    );
  };
  
  const deleteAutomation = (id) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      setAutomations(prev => prev.filter(automation => automation.id !== id));
    }
  };
  
  const handleInputChange = (field, value) => {
    setNewAutomation(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleTriggerChange = (field, value) => {
    setNewAutomation(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        [field]: value
      }
    }));
  };
  
  const handleActionChange = (field, value) => {
    setNewAutomation(prev => ({
      ...prev,
      action: {
        ...prev.action,
        [field]: value
      }
    }));
  };
  
  const saveNewAutomation = () => {
    // Validate
    if (!newAutomation.name) {
      alert('Please enter a name for the automation');
      return;
    }
    
    if (newAutomation.action.type === 'device' && !newAutomation.action.deviceId) {
      alert('Please select a device for the action');
      return;
    }
    
    // Add to list
    const automation = {
      ...newAutomation,
      id: Date.now().toString()
    };
    
    setAutomations(prev => [...prev, automation]);
    
    // Reset form
    setNewAutomation({
      name: '',
      enabled: true,
      trigger: {
        type: 'time',
        time: '12:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      },
      action: {
        type: 'device',
        deviceId: '',
        command: 'on'
      }
    });
    
    setShowNewAutomation(false);
  };
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Automations</h2>
          <p className="text-gray-400">Automate your IoT devices</p>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#2563eb]"
          onClick={() => setShowNewAutomation(true)}
        >
          <Plus className="h-4 w-4" />
          Add Automation
        </Button>
      </div>
      
      {/* Coming Soon Message */}
      <div className="mb-6 p-4 bg-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-[#8b5cf6]" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#8b5cf6]">Feature Preview</h4>
            <p className="text-xs mt-1">The automations feature is currently in development. Limited functionality is available.</p>
          </div>
        </div>
      </div>
      
      {/* Automations List */}
      {automations.length === 0 && !showNewAutomation ? (
        <div className="text-center py-10 bg-[#1e1e2e] rounded-lg">
          <i className="ri-flow-chart text-5xl text-gray-500"></i>
          <p className="mt-2 text-gray-400">No automations created yet</p>
          <Button
            className="mt-4 bg-[#2563eb]"
            onClick={() => setShowNewAutomation(true)}
          >
            Create Your First Automation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {automations.map((automation) => (
            <motion.div 
              key={automation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#1e1e2e] border-gray-700 overflow-hidden">
                <div className={`h-1 w-full ${automation.enabled ? 'bg-[#10b981]' : 'bg-gray-700'}`}></div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{automation.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={automation.enabled}
                        onCheckedChange={() => toggleAutomation(automation.id)}
                      />
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => deleteAutomation(automation.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {automation.enabled ? 'Active' : 'Inactive'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="bg-[#2563eb]/20 p-1.5 rounded-full mt-0.5">
                        <Clock className="h-4 w-4 text-[#2563eb]" />
                      </div>
                      <div>
                        <span className="text-sm font-medium">Trigger</span>
                        <p className="text-xs text-gray-400">
                          {automation.trigger.type === 'time' 
                            ? `At ${automation.trigger.time} every day` 
                            : `When ${automation.trigger.property} ${automation.trigger.operator} ${automation.trigger.value}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-[#10b981]/20 p-1.5 rounded-full mt-0.5">
                        {automation.action.type === 'device' 
                          ? automation.action.command === 'on' 
                            ? <Play className="h-4 w-4 text-[#10b981]" />
                            : <Pause className="h-4 w-4 text-[#10b981]" />
                          : <i className="ri-notification-3-line text-[#10b981]"></i>
                        }
                      </div>
                      <div>
                        <span className="text-sm font-medium">Action</span>
                        <p className="text-xs text-gray-400">
                          {automation.action.type === 'device'
                            ? `Turn ${automation.action.command} device`
                            : `Send notification: ${automation.action.message}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {/* New Automation Form */}
          {showNewAutomation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#1e1e2e] border-gray-700 border-dashed overflow-hidden">
                <div className="h-1 w-full bg-[#8b5cf6]"></div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Input
                        className="bg-[#121218] border-gray-700 text-lg font-medium"
                        placeholder="Automation name"
                        value={newAutomation.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Switch
                        checked={newAutomation.enabled}
                        onCheckedChange={(checked) => handleInputChange('enabled', checked)}
                      />
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => setShowNewAutomation(false)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {newAutomation.enabled ? 'Will be active when created' : 'Will be inactive when created'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    <div className="bg-[#121218] p-3 rounded-md">
                      <Label className="text-xs text-gray-400 mb-2 block">Trigger</Label>
                      <div className="space-y-3">
                        <Select 
                          value={newAutomation.trigger.type} 
                          onValueChange={(value) => handleTriggerChange('type', value)}
                        >
                          <SelectTrigger className="bg-[#1e1e2e] border-gray-700">
                            <SelectValue placeholder="Select trigger type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e1e2e] border-gray-700">
                            <SelectItem value="time">Schedule (Time)</SelectItem>
                            <SelectItem value="condition">Condition</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {newAutomation.trigger.type === 'time' && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-400 mb-1 block">Time</Label>
                              <Input
                                type="time"
                                value={newAutomation.trigger.time}
                                onChange={(e) => handleTriggerChange('time', e.target.value)}
                                className="bg-[#1e1e2e] border-gray-700"
                              />
                            </div>
                          </div>
                        )}
                        
                        {newAutomation.trigger.type === 'condition' && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-400 mb-1 block">Device</Label>
                              <Select 
                                value={newAutomation.trigger.deviceId} 
                                onValueChange={(value) => handleTriggerChange('deviceId', value)}
                              >
                                <SelectTrigger className="bg-[#1e1e2e] border-gray-700">
                                  <SelectValue placeholder="Select device" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1e2e] border-gray-700">
                                  {devices?.map(device => (
                                    <SelectItem key={device.id} value={device.id}>
                                      {device.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Label className="text-xs text-gray-400 mb-1 block">Property</Label>
                                <Select 
                                  value={newAutomation.trigger.property} 
                                  onValueChange={(value) => handleTriggerChange('property', value)}
                                >
                                  <SelectTrigger className="bg-[#1e1e2e] border-gray-700">
                                    <SelectValue placeholder="Property" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#1e1e2e] border-gray-700">
                                    <SelectItem value="temperature">Temperature</SelectItem>
                                    <SelectItem value="humidity">Humidity</SelectItem>
                                    <SelectItem value="status">Status</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs text-gray-400 mb-1 block">Operator</Label>
                                <Select 
                                  value={newAutomation.trigger.operator} 
                                  onValueChange={(value) => handleTriggerChange('operator', value)}
                                >
                                  <SelectTrigger className="bg-[#1e1e2e] border-gray-700">
                                    <SelectValue placeholder="Operator" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#1e1e2e] border-gray-700">
                                    <SelectItem value="=">=</SelectItem>
                                    <SelectItem value=">">{">"}</SelectItem>
                                    <SelectItem value="<">{"<"}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs text-gray-400 mb-1 block">Value</Label>
                                <Input
                                  value={newAutomation.trigger.value}
                                  onChange={(e) => handleTriggerChange('value', e.target.value)}
                                  className="bg-[#1e1e2e] border-gray-700"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-[#121218] p-3 rounded-md">
                      <Label className="text-xs text-gray-400 mb-2 block">Action</Label>
                      <div className="space-y-3">
                        <Select 
                          value={newAutomation.action.type} 
                          onValueChange={(value) => handleActionChange('type', value)}
                        >
                          <SelectTrigger className="bg-[#1e1e2e] border-gray-700">
                            <SelectValue placeholder="Select action type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e1e2e] border-gray-700">
                            <SelectItem value="device">Control Device</SelectItem>
                            <SelectItem value="notification">Send Notification</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {newAutomation.action.type === 'device' && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-400 mb-1 block">Device</Label>
                              <Select 
                                value={newAutomation.action.deviceId} 
                                onValueChange={(value) => handleActionChange('deviceId', value)}
                              >
                                <SelectTrigger className="bg-[#1e1e2e] border-gray-700">
                                  <SelectValue placeholder="Select device" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1e2e] border-gray-700">
                                  {devices?.map(device => (
                                    <SelectItem key={device.id} value={device.id}>
                                      {device.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-xs text-gray-400 mb-1 block">Command</Label>
                              <Select 
                                value={newAutomation.action.command} 
                                onValueChange={(value) => handleActionChange('command', value)}
                              >
                                <SelectTrigger className="bg-[#1e1e2e] border-gray-700">
                                  <SelectValue placeholder="Select command" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1e2e] border-gray-700">
                                  <SelectItem value="on">Turn On</SelectItem>
                                  <SelectItem value="off">Turn Off</SelectItem>
                                  <SelectItem value="toggle">Toggle</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        {newAutomation.action.type === 'notification' && (
                          <div>
                            <Label className="text-xs text-gray-400 mb-1 block">Message</Label>
                            <Input
                              value={newAutomation.action.message || ''}
                              onChange={(e) => handleActionChange('message', e.target.value)}
                              placeholder="Notification message"
                              className="bg-[#1e1e2e] border-gray-700"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Button
                    onClick={saveNewAutomation}
                    className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create Automation
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Automations;
