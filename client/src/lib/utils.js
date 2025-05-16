// Utility functions for the IoT control application
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Function needed by shadcn components
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date and time
export function formatDate(date) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  // Check if it's today
  const today = new Date();
  const isToday = d.getDate() === today.getDate() &&
                 d.getMonth() === today.getMonth() &&
                 d.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return `Today at ${formatTime(d)}`;
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.getDate() === yesterday.getDate() &&
                      d.getMonth() === yesterday.getMonth() &&
                      d.getFullYear() === yesterday.getFullYear();
  
  if (isYesterday) {
    return `Yesterday at ${formatTime(d)}`;
  }
  
  // Otherwise, show full date
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${formatTime(d)}`;
}

// Format time only
export function formatTime(date) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid time';
  
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${hours}:${minutes} ${ampm}`;
}

// Format time elapsed since a given date
export function timeElapsedSince(date) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSeconds = Math.floor(diffMs / 1000);
  
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} days ago`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  }
  
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} years ago`;
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Download content as a file
export function downloadAsFile(content, filename, contentType = 'application/json') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

// Generate a unique ID
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Parse JSON safely
export function parseJSON(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// Validate a PIN code (should be 4 digits)
export function validatePIN(pin) {
  return /^\d{4}$/.test(pin);
}

// Get device icon based on type
export function getDeviceIcon(type) {
  const icons = {
    light: 'ri-lightbulb-line',
    fan: 'ri-windmill-line',
    door: 'ri-door-lock-line',
    camera: 'ri-camera-line',
    sensor: 'ri-sensor-line',
    switch: 'ri-toggle-line',
    thermostat: 'ri-temp-hot-line',
    speaker: 'ri-speaker-line',
    default: 'ri-device-line'
  };
  
  return icons[type?.toLowerCase()] || icons.default;
}

// Get status color based on device status
export function getStatusColor(status) {
  const colors = {
    online: '#10b981', // success green
    offline: '#ef4444', // error red
    warning: '#f59e0b', // warning orange
    default: '#6b7280' // inactive gray
  };
  
  return colors[status?.toLowerCase()] || colors.default;
}

// Check if running in a mobile app (Capacitor)
export function isMobileApp() {
  return window.Capacitor && window.Capacitor.isNativePlatform();
}

// Debounce function
export function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle(func, limit = 300) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
