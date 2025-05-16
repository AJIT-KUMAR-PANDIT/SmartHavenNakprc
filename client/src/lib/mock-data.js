/**
 * Mock data for SmartHaven application
 * This file provides sample data for development and demo purposes
 */

// Mock user data
export const mockUsers = [
  {
    id: 'user-001',
    username: 'demo',
    pin: '1234',
    createdAt: '2023-11-15T09:30:00.000Z'
  },
  {
    id: 'user-002',
    username: 'admin',
    pin: '0000',
    createdAt: '2023-10-10T14:20:00.000Z'
  }
];

// Mock device data
export const mockDevices = [
  {
    id: 'device-001',
    name: 'Living Room Light',
    route: '/devices/light/1',
    type: 'light',
    pin: 5,
    status: 'online',
    lastSeen: '2023-12-01T12:43:00.000Z',
    brightness: 80,
    powerUsage: {
      watts: 9.5,
      dailyUsage: 1.2, // kWh
      monthlyUsage: 36.4, // kWh
      cost: 5.46 // $ per month
    },
    responseTime: 120, // in milliseconds
    uptime: 99.8, // percentage
    firmwareVersion: '1.2.4'
  },
  {
    id: 'device-002',
    name: 'Kitchen Light',
    route: '/devices/light/2',
    type: 'light',
    pin: 6,
    status: 'offline',
    lastSeen: '2023-12-01T10:15:00.000Z',
    brightness: 0,
    powerUsage: {
      watts: 11.0,
      dailyUsage: 0.9, // kWh
      monthlyUsage: 28.5, // kWh
      cost: 4.28 // $ per month
    },
    responseTime: 0, // offline
    uptime: 95.2, // percentage
    firmwareVersion: '1.2.3'
  },
  {
    id: 'device-003',
    name: 'Living Room Fan',
    route: '/devices/fan/1',
    type: 'fan',
    pin: 7,
    status: 'online',
    lastSeen: '2023-12-01T12:44:30.000Z',
    level: 2,
    powerUsage: {
      watts: 45.0,
      dailyUsage: 3.6, // kWh
      monthlyUsage: 108.0, // kWh
      cost: 16.20 // $ per month
    },
    responseTime: 135, // in milliseconds
    uptime: 98.9, // percentage
    firmwareVersion: '1.1.7'
  },
  {
    id: 'device-004',
    name: 'Bedroom Air Conditioner',
    route: '/devices/ac/1',
    type: 'ac',
    pin: 8,
    status: 'online',
    lastSeen: '2023-12-01T12:40:00.000Z',
    temperature: 23,
    mode: 'cool',
    powerUsage: {
      watts: 1200.0,
      dailyUsage: 8.4, // kWh
      monthlyUsage: 252.0, // kWh
      cost: 37.80 // $ per month
    },
    responseTime: 180, // in milliseconds
    uptime: 99.2, // percentage
    firmwareVersion: '2.0.1'
  },
  {
    id: 'device-005',
    name: 'Front Door Lock',
    route: '/devices/lock/1',
    type: 'lock',
    pin: 9,
    status: 'online',
    lastSeen: '2023-12-01T12:42:15.000Z',
    locked: true,
    powerUsage: {
      watts: 2.0,
      dailyUsage: 0.05, // kWh
      monthlyUsage: 1.44, // kWh
      cost: 0.22 // $ per month
    },
    responseTime: 95, // in milliseconds
    uptime: 99.9, // percentage
    firmwareVersion: '3.1.2'
  },
  {
    id: 'device-006',
    name: 'Living Room Temperature Sensor',
    route: '/devices/sensor/temp/1',
    type: 'temperature',
    pin: 10,
    status: 'online',
    lastSeen: '2023-12-01T12:43:45.000Z',
    value: 24.5,
    unit: '°C',
    powerUsage: {
      watts: 0.5,
      dailyUsage: 0.012, // kWh
      monthlyUsage: 0.36, // kWh
      cost: 0.05 // $ per month
    },
    responseTime: 85, // in milliseconds
    uptime: 99.7, // percentage
    firmwareVersion: '1.0.5'
  },
  {
    id: 'device-007',
    name: 'Kitchen Motion Sensor',
    route: '/devices/sensor/motion/1',
    type: 'motion',
    pin: 11,
    status: 'online',
    lastSeen: '2023-12-01T12:44:00.000Z',
    detected: false,
    lastDetection: '2023-12-01T11:32:15.000Z',
    powerUsage: {
      watts: 0.8,
      dailyUsage: 0.019, // kWh
      monthlyUsage: 0.58, // kWh
      cost: 0.09 // $ per month
    },
    responseTime: 65, // in milliseconds
    uptime: 99.8, // percentage
    firmwareVersion: '1.3.0'
  },
  {
    id: 'device-008',
    name: 'Garden Irrigation System',
    route: '/devices/irrigation/1',
    type: 'irrigation',
    pin: 12,
    status: 'online',
    lastSeen: '2023-12-01T12:40:30.000Z',
    active: false,
    nextSchedule: '2023-12-02T06:00:00.000Z',
    powerUsage: {
      watts: 35.0,
      dailyUsage: 0.28, // kWh (assuming 8 hours of operation a week)
      monthlyUsage: 8.4, // kWh
      cost: 1.26 // $ per month
    },
    responseTime: 155, // in milliseconds
    uptime: 97.5, // percentage
    firmwareVersion: '2.1.3'
  }
];

// Mock route data
export const mockRoutes = [
  {
    id: 'route-001',
    route: '/devices/light/1',
    type: 'device',
    action: 'control',
    method: 'POST',
    lastAccessed: '2023-12-01T12:43:00.000Z',
    deviceStatus: 'online'
  },
  {
    id: 'route-002',
    route: '/devices/light/2',
    type: 'device',
    action: 'control',
    method: 'POST',
    lastAccessed: '2023-12-01T10:15:00.000Z',
    deviceStatus: 'offline'
  },
  {
    id: 'route-003',
    route: '/devices/fan/1',
    type: 'device',
    action: 'control',
    method: 'POST',
    lastAccessed: '2023-12-01T12:44:30.000Z',
    deviceStatus: 'online'
  },
  {
    id: 'route-004',
    route: '/devices/ac/1',
    type: 'device',
    action: 'control',
    method: 'POST',
    lastAccessed: '2023-12-01T12:40:00.000Z',
    deviceStatus: 'online'
  },
  {
    id: 'route-005',
    route: '/devices/lock/1',
    type: 'device',
    action: 'control',
    method: 'POST',
    lastAccessed: '2023-12-01T12:42:15.000Z',
    deviceStatus: 'online'
  },
  {
    id: 'route-006',
    route: '/devices/sensor/temp/1',
    type: 'sensor',
    action: 'read',
    method: 'GET',
    lastAccessed: '2023-12-01T12:43:45.000Z',
    deviceStatus: 'online'
  },
  {
    id: 'route-007',
    route: '/devices/sensor/motion/1',
    type: 'sensor',
    action: 'read',
    method: 'GET',
    lastAccessed: '2023-12-01T12:44:00.000Z',
    deviceStatus: 'online'
  },
  {
    id: 'route-008',
    route: '/devices/irrigation/1',
    type: 'device',
    action: 'control',
    method: 'POST',
    lastAccessed: '2023-12-01T12:40:30.000Z',
    deviceStatus: 'online'
  },
  {
    id: 'route-009',
    route: '/status',
    type: 'system',
    action: 'status',
    method: 'GET',
    lastAccessed: '2023-12-01T12:45:00.000Z'
  }
];

// Mock log data
export const mockLogs = [
  {
    action: 'Device Control',
    message: 'Living Room Light turned on',
    timestamp: '2023-12-01T12:43:00.000Z'
  },
  {
    action: 'Device Status',
    message: 'Kitchen Light went offline',
    timestamp: '2023-12-01T10:15:00.000Z'
  },
  {
    action: 'Device Control',
    message: 'Living Room Fan speed changed to level 2',
    timestamp: '2023-12-01T12:44:30.000Z'
  },
  {
    action: 'Device Control',
    message: 'Bedroom Air Conditioner temperature set to 23°C',
    timestamp: '2023-12-01T12:40:00.000Z'
  },
  {
    action: 'Device Control',
    message: 'Front Door Lock secured',
    timestamp: '2023-12-01T12:42:15.000Z'
  },
  {
    action: 'Sensor Reading',
    message: 'Living Room Temperature: 24.5°C',
    timestamp: '2023-12-01T12:43:45.000Z'
  },
  {
    action: 'System',
    message: 'Daily backup completed successfully',
    timestamp: '2023-12-01T00:00:15.000Z'
  },
  {
    action: 'Auth',
    message: 'User demo logged in',
    timestamp: '2023-12-01T09:23:45.000Z'
  },
  {
    action: 'Device Control',
    message: 'Garden Irrigation System scheduled for tomorrow at 06:00',
    timestamp: '2023-12-01T12:40:30.000Z'
  },
  {
    action: 'Sensor Alert',
    message: 'Motion detected in Kitchen',
    timestamp: '2023-12-01T11:32:15.000Z'
  },
  {
    action: 'System',
    message: 'Firmware update available for 3 devices',
    timestamp: '2023-12-01T03:15:00.000Z'
  },
  {
    action: 'Device Status',
    message: 'All devices connection check completed',
    timestamp: '2023-12-01T12:45:00.000Z'
  }
];

// Mock settings data
export const mockSettings = {
  mqtt: {
    brokerUrl: 'mqtt.smarthaven.example.com',
    port: '1883',
    username: 'demo_user',
    password: 'demo_password',
    clientId: 'smarthaven_app_' + Math.random().toString(16).substring(2, 8),
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
    accentColor: '#2563eb' // Blue
  },
  advanced: {
    logLevel: 'info',
    logRetention: '30',
    deviceCheckInterval: '60'
  },
  mockData: {
    enabled: true,
    showGuide: true
  },
  server: {
    url: 'https://api.smarthaven.example.com',
    timeout: 5000,
    retryAttempts: 3
  }
};

// Mock rooms data
export const mockRooms = [
  {
    id: 'room-001',
    name: 'Living Room',
    icon: 'ri-sofa-line',
    devices: ['device-001', 'device-003', 'device-006'],
    order: 1
  },
  {
    id: 'room-002',
    name: 'Kitchen',
    icon: 'ri-fridge-line',
    devices: ['device-002', 'device-007'],
    order: 2
  },
  {
    id: 'room-003',
    name: 'Bedroom',
    icon: 'ri-hotel-bed-line',
    devices: ['device-004'],
    order: 3
  },
  {
    id: 'room-004',
    name: 'Front Door',
    icon: 'ri-door-lock-line',
    devices: ['device-005'],
    order: 4
  },
  {
    id: 'room-005',
    name: 'Garden',
    icon: 'ri-plant-line',
    devices: ['device-008'],
    order: 5
  }
];

// Mock scenes data
export const mockScenes = [
  {
    id: 'scene-001',
    name: 'Good Morning',
    icon: 'ri-sun-line',
    actions: [
      { deviceId: 'device-001', action: 'turn_on', brightness: 80 },
      { deviceId: 'device-002', action: 'turn_on', brightness: 100 },
      { deviceId: 'device-005', action: 'unlock' }
    ],
    active: false,
    order: 1
  },
  {
    id: 'scene-002',
    name: 'Good Night',
    icon: 'ri-moon-line',
    actions: [
      { deviceId: 'device-001', action: 'turn_off' },
      { deviceId: 'device-002', action: 'turn_off' },
      { deviceId: 'device-003', action: 'turn_off' },
      { deviceId: 'device-004', action: 'turn_off' },
      { deviceId: 'device-005', action: 'lock' }
    ],
    active: false,
    order: 2
  },
  {
    id: 'scene-003',
    name: 'Movie Time',
    icon: 'ri-movie-line',
    actions: [
      { deviceId: 'device-001', action: 'turn_on', brightness: 20 },
      { deviceId: 'device-002', action: 'turn_off' },
      { deviceId: 'device-003', action: 'turn_on', level: 1 }
    ],
    active: false,
    order: 3
  },
  {
    id: 'scene-004',
    name: 'Away Mode',
    icon: 'ri-run-line',
    actions: [
      { deviceId: 'device-001', action: 'turn_off' },
      { deviceId: 'device-002', action: 'turn_off' },
      { deviceId: 'device-003', action: 'turn_off' },
      { deviceId: 'device-004', action: 'turn_off' },
      { deviceId: 'device-005', action: 'lock' }
    ],
    active: false,
    order: 4
  }
];

// Mock automations data
export const mockAutomations = [
  {
    id: 'automation-001',
    name: 'Morning Routine',
    description: 'Turn on lights and unlock doors at 7 AM',
    trigger: {
      type: 'time',
      time: '07:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    actions: [
      { deviceId: 'device-001', action: 'turn_on', brightness: 80 },
      { deviceId: 'device-002', action: 'turn_on', brightness: 100 },
      { deviceId: 'device-005', action: 'unlock' }
    ],
    enabled: true,
    lastRun: '2023-12-01T07:00:00.000Z'
  },
  {
    id: 'automation-002',
    name: 'Night Mode',
    description: 'Turn off all devices at 10:30 PM',
    trigger: {
      type: 'time',
      time: '22:30',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    actions: [
      { deviceId: 'device-001', action: 'turn_off' },
      { deviceId: 'device-002', action: 'turn_off' },
      { deviceId: 'device-003', action: 'turn_off' },
      { deviceId: 'device-004', action: 'turn_off' },
      { deviceId: 'device-005', action: 'lock' }
    ],
    enabled: true,
    lastRun: '2023-11-30T22:30:00.000Z'
  },
  {
    id: 'automation-003',
    name: 'Kitchen Motion Light',
    description: 'Turn on kitchen light when motion is detected',
    trigger: {
      type: 'sensor',
      deviceId: 'device-007',
      condition: 'motion_detected'
    },
    actions: [
      { deviceId: 'device-002', action: 'turn_on', brightness: 100 }
    ],
    conditions: [
      { type: 'time_range', start: '17:00', end: '23:00' }
    ],
    enabled: true,
    lastRun: '2023-12-01T11:32:15.000Z'
  },
  {
    id: 'automation-004',
    name: 'Temperature Control',
    description: 'Turn on AC when temperature exceeds 26°C',
    trigger: {
      type: 'sensor',
      deviceId: 'device-006',
      condition: 'value_above',
      value: 26
    },
    actions: [
      { deviceId: 'device-004', action: 'turn_on', temperature: 23, mode: 'cool' }
    ],
    enabled: true,
    lastRun: null
  }
];

// Mock notifications data
export const mockNotifications = [
  {
    id: 'notification-001',
    title: 'Kitchen Light Offline',
    message: 'The Kitchen Light has gone offline. Please check the device.',
    type: 'alert',
    read: false,
    timestamp: '2023-12-01T10:15:00.000Z'
  },
  {
    id: 'notification-002',
    title: 'Motion Detected',
    message: 'Motion was detected in the Kitchen area.',
    type: 'info',
    read: true,
    timestamp: '2023-12-01T11:32:15.000Z'
  },
  {
    id: 'notification-003',
    title: 'Firmware Update Available',
    message: 'Firmware updates are available for 3 devices. Go to Settings to update.',
    type: 'update',
    read: false,
    timestamp: '2023-12-01T03:15:00.000Z'
  },
  {
    id: 'notification-004',
    title: 'Front Door Unlocked',
    message: 'The Front Door was unlocked using the app.',
    type: 'security',
    read: true,
    timestamp: '2023-12-01T09:25:00.000Z'
  },
  {
    id: 'notification-005',
    title: 'Low Battery',
    message: 'Kitchen Motion Sensor has low battery (15%). Please replace batteries soon.',
    type: 'warning',
    read: false,
    timestamp: '2023-12-01T07:45:00.000Z'
  },
  {
    id: 'notification-006',
    title: 'Welcome to SmartHaven!',
    message: 'Thank you for installing the SmartHaven app. Explore your dashboard to see what you can do.',
    type: 'welcome',
    read: true,
    timestamp: '2023-11-15T09:35:00.000Z'
  },
  {
    id: 'notification-007',
    title: 'New Feature Available',
    message: 'Voice control is now available! Try controlling your devices using voice commands.',
    type: 'feature',
    read: false,
    timestamp: '2023-11-30T14:00:00.000Z'
  }
];

// Mock billing data for electricity monitoring
export const mockBillingData = {
  rates: {
    standard: 0.15, // $ per kWh
    offPeak: 0.10, // $ per kWh
    peak: 0.22 // $ per kWh
  },
  currentBillingPeriod: {
    startDate: '2023-11-01T00:00:00.000Z',
    endDate: '2023-11-30T23:59:59.000Z',
    totalKwh: 427.5,
    totalCost: 64.13,
    previousPeriodKwh: 398.2,
    previousPeriodCost: 59.73,
    percentageChange: 7.4
  },
  usage: {
    daily: [
      { date: '2023-11-24', kwh: 14.2, cost: 2.13 },
      { date: '2023-11-25', kwh: 13.8, cost: 2.07 },
      { date: '2023-11-26', kwh: 15.1, cost: 2.27 },
      { date: '2023-11-27', kwh: 14.5, cost: 2.18 },
      { date: '2023-11-28', kwh: 14.7, cost: 2.21 },
      { date: '2023-11-29', kwh: 13.9, cost: 2.09 },
      { date: '2023-11-30', kwh: 14.8, cost: 2.22 }
    ],
    monthly: [
      { month: 'Jun', kwh: 310.5, cost: 46.58 },
      { month: 'Jul', kwh: 375.2, cost: 56.28 },
      { month: 'Aug', kwh: 412.8, cost: 61.92 },
      { month: 'Sep', kwh: 367.5, cost: 55.13 },
      { month: 'Oct', kwh: 398.2, cost: 59.73 },
      { month: 'Nov', kwh: 427.5, cost: 64.13 }
    ],
    deviceShare: [
      { deviceId: 'device-004', name: 'Bedroom Air Conditioner', kwh: 252.0, cost: 37.80, percentage: 59 },
      { deviceId: 'device-003', name: 'Living Room Fan', kwh: 108.0, cost: 16.20, percentage: 25 },
      { deviceId: 'device-001', name: 'Living Room Light', kwh: 36.4, cost: 5.46, percentage: 9 },
      { deviceId: 'device-002', name: 'Kitchen Light', kwh: 28.5, cost: 4.28, percentage: 7 },
      { deviceId: 'device-008', name: 'Garden Irrigation System', kwh: 8.4, cost: 1.26, percentage: 2 },
      { deviceId: 'other', name: 'Other Devices', kwh: 4.2, cost: 0.63, percentage: 1 }
    ]
  },
  predictions: {
    nextMonth: {
      estimatedKwh: 445.0,
      estimatedCost: 66.75,
      percentageChange: 4.1
    },
    savingTips: [
      'Reduce AC temperature by 2°C to save up to 15% on cooling costs',
      'Use smart scheduling to turn off devices when not in use',
      'Replace old bulbs with LED lighting to reduce consumption',
      'Schedule energy-intensive activities during off-peak hours'
    ]
  }
};

// Guide steps for the application tutorial
export const mockGuideSteps = [
  {
    id: 'guide-001',
    title: 'Welcome to SmartHaven!',
    message: 'This guide will help you understand how to use the app. You can always find this guide in the settings menu.',
    target: 'body',
    position: 'center',
    order: 1
  },
  {
    id: 'guide-002',
    title: 'Dashboard Overview',
    message: 'Here you can see all your connected devices and their current status.',
    target: '.dashboard-content',
    position: 'bottom',
    order: 2
  },
  {
    id: 'guide-003',
    title: 'Device Control',
    message: 'Click on any device card to control it or see more details.',
    target: '.device-card',
    position: 'bottom',
    order: 3
  },
  {
    id: 'guide-004',
    title: 'Voice Control',
    message: 'Use the microphone button to control your devices with voice commands.',
    target: '.voice-control-button',
    position: 'top',
    order: 4
  },
  {
    id: 'guide-005',
    title: 'Rooms Organization',
    message: 'View your devices organized by rooms for easier management.',
    target: '.rooms-link',
    position: 'right',
    order: 5
  },
  {
    id: 'guide-006',
    title: 'Energy Monitoring',
    message: 'Track your devices\' energy usage and see cost estimates.',
    target: '.electricity-link',
    position: 'right',
    order: 6
  },
  {
    id: 'guide-007',
    title: 'Notifications',
    message: 'Check here for important alerts and updates about your smart home.',
    target: '.notifications-link',
    position: 'left',
    order: 7
  },
  {
    id: 'guide-008',
    title: 'Settings',
    message: 'Configure your app preferences and connection settings here.',
    target: '.settings-link',
    position: 'left',
    order: 8
  },
  {
    id: 'guide-009',
    title: 'Mock Data Mode',
    message: 'Currently, you\'re seeing sample data. To use real data, disable Mock Data Mode in Settings.',
    target: '.mock-data-toggle',
    position: 'bottom',
    order: 9
  },
  {
    id: 'guide-010',
    title: 'Ready to Go!',
    message: 'You\'re all set to start using SmartHaven. Enjoy your smart home experience!',
    target: 'body',
    position: 'center',
    order: 10
  }
];

// Export all mock data as a single object for easier imports
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
  billingData: mockBillingData,
  guideSteps: mockGuideSteps
};