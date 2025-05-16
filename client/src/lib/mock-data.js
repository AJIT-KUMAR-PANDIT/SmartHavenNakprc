// Mock data for SmartHaven IoT application
// This provides default sample data for demonstration purposes

export const mockUsers = [
  {
    id: 'user_1',
    username: 'demo',
    pin: '1234',
    createdAt: '2024-05-01T10:00:00Z'
  }
];

export const mockDevices = [
  {
    id: 'device_1',
    name: 'Living Room Light',
    route: '/api/devices/light/1',
    type: 'light',
    pin: 5,
    status: 'online',
    lastSeen: new Date().toISOString(),
    brightness: 80
  },
  {
    id: 'device_2',
    name: 'Kitchen Light',
    route: '/api/devices/light/2',
    type: 'light',
    pin: 6,
    status: 'online',
    lastSeen: new Date().toISOString(),
    brightness: 100
  },
  {
    id: 'device_3',
    name: 'Bedroom Fan',
    route: '/api/devices/fan/1',
    type: 'fan',
    pin: 7,
    status: 'online',
    lastSeen: new Date().toISOString(),
    level: 2
  },
  {
    id: 'device_4',
    name: 'Temperature Sensor',
    route: '/api/devices/sensor/temp/1',
    type: 'temperature',
    pin: 8,
    status: 'online',
    lastSeen: new Date().toISOString(),
    value: 24.5,
    unit: '°C'
  },
  {
    id: 'device_5',
    name: 'Humidity Sensor',
    route: '/api/devices/sensor/humidity/1',
    type: 'humidity',
    pin: 9,
    status: 'online',
    lastSeen: new Date().toISOString(),
    value: 65,
    unit: '%'
  },
  {
    id: 'device_6',
    name: 'Garden Sprinkler',
    route: '/api/devices/sprinkler/1',
    type: 'sprinkler',
    pin: 10,
    status: 'offline',
    lastSeen: '2023-04-28T08:30:00Z'
  },
  {
    id: 'device_7',
    name: 'Smart TV',
    route: '/api/devices/tv/1',
    type: 'tv',
    pin: 11,
    status: 'online',
    lastSeen: new Date().toISOString()
  }
];

export const mockRoutes = [
  {
    id: 'route_1',
    route: '/api/devices/light/1',
    type: 'GET',
    method: 'getStatus',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  },
  {
    id: 'route_2',
    route: '/api/devices/light/1/toggle',
    type: 'POST',
    method: 'toggleLight',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  },
  {
    id: 'route_3',
    route: '/api/devices/light/1/brightness',
    type: 'POST',
    method: 'setBrightness',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  },
  {
    id: 'route_4',
    route: '/api/devices/fan/1',
    type: 'GET',
    method: 'getStatus',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  },
  {
    id: 'route_5',
    route: '/api/devices/fan/1/toggle',
    type: 'POST',
    method: 'toggleFan',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  },
  {
    id: 'route_6',
    route: '/api/devices/fan/1/speed',
    type: 'POST',
    method: 'setSpeed',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  },
  {
    id: 'route_7',
    route: '/api/devices/sensor/temp/1',
    type: 'GET',
    method: 'getTemperature',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  },
  {
    id: 'route_8',
    route: '/api/devices/sensor/humidity/1',
    type: 'GET',
    method: 'getHumidity',
    lastAccessed: new Date().toISOString(),
    deviceStatus: 'online'
  }
];

export const mockLogs = [
  {
    action: 'Login',
    message: 'User logged in successfully',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    action: 'Device',
    message: 'Living Room Light turned on',
    timestamp: new Date(Date.now() - 2400000).toISOString()
  },
  {
    action: 'Device',
    message: 'Kitchen Light brightness set to 80%',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    action: 'Device',
    message: 'Bedroom Fan speed changed to level 2',
    timestamp: new Date(Date.now() - 1200000).toISOString()
  },
  {
    action: 'System',
    message: 'Temperature alert: Above 24°C',
    timestamp: new Date(Date.now() - 900000).toISOString()
  },
  {
    action: 'Device',
    message: 'Garden Sprinkler connection lost',
    timestamp: new Date(Date.now() - 600000).toISOString()
  },
  {
    action: 'Settings',
    message: 'Application theme changed to dark mode',
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
];

export const mockSettings = {
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
};

export const mockRooms = [
  {
    id: 'room_1',
    name: 'Living Room',
    icon: 'sofa',
    devices: ['device_1', 'device_7'],
    color: '#2563eb'
  },
  {
    id: 'room_2',
    name: 'Kitchen',
    icon: 'utensils',
    devices: ['device_2'],
    color: '#10b981'
  },
  {
    id: 'room_3',
    name: 'Bedroom',
    icon: 'bed',
    devices: ['device_3'],
    color: '#8b5cf6'
  },
  {
    id: 'room_4',
    name: 'Garden',
    icon: 'tree',
    devices: ['device_6'],
    color: '#65a30d'
  },
  {
    id: 'room_5',
    name: 'Hallway',
    icon: 'door-open',
    devices: ['device_4', 'device_5'],
    color: '#f59e0b'
  }
];

export const mockScenes = [
  {
    id: 'scene_1',
    name: 'Movie Night',
    icon: 'film',
    devices: [
      { id: 'device_1', action: 'brightness', value: 20 },
      { id: 'device_2', action: 'toggle', value: 'off' },
      { id: 'device_3', action: 'level', value: 1 },
      { id: 'device_7', action: 'toggle', value: 'on' }
    ],
    color: '#8b5cf6'
  },
  {
    id: 'scene_2',
    name: 'Good Morning',
    icon: 'sun',
    devices: [
      { id: 'device_1', action: 'brightness', value: 100 },
      { id: 'device_2', action: 'toggle', value: 'on' },
      { id: 'device_3', action: 'toggle', value: 'off' }
    ],
    color: '#f59e0b'
  },
  {
    id: 'scene_3',
    name: 'Away Mode',
    icon: 'home',
    devices: [
      { id: 'device_1', action: 'toggle', value: 'off' },
      { id: 'device_2', action: 'toggle', value: 'off' },
      { id: 'device_3', action: 'toggle', value: 'off' },
      { id: 'device_6', action: 'toggle', value: 'off' },
      { id: 'device_7', action: 'toggle', value: 'off' }
    ],
    color: '#ef4444'
  }
];

export const mockAutomations = [
  {
    id: 'auto_1',
    name: 'Evening Lights',
    trigger: {
      type: 'time',
      value: '19:00'
    },
    actions: [
      { deviceId: 'device_1', action: 'brightness', value: 70 },
      { deviceId: 'device_2', action: 'toggle', value: 'on' }
    ],
    isActive: true
  },
  {
    id: 'auto_2',
    name: 'Temperature Control',
    trigger: {
      type: 'condition',
      sensor: 'device_4',
      condition: 'greater',
      value: 25
    },
    actions: [
      { deviceId: 'device_3', action: 'toggle', value: 'on' },
      { deviceId: 'device_3', action: 'level', value: 3 }
    ],
    isActive: true
  },
  {
    id: 'auto_3',
    name: 'Garden Watering',
    trigger: {
      type: 'schedule',
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '06:30'
    },
    actions: [
      { deviceId: 'device_6', action: 'toggle', value: 'on' }
    ],
    secondaryTrigger: {
      type: 'delay',
      value: 15
    },
    secondaryActions: [
      { deviceId: 'device_6', action: 'toggle', value: 'off' }
    ],
    isActive: false
  }
];

export const mockNotifications = [
  {
    id: 'notif_1',
    title: 'Temperature Alert',
    message: 'Temperature has exceeded 24°C',
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    type: 'warning',
    isRead: true
  },
  {
    id: 'notif_2',
    title: 'Device Offline',
    message: 'Garden Sprinkler is offline',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: 'error',
    isRead: true
  },
  {
    id: 'notif_3',
    title: 'Automation Executed',
    message: 'Evening Lights automation has been triggered',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    type: 'info',
    isRead: false
  },
  {
    id: 'notif_4',
    title: 'System Update Available',
    message: 'SmartHaven v2.1.0 is available for your devices',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    type: 'info',
    isRead: false
  },
  {
    id: 'notif_5',
    title: 'Energy Report',
    message: 'Weekly energy consumption report is ready',
    timestamp: new Date().toISOString(),
    type: 'success',
    isRead: false
  }
];

export const mockBillingData = {
  plan: {
    name: 'Premium Plan',
    price: 699,
    billing: 'monthly',
    features: [
      'Unlimited devices',
      'Advanced automations',
      'Energy analytics',
      'Priority support',
      'Cloud backup'
    ],
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  paymentMethods: [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    }
  ],
  invoices: [
    {
      id: 'in_1',
      amount: 699,
      status: 'paid',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      pdfUrl: '#'
    },
    {
      id: 'in_2',
      amount: 699,
      status: 'paid',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      pdfUrl: '#'
    }
  ],
  usageStats: {
    devicesUsed: 7,
    devicesLimit: 'Unlimited',
    storageUsed: 128,
    storageTotal: 1024,
    apiCalls: {
      current: 2437,
      limit: 10000
    }
  }
};

export const mockGuideSteps = [
  {
    title: 'Welcome to SmartHaven!',
    message: 'This interactive guide will help you get started with your smart home hub. You can enable or disable this guide anytime in the settings.',
    target: 'body',
    position: 'center'
  },
  {
    title: 'Dashboard Overview',
    message: 'This is your dashboard where you can see an overview of all your connected devices and quick stats.',
    target: '.dashboard-content',
    position: 'bottom'
  },
  {
    title: 'Device Control',
    message: 'Click on any device card to control it or see more details. You can turn devices on/off directly from here.',
    target: '.device-card',
    position: 'right'
  },
  {
    title: 'Navigation',
    message: 'Use this navigation menu to access different sections of the app like Devices, Rooms, Scenes, etc.',
    target: 'nav',
    position: 'right'
  },
  {
    title: 'Add New Device',
    message: 'Click here to add a new device to your smart home.',
    target: '.add-device-button',
    position: 'bottom'
  },
  {
    title: 'Voice Control',
    message: 'Click this microphone button to use voice commands to control your devices.',
    target: '.voice-control-button',
    position: 'top'
  },
  {
    title: 'Settings',
    message: 'Customize your app experience, configure MQTT and manage your preferences here.',
    target: 'a[href="/settings"]',
    position: 'left'
  },
  {
    title: 'Demo Mode',
    message: 'You are currently using demo mode with sample data. When you\'re ready to connect real devices, go to Settings > Interface and disable Demo Mode.',
    target: '.app-container',
    position: 'center'
  },
  {
    title: 'That\'s it!',
    message: 'You\'ve completed the basic tour of SmartHaven. Explore on your own or check out the Help section if you need assistance.',
    target: 'body',
    position: 'center'
  }
];

// Combine all mock data into a single object for easy access
export const mockData = {
  users: mockUsers,
  devices: mockDevices,
  routes: mockRoutes,
  logs: mockLogs,
  settings: mockSettings,
  rooms: mockRooms,
  scenes: mockScenes,
  automations: mockAutomations,
  notifications: mockNotifications,
  billing: mockBillingData,
  guideSteps: mockGuideSteps
};