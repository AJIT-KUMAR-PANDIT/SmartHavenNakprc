import Loki from 'lokijs';

// Create a LokiJS database
let db = null;
let initialized = false;

// Collections
let users = null;
let devices = null;
let routes = null;
let logs = null;
let settings = null;

const DB_NAME = 'iotcontrol.db';
const MAX_LOG_SIZE = 100 * 1024 * 1024; // 100 MB

// Initialize the database
export function initializeDB() {
  return new Promise((resolve, reject) => {
    if (initialized) {
      resolve(db);
      return;
    }

    db = new Loki(DB_NAME, {
      autoload: true,
      autoloadCallback: databaseInitialize,
      autosave: true,
      autosaveInterval: 4000
    });

    function databaseInitialize() {
      users = db.getCollection('users');
      if (users === null) {
        users = db.addCollection('users', { indices: ['username'] });
      }

      devices = db.getCollection('devices');
      if (devices === null) {
        devices = db.addCollection('devices', { indices: ['id', 'route'] });
      }

      routes = db.getCollection('routes');
      if (routes === null) {
        routes = db.addCollection('routes', { indices: ['route'] });
      }

      logs = db.getCollection('logs');
      if (logs === null) {
        logs = db.addCollection('logs', { indices: ['timestamp'] });
      }

      settings = db.getCollection('settings');
      if (settings === null) {
        settings = db.addCollection('settings');
      }

      initialized = true;
      resolve(db);
    }
  });
}

// User functions
export function createUser(userData) {
  return initializeDB().then(() => {
    const existingUser = users.findOne({ username: userData.username });
    if (existingUser) {
      return existingUser;
    }
    return users.insert({ ...userData, createdAt: new Date() });
  });
}

export function authenticateUser(username, pin) {
  return initializeDB().then(() => {
    const user = users.findOne({ username, pin });
    return user;
  });
}

export function getAllUsers() {
  return initializeDB().then(() => {
    return users.find();
  });
}

// Device functions
export function addDevice(deviceData) {
  return initializeDB().then(() => {
    const existingDevice = devices.findOne({ route: deviceData.route });
    if (existingDevice) {
      return existingDevice;
    }
    const device = {
      ...deviceData,
      id: generateId(),
      status: 'offline',
      createdAt: new Date(),
      lastSeen: null
    };
    const result = devices.insert(device);
    addLog('Device Added', `Added device ${device.name} at route ${device.route}`);
    return result;
  });
}

export function updateDevice(id, deviceData) {
  return initializeDB().then(() => {
    const device = devices.findOne({ id });
    if (!device) return null;
    
    Object.assign(device, deviceData);
    devices.update(device);
    addLog('Device Updated', `Updated device ${device.name}`);
    return device;
  });
}

export function updateDeviceStatus(id, status) {
  return initializeDB().then(() => {
    const device = devices.findOne({ id });
    if (!device) return null;
    
    device.status = status;
    device.lastSeen = new Date();
    devices.update(device);
    addLog('Device Status', `Device ${device.name} is now ${status}`);
    return device;
  });
}

export function removeDevice(id) {
  return initializeDB().then(() => {
    const device = devices.findOne({ id });
    if (!device) return false;
    
    devices.remove(device);
    addLog('Device Removed', `Removed device ${device.name}`);
    return true;
  });
}

export function getAllDevices() {
  return initializeDB().then(() => {
    return devices.find();
  });
}

// Route functions
export function addRoute(routeData) {
  return initializeDB().then(() => {
    const existingRoute = routes.findOne({ route: routeData.route });
    if (existingRoute) {
      return existingRoute;
    }
    const route = {
      ...routeData,
      id: generateId(),
      createdAt: new Date(),
      lastAccessed: null
    };
    const result = routes.insert(route);
    addLog('Route Added', `Added route ${route.route}`);
    return result;
  });
}

export function updateRoute(id, routeData) {
  return initializeDB().then(() => {
    const route = routes.findOne({ id });
    if (!route) return null;
    
    Object.assign(route, routeData);
    routes.update(route);
    addLog('Route Updated', `Updated route ${route.route}`);
    return route;
  });
}

export function updateRouteAccess(route) {
  return initializeDB().then(() => {
    const routeObj = routes.findOne({ route });
    if (!routeObj) return null;
    
    routeObj.lastAccessed = new Date();
    routes.update(routeObj);
    return routeObj;
  });
}

export function removeRoute(id) {
  return initializeDB().then(() => {
    const route = routes.findOne({ id });
    if (!route) return false;
    
    routes.remove(route);
    addLog('Route Removed', `Removed route ${route.route}`);
    return true;
  });
}

export function getAllRoutes() {
  return initializeDB().then(() => {
    return routes.find();
  });
}

// Log functions
export function addLog(action, message) {
  return initializeDB().then(() => {
    const log = {
      action,
      message,
      timestamp: new Date()
    };
    logs.insert(log);
    
    // Check logs size and prune if needed
    pruneOldLogs();
    
    return log;
  });
}

export function getAllLogs() {
  return initializeDB().then(() => {
    return logs.chain().find().simplesort('timestamp', true).data();
  });
}

export function exportLogs() {
  return initializeDB().then(() => {
    const allLogs = logs.chain().find().simplesort('timestamp', true).data();
    return JSON.stringify(allLogs, null, 2);
  });
}

function pruneOldLogs() {
  // Simple approximation of the size
  if (logs.count() > 10000) {
    // Get oldest logs (anything beyond last 5000 entries)
    const oldestLogs = logs.chain().find().simplesort('timestamp').limit(logs.count() - 5000).data();
    
    // Remove them
    oldestLogs.forEach(log => {
      logs.remove(log);
    });
    
    return true;
  }
  return false;
}

// Settings functions
export function saveSettings(settingsData) {
  return initializeDB().then(() => {
    const existingSettings = settings.findOne({ id: 'app-settings' });
    if (existingSettings) {
      Object.assign(existingSettings, settingsData);
      settings.update(existingSettings);
      return existingSettings;
    } else {
      const newSettings = {
        ...settingsData,
        id: 'app-settings'
      };
      return settings.insert(newSettings);
    }
  });
}

export function getSettings() {
  return initializeDB().then(() => {
    return settings.findOne({ id: 'app-settings' }) || {};
  });
}

export function exportSettings() {
  return initializeDB().then(() => {
    const allSettings = {
      settings: settings.find(),
      devices: devices.find(),
      routes: routes.find()
    };
    return JSON.stringify(allSettings, null, 2);
  });
}

export function importSettings(data) {
  return initializeDB().then(() => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Clear existing data
      if (parsedData.settings && Array.isArray(parsedData.settings)) {
        settings.clear();
        parsedData.settings.forEach(setting => {
          settings.insert(setting);
        });
      }
      
      if (parsedData.devices && Array.isArray(parsedData.devices)) {
        devices.clear();
        parsedData.devices.forEach(device => {
          devices.insert(device);
        });
      }
      
      if (parsedData.routes && Array.isArray(parsedData.routes)) {
        routes.clear();
        parsedData.routes.forEach(route => {
          routes.insert(route);
        });
      }
      
      addLog('Settings Imported', 'Successfully imported settings');
      return true;
    } catch (error) {
      addLog('Import Error', `Failed to import settings: ${error.message}`);
      return false;
    }
  });
}

// Utility function to generate a random ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
