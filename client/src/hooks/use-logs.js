import { useState, useEffect } from 'react';
import { getAllLogs, exportLogs } from '@/lib/db';
import { formatDate, downloadAsFile } from '@/lib/utils';

export function useLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  
  // Load all logs on initial mount
  useEffect(() => {
    loadLogs();
  }, []);
  
  // Apply filtering when logs or filter changes
  useEffect(() => {
    if (!filter) {
      setFilteredLogs(logs);
      return;
    }
    
    const lowerFilter = filter.toLowerCase();
    const filtered = logs.filter(log => 
      log.action.toLowerCase().includes(lowerFilter) || 
      log.message.toLowerCase().includes(lowerFilter)
    );
    
    setFilteredLogs(filtered);
  }, [logs, filter]);
  
  // Function to load logs
  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allLogs = await getAllLogs();
      setLogs(allLogs);
      setFilteredLogs(allLogs);
    } catch (err) {
      console.error('Failed to load logs:', err);
      setError('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to export logs
  const downloadLogs = async (format = 'json') => {
    try {
      const logsData = await exportLogs();
      
      // Generate filename with current date
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `iot_logs_${formattedDate}.${format}`;
      
      if (format === 'json') {
        downloadAsFile(logsData, filename, 'application/json');
        return true;
      } else if (format === 'csv') {
        // Convert JSON to CSV
        const parsedLogs = JSON.parse(logsData);
        
        // Create CSV header
        let csv = 'Timestamp,Action,Message\n';
        
        // Add each log entry
        parsedLogs.forEach(log => {
          const timestamp = formatDate(log.timestamp);
          // Escape quotes and commas in fields
          const action = `"${log.action.replace(/"/g, '""')}"`;
          const message = `"${log.message.replace(/"/g, '""')}"`;
          
          csv += `${timestamp},${action},${message}\n`;
        });
        
        downloadAsFile(csv, filename, 'text/csv');
        return true;
      } else {
        setError(`Unsupported export format: ${format}`);
        return false;
      }
    } catch (err) {
      console.error('Failed to export logs:', err);
      setError('Failed to export logs');
      return false;
    }
  };
  
  // Function to filter logs
  const filterLogs = (searchTerm) => {
    setFilter(searchTerm);
  };
  
  // Function to clear the filter
  const clearFilter = () => {
    setFilter('');
  };
  
  // Get logs grouped by date for timeline display
  const getLogsByDate = () => {
    const grouped = {};
    
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(log);
    });
    
    return grouped;
  };
  
  return {
    logs: filteredLogs,
    isLoading,
    error,
    loadLogs,
    downloadLogs,
    filterLogs,
    clearFilter,
    getLogsByDate,
    filter
  };
}

import { useState, useEffect } from 'react';
import { getAllLogs, exportLogs } from '@/lib/db';
import { formatDate, downloadAsFile } from '@/lib/utils';

const useLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const allLogs = await getAllLogs();
      setLogs(allLogs);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadLogs = async (format) => {
    try {
      const data = await exportLogs();
      if (format === 'csv') {
        // Convert to CSV
        const csvContent = logs.map(log => 
          `${formatDate(log.timestamp)},${log.action},${log.message}`
        ).join('\n');
        downloadAsFile('logs.csv', csvContent, 'text/csv');
      } else {
        downloadAsFile('logs.json', data, 'application/json');
      }
      return true;
    } catch (err) {
      console.error('Failed to download logs:', err);
      return false;
    }
  };

  const filterLogs = (searchTerm) => {
    setFilter(searchTerm.toLowerCase());
  };

  const clearFilter = () => {
    setFilter('');
  };

  const getLogsByDate = () => {
    const filtered = filter
      ? logs.filter(log => 
          log.action.toLowerCase().includes(filter) ||
          log.message.toLowerCase().includes(filter)
        )
      : logs;

    return filtered.reduce((acc, log) => {
      const date = new Date(log.timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {});
  };

  return {
    logs: filter
      ? logs.filter(log => 
          log.action.toLowerCase().includes(filter) ||
          log.message.toLowerCase().includes(filter)
        )
      : logs,
    isLoading,
    error,
    loadLogs,
    downloadLogs,
    filterLogs,
    clearFilter,
    getLogsByDate,
    filter
  };
};

export default useLogs;
