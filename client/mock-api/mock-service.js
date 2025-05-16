// This file provides mock API services for client-side only operation
import * as db from '../src/lib/db';

// Create a class that simulates API responses
class MockAPIService {
  constructor() {
    this.initialized = false;
    this.initializeDB();
  }

  async initializeDB() {
    try {
      await db.initializeDB();
      console.log('Local database initialized');
      this.initialized = true;
      
      // Load demo data
      await this.loadDemoData();
      
      // Create a demo user if none exists
      const users = await db.getAllUsers();
      if (users.length === 0) {
        await db.createUser({
          username: 'demo',
          pin: '1234'
        });
        console.log('Created demo user: demo/1234');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
  
  // Load demo data from the mock-data.json file
  async loadDemoData() {
    try {
      const response = await fetch('/mock-data.json');
      const demoData = await response.json();
      
      // Add demo devices if none exist
      const devices = await db.getAllDevices();
      if (devices.length === 0 && demoData.demo_devices) {
        for (const device of demoData.demo_devices) {
          await db.addDevice(device);
        }
        console.log('Added demo devices');
      }
      
      // Add demo routes if none exist
      const routes = await db.getAllRoutes();
      if (routes.length === 0 && demoData.demo_routes) {
        for (const route of demoData.demo_routes) {
          await db.addRoute(route);
        }
        console.log('Added demo routes');
      }
      
      // Set default settings if none exist
      const settings = await db.getSettings();
      if (!settings || Object.keys(settings).length === 0) {
        if (demoData.default_settings) {
          await db.saveSettings(demoData.default_settings);
          console.log('Applied default settings');
        }
      }
    } catch (error) {
      console.error('Error loading demo data:', error);
    }
  }

  // Authentication methods
  async login(username, pin) {
    await this.ensureInitialized();
    const user = await db.authenticateUser(username, pin);
    
    if (user) {
      return { success: true, user };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async register(username, pin) {
    await this.ensureInitialized();
    const user = await db.createUser({ username, pin });
    
    if (user) {
      await db.addLog('Auth', `New user ${username} registered`);
      return { success: true, user };
    } else {
      throw new Error('Failed to create user');
    }
  }

  // Device methods
  async getDevices() {
    await this.ensureInitialized();
    return db.getAllDevices();
  }

  async addDevice(deviceData) {
    await this.ensureInitialized();
    return db.addDevice(deviceData);
  }

  async updateDevice(id, deviceData) {
    await this.ensureInitialized();
    return db.updateDevice(id, deviceData);
  }

  async deleteDevice(id) {
    await this.ensureInitialized();
    return db.removeDevice(id);
  }

  // Route methods
  async getRoutes() {
    await this.ensureInitialized();
    return db.getAllRoutes();
  }

  async addRoute(routeData) {
    await this.ensureInitialized();
    return db.addRoute(routeData);
  }

  async updateRoute(id, routeData) {
    await this.ensureInitialized();
    return db.updateRoute(id, routeData);
  }

  async deleteRoute(id) {
    await this.ensureInitialized();
    return db.removeRoute(id);
  }

  // Log methods
  async getLogs() {
    await this.ensureInitialized();
    return db.getAllLogs();
  }

  // Settings methods
  async getSettings() {
    await this.ensureInitialized();
    return db.getSettings();
  }

  async saveSettings(settingsData) {
    await this.ensureInitialized();
    return db.saveSettings(settingsData);
  }

  async exportSettings() {
    await this.ensureInitialized();
    const data = await db.exportSettings();
    return { data };
  }

  async importSettings(data) {
    await this.ensureInitialized();
    const success = await db.importSettings(data);
    return { success };
  }

  // Helper method to ensure DB is initialized
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeDB();
    }
  }
}

// Create singleton instance
const mockApiService = new MockAPIService();
export default mockApiService;