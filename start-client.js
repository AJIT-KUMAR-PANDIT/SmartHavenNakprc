#!/usr/bin/env node

// Simple script to start the SmartHaven client application
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting SmartHaven client application...');

try {
  // Navigate to client directory and start Vite
  const clientDir = path.join(__dirname, 'client');
  process.chdir(clientDir);
  
  // Execute vite command
  execSync('npx vite --host 0.0.0.0', { 
    stdio: 'inherit',
    env: process.env 
  });
} catch (error) {
  console.error('Error starting SmartHaven client:', error);
  process.exit(1);
}