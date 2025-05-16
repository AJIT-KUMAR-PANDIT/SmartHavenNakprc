import { users } from "@shared/schema";
import type { User, InsertUser, Device, Route, Log, Settings } from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Device management
  getDeviceById(id: string): Promise<Device | undefined>;
  getAllDevices(): Promise<Device[]>;
  addDevice(device: Omit<Device, "id">): Promise<Device>;
  updateDevice(id: string, deviceData: Partial<Device>): Promise<Device | undefined>;
  updateDeviceStatus(id: string, status: string): Promise<Device | undefined>;
  removeDevice(id: string): Promise<boolean>;
  
  // Route management
  getRouteById(id: string): Promise<Route | undefined>;
  getAllRoutes(): Promise<Route[]>;
  addRoute(route: Omit<Route, "id">): Promise<Route>;
  updateRoute(id: string, routeData: Partial<Route>): Promise<Route | undefined>;
  updateRouteAccess(route: string): Promise<Route | undefined>;
  removeRoute(id: string): Promise<boolean>;
  
  // Logs
  addLog(action: string, message: string): Promise<Log>;
  getAllLogs(): Promise<Log[]>;
  pruneOldLogs(): Promise<boolean>;
  
  // Settings
  saveSettings(settingsData: any): Promise<Settings>;
  getSettings(): Promise<Settings>;
  exportSettings(): Promise<string>;
  importSettings(data: string | object): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private devices: Map<string, Device>;
  private routes: Map<string, Route>;
  private logs: Log[];
  private settings: Settings | null;
  private currentId: number;
  
  constructor() {
    this.users = new Map();
    this.devices = new Map();
    this.routes = new Map();
    this.logs = [];
    this.settings = null;
    this.currentId = 1;
    
    // Initialize with default system routes
    this.addSystemRoutes();
  }
  
  private addSystemRoutes() {
    const systemRoutes = [
      {
        route: '/api/auth/login',
        type: 'system',
        action: 'Handle user authentication',
        method: 'POST',
        lastAccessed: null
      },
      {
        route: '/api/auth/register',
        type: 'system',
        action: 'Register new users',
        method: 'POST',
        lastAccessed: null
      },
      {
        route: '/api',
        type: 'system',
        action: 'API root endpoint',
        method: 'GET',
        lastAccessed: null
      }
    ];
    
    systemRoutes.forEach(route => {
      this.addRoute(route);
    });
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  // Device methods
  async getDeviceById(id: string): Promise<Device | undefined> {
    return this.devices.get(id);
  }
  
  async getAllDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }
  
  async addDevice(deviceData: Omit<Device, "id">): Promise<Device> {
    const id = this.generateId();
    const device: Device = { ...deviceData, id };
    this.devices.set(id, device);
    return device;
  }
  
  async updateDevice(id: string, deviceData: Partial<Device>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...deviceData };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }
  
  async updateDeviceStatus(id: string, status: string): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { 
      ...device, 
      status, 
      lastSeen: new Date().toISOString() 
    };
    
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }
  
  async removeDevice(id: string): Promise<boolean> {
    return this.devices.delete(id);
  }
  
  // Route methods
  async getRouteById(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }
  
  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }
  
  async addRoute(routeData: Omit<Route, "id">): Promise<Route> {
    const id = this.generateId();
    const route: Route = { ...routeData, id };
    this.routes.set(id, route);
    return route;
  }
  
  async updateRoute(id: string, routeData: Partial<Route>): Promise<Route | undefined> {
    const route = this.routes.get(id);
    if (!route) return undefined;
    
    const updatedRoute = { ...route, ...routeData };
    this.routes.set(id, updatedRoute);
    return updatedRoute;
  }
  
  async updateRouteAccess(routePath: string): Promise<Route | undefined> {
    const route = Array.from(this.routes.values()).find(r => r.route === routePath);
    if (!route) return undefined;
    
    const updatedRoute = { 
      ...route, 
      lastAccessed: new Date().toISOString() 
    };
    
    this.routes.set(route.id, updatedRoute);
    return updatedRoute;
  }
  
  async removeRoute(id: string): Promise<boolean> {
    return this.routes.delete(id);
  }
  
  // Log methods
  async addLog(action: string, message: string): Promise<Log> {
    const log = {
      action,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(log);
    
    // Check logs size and prune if needed
    await this.pruneOldLogs();
    
    return log;
  }
  
  async getAllLogs(): Promise<Log[]> {
    // Sort logs by timestamp (newest first)
    return [...this.logs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  
  async pruneOldLogs(): Promise<boolean> {
    // Simple pruning - keep only latest 5000 logs
    if (this.logs.length > 5000) {
      // Sort by timestamp (oldest first)
      this.logs.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // Remove oldest logs (everything beyond 5000)
      this.logs = this.logs.slice(this.logs.length - 5000);
      return true;
    }
    
    return false;
  }
  
  // Settings methods
  async saveSettings(settingsData: any): Promise<Settings> {
    this.settings = settingsData;
    return this.settings;
  }
  
  async getSettings(): Promise<Settings> {
    return this.settings || {};
  }
  
  async exportSettings(): Promise<string> {
    const data = {
      settings: this.settings,
      devices: Array.from(this.devices.values()),
      routes: Array.from(this.routes.values())
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  async importSettings(data: string | object): Promise<boolean> {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Import settings
      if (parsedData.settings) {
        this.settings = parsedData.settings;
      }
      
      // Import devices
      if (parsedData.devices && Array.isArray(parsedData.devices)) {
        this.devices.clear();
        parsedData.devices.forEach((device: Device) => {
          this.devices.set(device.id, device);
        });
      }
      
      // Import routes
      if (parsedData.routes && Array.isArray(parsedData.routes)) {
        this.routes.clear();
        parsedData.routes.forEach((route: Route) => {
          this.routes.set(route.id, route);
        });
        
        // Ensure system routes are present
        this.addSystemRoutes();
      }
      
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }
}

export const storage = new MemStorage();
