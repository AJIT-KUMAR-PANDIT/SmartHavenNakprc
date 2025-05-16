import mqtt from 'mqtt';
import { addLog, updateDeviceStatus } from './db';

let client = null;
let connectionStatus = 'disconnected';
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Event callbacks
let onConnectCallbacks = [];
let onMessageCallbacks = [];
let onErrorCallbacks = [];
let onDisconnectCallbacks = [];

// Initialize MQTT client
export function initMQTT(brokerUrl, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Default options
      const defaultOptions = {
        clientId: 'iotcontrol_' + Math.random().toString(16).substring(2, 8),
        reconnectPeriod: 5000, // 5 seconds
        connectTimeout: 30000, // 30 seconds
        clean: true
      };
      
      // Merge with user options
      const mqttOptions = { ...defaultOptions, ...options };
      
      // Create the client
      client = mqtt.connect(brokerUrl, mqttOptions);
      
      // Set up event handlers
      client.on('connect', () => {
        connectionStatus = 'connected';
        reconnectAttempts = 0;
        addLog('MQTT', 'Connected to MQTT broker');
        onConnectCallbacks.forEach(callback => callback());
        resolve(client);
      });
      
      client.on('message', (topic, message) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          onMessageCallbacks.forEach(callback => callback(topic, parsedMessage));
        } catch (error) {
          // If it's not JSON, just use the raw message
          onMessageCallbacks.forEach(callback => callback(topic, message.toString()));
        }
      });
      
      client.on('error', (error) => {
        connectionStatus = 'error';
        addLog('MQTT Error', error.message);
        onErrorCallbacks.forEach(callback => callback(error));
        reject(error);
      });
      
      client.on('disconnect', () => {
        connectionStatus = 'disconnected';
        addLog('MQTT', 'Disconnected from MQTT broker');
        onDisconnectCallbacks.forEach(callback => callback());
      });
      
      client.on('reconnect', () => {
        connectionStatus = 'reconnecting';
        reconnectAttempts++;
        
        if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
          addLog('MQTT', 'Max reconnect attempts reached');
          client.end();
        } else {
          addLog('MQTT', `Reconnecting to MQTT broker (attempt ${reconnectAttempts})`);
        }
      });
    } catch (error) {
      addLog('MQTT Error', `Failed to initialize MQTT: ${error.message}`);
      reject(error);
    }
  });
}

// Subscribe to a topic
export function subscribe(topic) {
  if (!client || connectionStatus !== 'connected') {
    return Promise.reject(new Error('MQTT client not connected'));
  }
  
  return new Promise((resolve, reject) => {
    client.subscribe(topic, (err) => {
      if (err) {
        addLog('MQTT Error', `Failed to subscribe to ${topic}: ${err.message}`);
        reject(err);
      } else {
        addLog('MQTT', `Subscribed to ${topic}`);
        resolve();
      }
    });
  });
}

// Publish a message to a topic
export function publish(topic, message) {
  if (!client || connectionStatus !== 'connected') {
    return Promise.reject(new Error('MQTT client not connected'));
  }
  
  return new Promise((resolve, reject) => {
    try {
      // Convert to string if it's an object
      const messageString = typeof message === 'object' ? JSON.stringify(message) : message;
      
      client.publish(topic, messageString, (err) => {
        if (err) {
          addLog('MQTT Error', `Failed to publish to ${topic}: ${err.message}`);
          reject(err);
        } else {
          addLog('MQTT', `Published to ${topic}`);
          resolve();
        }
      });
    } catch (error) {
      addLog('MQTT Error', `Error preparing message: ${error.message}`);
      reject(error);
    }
  });
}

// Control a device
export function controlDevice(deviceId, command) {
  return new Promise((resolve, reject) => {
    // First get the device details
    import('./db').then(({ getAllDevices }) => {
      getAllDevices().then(allDevices => {
        const device = allDevices.find(d => d.id === deviceId);
        
        if (!device) {
          reject(new Error(`Device not found: ${deviceId}`));
          return;
        }
        
        // Create topic based on device route
        const topic = `cmd${device.route}`;
        
        // Publish command
        publish(topic, {
          command,
          timestamp: new Date().toISOString()
        })
          .then(() => {
            // Optimistically update device status
            updateDeviceStatus(deviceId, command === 'on' ? 'online' : 'offline')
              .then(updatedDevice => {
                resolve(updatedDevice);
              })
              .catch(reject);
          })
          .catch(reject);
      });
    });
  });
}

// Disconnect from the broker
export function disconnect() {
  if (client) {
    return new Promise((resolve) => {
      client.end(true, () => {
        connectionStatus = 'disconnected';
        client = null;
        addLog('MQTT', 'Disconnected from MQTT broker');
        resolve();
      });
    });
  }
  return Promise.resolve();
}

// Get connection status
export function getConnectionStatus() {
  return connectionStatus;
}

// Event listeners
export function onConnect(callback) {
  onConnectCallbacks.push(callback);
  if (connectionStatus === 'connected' && client) {
    callback();
  }
}

export function onMessage(callback) {
  onMessageCallbacks.push(callback);
}

export function onError(callback) {
  onErrorCallbacks.push(callback);
}

export function onDisconnect(callback) {
  onDisconnectCallbacks.push(callback);
}

// Remove event listeners
export function removeConnectListener(callback) {
  onConnectCallbacks = onConnectCallbacks.filter(cb => cb !== callback);
}

export function removeMessageListener(callback) {
  onMessageCallbacks = onMessageCallbacks.filter(cb => cb !== callback);
}

export function removeErrorListener(callback) {
  onErrorCallbacks = onErrorCallbacks.filter(cb => cb !== callback);
}

export function removeDisconnectListener(callback) {
  onDisconnectCallbacks = onDisconnectCallbacks.filter(cb => cb !== callback);
}
