import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, Check, RefreshCw, Clock, Calendar, Slash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, timeElapsedSince } from '@/lib/utils';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [deviceLatency, setDeviceLatency] = useState({});
  const [serverConnected, setServerConnected] = useState(true);
  
  // Load notifications and system status
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls to your backend
        // For this example, we'll use mock data
        const mockNotifications = [
          {
            id: 'notif-1',
            title: 'New firmware update available',
            message: 'Update your devices to the latest firmware (v2.1.4) for improved performance and security.',
            type: 'info',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            source: 'system'
          },
          {
            id: 'notif-2',
            title: 'Energy usage alert',
            message: 'Your living room A/C has been running for 8 hours. Consider adjusting temperature to save energy.',
            type: 'warning',
            date: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
            read: true,
            source: 'system'
          },
          {
            id: 'notif-3',
            title: 'SmartHaven Cloud Services Maintenance',
            message: 'Scheduled maintenance will occur on May 20th from 2-4 AM UTC. Some cloud features may be temporarily unavailable.',
            type: 'info',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            read: false,
            source: 'company'
          },
          {
            id: 'notif-4',
            title: 'Security Alert',
            message: 'Multiple failed login attempts detected from IP 192.168.1.5. Account access has been temporarily restricted.',
            type: 'alert',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
            read: false,
            source: 'security'
          },
          {
            id: 'notif-5',
            title: 'Device offline',
            message: 'Bedroom light has been offline for more than 24 hours. Check device or reconnect to Wi-Fi.',
            type: 'alert',
            date: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
            read: true,
            source: 'system'
          },
        ];

        const mockSystemStatus = [
          {
            id: 'status-1',
            service: 'SmartHaven Cloud',
            status: 'operational',
            message: 'All systems operational',
            lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          },
          {
            id: 'status-2',
            service: 'Authentication Service',
            status: 'operational',
            message: 'All systems operational',
            lastUpdated: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          },
          {
            id: 'status-3',
            service: 'Device Management API',
            status: 'degraded',
            message: 'Experiencing minor delays in device updates',
            lastUpdated: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          },
          {
            id: 'status-4',
            service: 'Mobile App',
            status: 'operational',
            message: 'All systems operational',
            lastUpdated: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          },
          {
            id: 'status-5',
            service: 'Analytics Platform',
            status: 'incident',
            message: 'Scheduled maintenance in progress',
            lastUpdated: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          }
        ];
        
        // Generate mock device latency data
        const mockDeviceLatency = {
          'device-1': { id: 'device-1', name: 'Living Room Light', latency: 45, status: 'good' },
          'device-2': { id: 'device-2', name: 'Kitchen Motion Sensor', latency: 120, status: 'warning' },
          'device-3': { id: 'device-3', name: 'Bedroom Thermostat', latency: 380, status: 'critical' },
          'device-4': { id: 'device-4', name: 'Front Door Lock', latency: 65, status: 'good' },
          'device-5': { id: 'device-5', name: 'Garage Door', latency: 2100, status: 'offline' },
          'device-6': { id: 'device-6', name: 'Outdoor Camera', latency: 180, status: 'warning' },
        };

        setNotifications(mockNotifications);
        setSystemStatus(mockSystemStatus);
        setDeviceLatency(mockDeviceLatency);
        
        // Simulate server connection checking
        const isConnected = Math.random() > 0.2; // 80% chance to be connected
        setServerConnected(isConnected);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Auto refresh every 60 seconds
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear a notification
  const deleteNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.source === activeTab;
  });
  
  // Get notifications count by type
  const unreadCount = notifications.filter(n => !n.read).length;
  const systemCount = notifications.filter(n => n.source === 'system').length;
  const companyCount = notifications.filter(n => n.source === 'company').length;
  const securityCount = notifications.filter(n => n.source === 'security').length;
  
  // Get status color for latency
  const getLatencyStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get latency display text
  const getLatencyText = (latency, status) => {
    if (status === 'offline') return 'Offline';
    return `${latency} ms`;
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get badge color for system status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-600 hover:bg-green-700">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-amber-600 hover:bg-amber-700">Degraded</Badge>;
      case 'incident':
        return <Badge className="bg-red-600 hover:bg-red-700">Incident</Badge>;
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">Unknown</Badge>;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-3xl font-bold mb-2">Notifications & Status</h1>
      <p className="text-gray-400 mb-6">Stay updated with system notifications and device status</p>
      
      {/* Server connection status */}
      {!serverConnected && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 flex items-center">
          <Slash className="h-5 w-5 mr-2" />
          <div>
            <strong>Server disconnected.</strong> Some features may be unavailable. Check your network connection or server settings.
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main notifications panel */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge className="ml-2 bg-blue-600">{unreadCount} new</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Recent alerts and updates</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-700"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-700"
                    onClick={() => setNotifications([])}
                    disabled={notifications.length === 0}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="all" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all" className="data-[state=active]:bg-[#2563eb]">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="system" className="data-[state=active]:bg-[#2563eb]">
                    System ({systemCount})
                  </TabsTrigger>
                  <TabsTrigger value="company" className="data-[state=active]:bg-[#2563eb]">
                    Company ({companyCount})
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-[#2563eb]">
                    Security ({securityCount})
                  </TabsTrigger>
                </TabsList>
                
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center my-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <Bell className="h-12 w-12 mb-2" />
                      <p className="text-lg font-medium">No notifications</p>
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  ) : (
                    filteredNotifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg border ${notification.read ? 'border-gray-700 bg-[#171720]' : 'border-blue-800 bg-blue-900/10'}`}
                      >
                        <div className="flex">
                          <div className="mr-3">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h3 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                                {notification.title}
                              </h3>
                              <div className="flex">
                                {!notification.read && (
                                  <button 
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-blue-500 hover:text-blue-400 p-1"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-500 hover:text-gray-400 p-1"
                                >
                                  <Slash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <p className={`text-sm mb-2 ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{timeElapsedSince(notification.date)}</span>
                              <span className="mx-2">•</span>
                              <span className="capitalize">{notification.source}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Status panel */}
        <div>
          {/* System Status */}
          <Card className="bg-[#1e1e2e] border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-xl">System Status</CardTitle>
              <CardDescription>Current service availability</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center my-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {systemStatus.map(status => (
                    <div key={status.id} className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{status.service}</div>
                        <div className="text-sm text-gray-400">{status.message}</div>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(status.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Device Latency */}
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl">Device Latency</CardTitle>
              <CardDescription>Response time for connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center my-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.values(deviceLatency).map(device => (
                    <div key={device.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getLatencyStatusColor(device.status)} mr-3`}></div>
                        <span>{device.name}</span>
                      </div>
                      <div className="text-sm font-mono">
                        {getLatencyText(device.latency, device.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Good: &lt;100ms</span>
                  <span>Warning: 100-200ms</span>
                  <span>Critical: &gt;200ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsPage;