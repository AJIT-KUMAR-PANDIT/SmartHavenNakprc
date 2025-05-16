import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as WebSocket from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time communication
  const wss = new WebSocket.WebSocketServer({ server: httpServer });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial state to client
    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connection established' }));
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        if (data.type === 'device_control') {
          // Handle device control message
          const { deviceId, command } = data;
          
          // In a real application, this would communicate with MQTT
          // to control the actual device. Here we just update the state.
          const device = await storage.getDeviceById(deviceId);
          
          if (device) {
            const updatedDevice = await storage.updateDeviceStatus(deviceId, 
              command === 'on' ? 'online' : 'offline');
            
            // Broadcast device update to all clients
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'device_update',
                  device: updatedDevice
                }));
              }
            });
            
            // Log the action
            await storage.addLog('Device Control', `Device ${device.name} ${command}`);
            
            ws.send(JSON.stringify({
              type: 'control_response',
              success: true,
              deviceId,
              message: `Device ${command} command sent successfully`
            }));
          } else {
            ws.send(JSON.stringify({
              type: 'control_response',
              success: false,
              deviceId,
              message: 'Device not found'
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
  
  // ----- API Routes -----
  
  // User authentication
  app.post('/api/auth/login', async (req, res) => {
    const { username, pin } = req.body;
    
    if (!username || !pin) {
      return res.status(400).json({ message: 'Username and PIN are required' });
    }
    
    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.pin !== pin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      await storage.addLog('Auth', `User ${username} logged in`);
      res.json({ success: true, user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  });
  
  app.post('/api/auth/register', async (req, res) => {
    const { username, pin } = req.body;
    
    if (!username || !pin) {
      return res.status(400).json({ message: 'Username and PIN are required' });
    }
    
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Create user
      const user = await storage.createUser({ username, pin });
      
      await storage.addLog('Auth', `New user ${username} registered`);
      res.status(201).json({ success: true, user });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });
  
  // Device management
  app.get('/api/devices', async (req, res) => {
    try {
      const devices = await storage.getAllDevices();
      res.json(devices);
    } catch (error) {
      console.error('Get devices error:', error);
      res.status(500).json({ message: 'Failed to get devices' });
    }
  });
  
  app.post('/api/devices', async (req, res) => {
    const { name, route, type, pin } = req.body;
    
    if (!name || !route || !type || !pin) {
      return res.status(400).json({ message: 'All device fields are required' });
    }
    
    try {
      const device = await storage.addDevice({
        name,
        route,
        type,
        pin,
        status: 'offline',
        lastSeen: null
      });
      
      await storage.addLog('Device', `Added device ${name}`);
      
      // Notify connected clients about new device
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'device_added',
            device
          }));
        }
      });
      
      res.status(201).json(device);
    } catch (error) {
      console.error('Add device error:', error);
      res.status(500).json({ message: 'Failed to add device' });
    }
  });
  
  app.put('/api/devices/:id', async (req, res) => {
    const { id } = req.params;
    const deviceData = req.body;
    
    try {
      const device = await storage.updateDevice(id, deviceData);
      
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      
      await storage.addLog('Device', `Updated device ${device.name}`);
      
      // Notify connected clients about updated device
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'device_updated',
            device
          }));
        }
      });
      
      res.json(device);
    } catch (error) {
      console.error('Update device error:', error);
      res.status(500).json({ message: 'Failed to update device' });
    }
  });
  
  app.delete('/api/devices/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const device = await storage.getDeviceById(id);
      
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      
      await storage.removeDevice(id);
      await storage.addLog('Device', `Removed device ${device.name}`);
      
      // Notify connected clients about deleted device
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'device_deleted',
            deviceId: id
          }));
        }
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete device error:', error);
      res.status(500).json({ message: 'Failed to delete device' });
    }
  });
  
  // Route management
  app.get('/api/routes', async (req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      console.error('Get routes error:', error);
      res.status(500).json({ message: 'Failed to get routes' });
    }
  });
  
  app.post('/api/routes', async (req, res) => {
    const { route, type, action, method } = req.body;
    
    if (!route || !type) {
      return res.status(400).json({ message: 'Route and type are required' });
    }
    
    try {
      const routeObj = await storage.addRoute({
        route,
        type,
        action,
        method: method || 'GET',
        lastAccessed: null
      });
      
      await storage.addLog('Route', `Added route ${route}`);
      
      res.status(201).json(routeObj);
    } catch (error) {
      console.error('Add route error:', error);
      res.status(500).json({ message: 'Failed to add route' });
    }
  });
  
  app.put('/api/routes/:id', async (req, res) => {
    const { id } = req.params;
    const routeData = req.body;
    
    try {
      const route = await storage.updateRoute(id, routeData);
      
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      
      await storage.addLog('Route', `Updated route ${route.route}`);
      res.json(route);
    } catch (error) {
      console.error('Update route error:', error);
      res.status(500).json({ message: 'Failed to update route' });
    }
  });
  
  app.delete('/api/routes/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const route = await storage.getRouteById(id);
      
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      
      await storage.removeRoute(id);
      await storage.addLog('Route', `Removed route ${route.route}`);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete route error:', error);
      res.status(500).json({ message: 'Failed to delete route' });
    }
  });
  
  // Logs
  app.get('/api/logs', async (req, res) => {
    try {
      const logs = await storage.getAllLogs();
      res.json(logs);
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({ message: 'Failed to get logs' });
    }
  });
  
  // Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ message: 'Failed to get settings' });
    }
  });
  
  app.post('/api/settings', async (req, res) => {
    try {
      const settings = await storage.saveSettings(req.body);
      await storage.addLog('Settings', 'Updated application settings');
      res.json(settings);
    } catch (error) {
      console.error('Save settings error:', error);
      res.status(500).json({ message: 'Failed to save settings' });
    }
  });
  
  // Export settings
  app.get('/api/settings/export', async (req, res) => {
    try {
      const settingsData = await storage.exportSettings();
      res.json({ data: settingsData });
    } catch (error) {
      console.error('Export settings error:', error);
      res.status(500).json({ message: 'Failed to export settings' });
    }
  });
  
  // Import settings
  app.post('/api/settings/import', async (req, res) => {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({ message: 'No settings data provided' });
      }
      
      const success = await storage.importSettings(data);
      
      if (success) {
        await storage.addLog('Settings', 'Imported application settings');
        res.json({ success: true });
      } else {
        res.status(400).json({ message: 'Failed to import settings' });
      }
    } catch (error) {
      console.error('Import settings error:', error);
      res.status(500).json({ message: 'Failed to import settings' });
    }
  });

  return httpServer;
}
