import { useEffect, useState } from 'react';
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

export default useLogs;
