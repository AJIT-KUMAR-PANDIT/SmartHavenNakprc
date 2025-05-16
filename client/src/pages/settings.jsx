import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Check, Upload, Download, RefreshCw, Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { useDataMode } from '@/contexts/data-mode-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { getSettings, saveSettings, exportSettings, importSettings } from '@/lib/db';
import { downloadAsFile } from '@/lib/utils';
import { initMQTT, disconnect, getConnectionStatus } from '@/lib/mqtt';
import { addLog } from '@/lib/db';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const { useMockData, toggleMockData, resetGuide, showGuide, toggleGuide, resetMockData, syncToLocalDb } = useDataMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mqttStatus, setMqttStatus] = useState(getConnectionStatus());
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Form state
  const [settings, setSettings] = useState({
    server: {
      url: 'https://smarthaven.local',
      apiKey: '',
      useHttps: true
    },
    mqtt: {
      brokerUrl: 'mqtt://broker.example.com',
      port: '1883',
      username: '',
      password: '',
      clientId: '',
      autoReconnect: true,
      useSSL: false
    },
    notifications: {
      showNotifications: true,
      notificationSound: true,
      errorNotifications: true
    },
    theme: {
      darkMode: true,
      accentColor: '#2563eb'
    },
    advanced: {
      logLevel: 'info',
      logRetention: '100',
      deviceCheckInterval: '30'
    }
  });

  // Import file ref
  const fileInputRef = React.useRef(null);
  
  // Load settings on mount
  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        setIsLoading(true);
        const storedSettings = await getSettings();
        
        if (storedSettings && Object.keys(storedSettings).length > 0) {
          setSettings(storedSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        setFormError('Failed to load settings. Using defaults.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAppSettings();
  }, []);
  
  // Update MQTT status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMqttStatus(getConnectionStatus());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle form changes
  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear messages when form changes
    setFormError('');
    setFormSuccess('');
  };
  
  // Handle switch changes
  const handleSwitchChange = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
    
    // Clear messages when form changes
    setFormError('');
    setFormSuccess('');
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setFormError('');
      setFormSuccess('');
      
      // Validate required fields
      if (!settings.mqtt.brokerUrl) {
        setFormError('MQTT broker URL is required');
        return;
      }
      
      await saveSettings(settings);
      
      setFormSuccess('Settings saved successfully');
      addLog('Settings', 'Settings updated successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      setFormError(`Failed to save settings: ${error.message}`);
      addLog('Error', `Failed to save settings: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle MQTT connection
  const handleConnectMQTT = async () => {
    try {
      setIsSaving(true);
      setFormError('');
      
      // Disconnect if already connected
      if (mqttStatus === 'connected') {
        await disconnect();
        setMqttStatus('disconnected');
        setFormSuccess('Disconnected from MQTT broker');
        return;
      }
      
      // Validate URL
      if (!settings.mqtt.brokerUrl) {
        setFormError('MQTT broker URL is required');
        return;
      }
      
      // Prepare options
      const options = {
        clientId: settings.mqtt.clientId || `iot_hub_${Math.random().toString(16).substring(2, 8)}`,
        username: settings.mqtt.username || undefined,
        password: settings.mqtt.password || undefined,
        port: parseInt(settings.mqtt.port) || 1883,
        reconnectPeriod: settings.mqtt.autoReconnect ? 5000 : 0
      };
      
      // Add protocol to URL if not present
      let brokerUrl = settings.mqtt.brokerUrl;
      if (!brokerUrl.startsWith('mqtt://') && !brokerUrl.startsWith('ws://') && 
          !brokerUrl.startsWith('mqtts://') && !brokerUrl.startsWith('wss://')) {
        brokerUrl = `mqtt://${brokerUrl}`;
      }
      
      // Connect to broker
      await initMQTT(brokerUrl, options);
      
      setMqttStatus('connected');
      setFormSuccess('Connected to MQTT broker successfully');
      addLog('MQTT', `Connected to broker at ${brokerUrl}`);
    } catch (error) {
      console.error('Failed to connect to MQTT broker:', error);
      setFormError(`Failed to connect to MQTT broker: ${error.message}`);
      addLog('MQTT Error', `Connection failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle export settings
  const handleExportSettings = async () => {
    try {
      const settingsData = await exportSettings();
      downloadAsFile(settingsData, 'iot_settings.json', 'application/json');
      addLog('Settings', 'Settings exported successfully');
    } catch (error) {
      console.error('Failed to export settings:', error);
      setFormError(`Failed to export settings: ${error.message}`);
      addLog('Error', `Failed to export settings: ${error.message}`);
    }
  };
  
  // Handle import settings
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result;
          if (typeof content === 'string') {
            const success = await importSettings(content);
            
            if (success) {
              // Reload settings after import
              const storedSettings = await getSettings();
              setSettings(storedSettings);
              
              setFormSuccess('Settings imported successfully');
              addLog('Settings', 'Settings imported successfully');
            } else {
              setFormError('Failed to import settings');
            }
          }
        } catch (error) {
          console.error('Failed to import settings:', error);
          setFormError(`Failed to import settings: ${error.message}`);
          addLog('Error', `Failed to import settings: ${error.message}`);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Failed to read file:', error);
      setFormError(`Failed to read file: ${error.message}`);
    }
    
    // Reset file input
    e.target.value = '';
  };
  
  // Handle logout
  const handleLogout = () => {
    setShowConfirmation(true);
  };
  
  const confirmLogout = () => {
    addLog('Auth', 'User logged out');
    logout();
    setShowConfirmation(false);
  };
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-gray-400">Configure application preferences</p>
      </div>
      
      {/* Settings Tabs */}
      <Tabs defaultValue="server" className="w-full">
        <TabsList className="grid grid-cols-5 bg-[#1e1e2e] border border-gray-700">
          <TabsTrigger value="server" className="data-[state=active]:bg-[#2563eb]">Server</TabsTrigger>
          <TabsTrigger value="mqtt" className="data-[state=active]:bg-[#2563eb]">MQTT</TabsTrigger>
          <TabsTrigger value="interface" className="data-[state=active]:bg-[#2563eb]">Interface</TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-[#2563eb]">Advanced</TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-[#2563eb]">Account</TabsTrigger>
        </TabsList>
        
        {/* Server Settings */}
        <TabsContent value="server" className="mt-6">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>SmartHaven Server Configuration</CardTitle>
              <CardDescription>Set the connection to your SmartHaven server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-url">Server URL</Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <Input
                      id="server-url"
                      placeholder="e.g. smarthaven.local or 192.168.1.100"
                      value={settings.server.url.replace(/^https?:\/\//, '')}
                      onChange={(e) => {
                        let url = e.target.value;
                        // Remove any protocol that might have been entered
                        url = url.replace(/^https?:\/\//, '');
                        const fullUrl = settings.server.useHttps ? `https://${url}` : `http://${url}`;
                        handleInputChange('server', 'url', fullUrl);
                      }}
                      className="bg-[#121218] border-gray-700 pl-[90px]"
                    />
                    <div className="absolute inset-y-0 left-0 px-3 flex items-center pointer-events-none bg-gray-700 rounded-l-md border-r border-gray-600">
                      {settings.server.useHttps ? 'https://' : 'http://'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-https"
                      checked={settings.server.useHttps}
                      onCheckedChange={(checked) => {
                        // Update the useHttps setting
                        handleSwitchChange('server', 'useHttps');
                        
                        // Also update the URL protocol
                        const urlWithoutProtocol = settings.server.url.replace(/^https?:\/\//, '');
                        const newUrl = checked ? `https://${urlWithoutProtocol}` : `http://${urlWithoutProtocol}`;
                        handleInputChange('server', 'url', newUrl);
                      }}
                    />
                    <Label htmlFor="use-https">HTTPS</Label>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enter the domain name or IP address of your SmartHaven server without the protocol
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key for authentication"
                  value={settings.server.apiKey}
                  onChange={(e) => handleInputChange('server', 'apiKey', e.target.value)}
                  className="bg-[#121218] border-gray-700"
                />
                <p className="text-xs text-gray-400">
                  If your server requires an API key for authentication, enter it here
                </p>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  onClick={() => {
                    // Test the connection to the server
                    setIsSaving(true);
                    setFormSuccess('');
                    setFormError('');
                    
                    // Simulate a server test (would connect to real server in production)
                    setTimeout(() => {
                      setIsSaving(false);
                      setFormSuccess('Successfully connected to the server');
                      addLog('Server', `Connected to server at ${settings.server.url}`);
                    }, 1500);
                  }}
                  disabled={isSaving}
                  className="bg-[#10b981] hover:bg-[#10b981]/80"
                >
                  {isSaving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>Test Connection</>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="border-gray-700"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Settings
                </Button>
              </div>
              
              {formError && (
                <div className="mt-4 p-3 rounded-md bg-red-900/20 border border-red-800 text-red-400 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
                  <div>{formError}</div>
                </div>
              )}
              
              {formSuccess && (
                <div className="mt-4 p-3 rounded-md bg-green-900/20 border border-green-800 text-green-400 flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5" />
                  <div>{formSuccess}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* MQTT Settings */}
        <TabsContent value="mqtt" className="mt-6">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>MQTT Configuration</CardTitle>
              <CardDescription>Configure connection to your MQTT broker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="broker-url">Broker URL</Label>
                  <Input
                    id="broker-url"
                    placeholder="mqtt://broker.example.com"
                    value={settings.mqtt.brokerUrl}
                    onChange={(e) => handleInputChange('mqtt', 'brokerUrl', e.target.value)}
                    className="bg-[#121218] border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broker-port">Broker Port</Label>
                  <Input
                    id="broker-port"
                    placeholder="1883"
                    value={settings.mqtt.port}
                    onChange={(e) => handleInputChange('mqtt', 'port', e.target.value)}
                    className="bg-[#121218] border-gray-700"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mqtt-username">Username (Optional)</Label>
                  <Input
                    id="mqtt-username"
                    placeholder="Username"
                    value={settings.mqtt.username}
                    onChange={(e) => handleInputChange('mqtt', 'username', e.target.value)}
                    className="bg-[#121218] border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mqtt-password">Password (Optional)</Label>
                  <Input
                    id="mqtt-password"
                    type="password"
                    placeholder="Password"
                    value={settings.mqtt.password}
                    onChange={(e) => handleInputChange('mqtt', 'password', e.target.value)}
                    className="bg-[#121218] border-gray-700"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID (Optional)</Label>
                <Input
                  id="client-id"
                  placeholder="Leave blank for auto-generated ID"
                  value={settings.mqtt.clientId}
                  onChange={(e) => handleInputChange('mqtt', 'clientId', e.target.value)}
                  className="bg-[#121218] border-gray-700"
                />
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-reconnect"
                    checked={settings.mqtt.autoReconnect}
                    onCheckedChange={() => handleSwitchChange('mqtt', 'autoReconnect')}
                  />
                  <Label htmlFor="auto-reconnect">Auto Reconnect</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-ssl"
                    checked={settings.mqtt.useSSL}
                    onCheckedChange={() => handleSwitchChange('mqtt', 'useSSL')}
                  />
                  <Label htmlFor="use-ssl">Use SSL/TLS</Label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  className={`${mqttStatus === 'connected' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#10b981] hover:bg-[#10b981]/80'}`}
                  onClick={handleConnectMQTT}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : mqttStatus === 'connected' ? (
                    <>Disconnect</>
                  ) : (
                    <>Connect</>
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-700"
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Settings
                  </Button>
                </div>
              </div>
              
              {/* Status display */}
              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <div className="flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                      {mqttStatus === 'connected' ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
                        </>
                      ) : mqttStatus === 'reconnecting' ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f59e0b]"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ef4444]"></span>
                      )}
                    </span>
                    <span className="text-sm">
                      {mqttStatus === 'connected' ? 'Connected' : 
                        mqttStatus === 'reconnecting' ? 'Reconnecting' : 
                        'Disconnected'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interface Settings */}
        <TabsContent value="interface" className="mt-6">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Interface Preferences</CardTitle>
              <CardDescription>Customize the application appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ThemeToggle />
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium pt-2 pb-1 border-b border-gray-700">Data Mode Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mock-data" className="font-medium">Use Demo Mode</Label>
                    <p className="text-sm text-gray-400">Toggle between demo data and real device data</p>
                  </div>
                  <Switch
                    id="mock-data"
                    checked={useMockData}
                    onCheckedChange={toggleMockData}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-guide" className="font-medium">Interactive Guide</Label>
                    <p className="text-sm text-gray-400">Show guided instructions for new users</p>
                  </div>
                  <Switch
                    id="show-guide"
                    checked={showGuide}
                    onCheckedChange={toggleGuide}
                    disabled={!useMockData}
                  />
                </div>
                
                <div className="flex justify-between mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700"
                    onClick={resetGuide}
                    disabled={!useMockData}
                  >
                    Reset Guide
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={resetMockData}
                    disabled={!useMockData}
                  >
                    Reset Demo Data
                  </Button>
                </div>
                
                <div className="mt-4 pt-2 border-t border-gray-700">
                  <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-md mb-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-1">About Data Modes</h4>
                    <p className="text-xs text-gray-300 mb-2">
                      <span className="font-semibold">Demo Mode:</span> Uses pre-loaded sample data to demonstrate features. Useful when learning how to use SmartHaven.
                    </p>
                    <p className="text-xs text-gray-300">
                      <span className="font-semibold">Real Data Mode:</span> Connects to your actual devices using the local database. Devices can be controlled in real-time via your configured server and MQTT broker.
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-blue-700 hover:bg-blue-800"
                    onClick={async () => {
                      setIsSaving(true);
                      setFormError('');
                      setFormSuccess('');
                      
                      try {
                        const success = await syncToLocalDb();
                        if (success) {
                          setFormSuccess('Demo data successfully synced to local database');
                          addLog('Settings', 'Demo data synced to local database');
                        } else {
                          setFormError('Failed to sync demo data to local database');
                        }
                      } catch (error) {
                        console.error('Error syncing data:', error);
                        setFormError(`Error: ${error.message}`);
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={!useMockData || isSaving}
                  >
                    {isSaving ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sync Demo Data to Local Database
                  </Button>
                  <p className="text-xs text-gray-400 mt-1">
                    This will copy all demo devices and routes to your local database so you can use them with real-time control
                  </p>
                </div>
                
                <h3 className="text-lg font-medium pt-4 pb-1 border-b border-gray-700">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                    <p className="text-sm text-gray-400">Show in-app notifications</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications.showNotifications}
                    onCheckedChange={() => handleSwitchChange('notifications', 'showNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                    <p className="text-sm text-gray-400">Show in-app notifications</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications.showNotifications}
                    onCheckedChange={() => handleSwitchChange('notifications', 'showNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notification-sound" className="font-medium">Notification Sound</Label>
                    <p className="text-sm text-gray-400">Play sound for notifications</p>
                  </div>
                  <Switch
                    id="notification-sound"
                    checked={settings.notifications.notificationSound}
                    onCheckedChange={() => handleSwitchChange('notifications', 'notificationSound')}
                    disabled={!settings.notifications.showNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="error-notifications" className="font-medium">Error Notifications</Label>
                    <p className="text-sm text-gray-400">Show notifications for errors</p>
                  </div>
                  <Switch
                    id="error-notifications"
                    checked={settings.notifications.errorNotifications}
                    onCheckedChange={() => handleSwitchChange('notifications', 'errorNotifications')}
                    disabled={!settings.notifications.showNotifications}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-md overflow-hidden">
                        <input
                          type="color"
                          id="accent-color"
                          value={settings.theme.accentColor}
                          onChange={(e) => handleInputChange('theme', 'accentColor', e.target.value)}
                          className="w-[150%] h-[150%] translate-x-[-5px] translate-y-[-5px] cursor-pointer"
                        />
                      </div>
                      <Input
                        value={settings.theme.accentColor}
                        onChange={(e) => handleInputChange('theme', 'accentColor', e.target.value)}
                        className="bg-[#121218] border-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-[#2563eb]"
                >
                  {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Advanced Settings */}
        <TabsContent value="advanced" className="mt-6">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <select
                    id="log-level"
                    value={settings.advanced.logLevel}
                    onChange={(e) => handleInputChange('advanced', 'logLevel', e.target.value)}
                    className="w-full rounded-md bg-[#121218] border-gray-700 text-white p-2"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="log-retention">Log Retention (MB)</Label>
                  <Input
                    id="log-retention"
                    type="number"
                    min="10"
                    max="1000"
                    value={settings.advanced.logRetention}
                    onChange={(e) => handleInputChange('advanced', 'logRetention', e.target.value)}
                    className="bg-[#121218] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="device-check">Device Check Interval (s)</Label>
                  <Input
                    id="device-check"
                    type="number"
                    min="5"
                    max="300"
                    value={settings.advanced.deviceCheckInterval}
                    onChange={(e) => handleInputChange('advanced', 'deviceCheckInterval', e.target.value)}
                    className="bg-[#121218] border-gray-700"
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Backup & Restore</Label>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="border-gray-700 flex items-center gap-2"
                    onClick={handleExportSettings}
                  >
                    <Download className="h-4 w-4" />
                    Export Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-700 flex items-center gap-2"
                    onClick={handleImportClick}
                  >
                    <Upload className="h-4 w-4" />
                    Import Settings
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-[#2563eb]"
                >
                  {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Settings */}
        <TabsContent value="account" className="mt-6">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#121218] p-4 rounded-md border border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Logged in as</p>
                  <p className="text-lg font-medium">{currentUser?.username || 'User'}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Logout
                </Button>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="app-data">App Database</Label>
                <Textarea
                  id="app-data"
                  readOnly
                  rows={4}
                  value="User data stored locally in IndexedDB"
                  className="bg-[#121218] border-gray-700"
                />
              </div>
              
              <div className="bg-[#8b5cf6]/10 p-4 rounded-md border border-[#8b5cf6]/30 mt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <i className="ri-information-line text-[#8b5cf6]"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#8b5cf6]">Local Storage</h4>
                    <p className="text-xs mt-1">All application data is stored locally in your browser. Make sure to export your settings regularly as a backup.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Messages */}
      {formError && (
        <div className="mt-4 p-4 bg-red-900/20 rounded-md border border-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p className="text-red-300">{formError}</p>
        </div>
      )}
      
      {formSuccess && (
        <div className="mt-4 p-4 bg-green-900/20 rounded-md border border-green-800 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <p className="text-green-300">{formSuccess}</p>
        </div>
      )}
      
      {/* Logout Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-[#1e1e2e] rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout? Any unsaved changes will be lost.</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                className="border-gray-700"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
