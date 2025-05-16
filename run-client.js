// Simple Node.js script to run the client-side application with Vite
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run vite in client directory
const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

console.log('Starting SmartHaven client application...');

viteProcess.on('close', (code) => {
  console.log(`Client process exited with code ${code}`);
});

// Handle termination
process.on('SIGINT', () => {
  viteProcess.kill('SIGINT');
  process.exit(0);
});