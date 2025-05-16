import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useLogs from '@/hooks/use-logs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import { AlertCircle, Download, RefreshCw, Search, X } from 'lucide-react';

const Logs = () => {
  const { 
    logs, 
    isLoading, 
    error, 
    loadLogs, 
    downloadLogs, 
    filterLogs, 
    clearFilter, 
    getLogsByDate,
    filter 
  } = useLogs();
  
  const [downloadFormat, setDownloadFormat] = useState('json');
  const [activeTab, setActiveTab] = useState('list');
  const [searchValue, setSearchValue] = useState('');

  // When search input changes, update the filter with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      filterLogs(searchValue);
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchValue]);

  // Handle download logs
  const handleDownload = async () => {
    const success = await downloadLogs(downloadFormat);
    if (!success) {
      // Show error notification
      console.error('Failed to download logs');
    }
  };

  // Format logs by date for timeline view
  const logsByDate = getLogsByDate();

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Activity Logs</h2>
          <p className="text-gray-400">View and export system activity</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center">
            <Select value={downloadFormat} onValueChange={setDownloadFormat}>
              <SelectTrigger className="w-24 bg-[#1e1e2e] border-gray-700">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e2e] border-gray-700">
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="ml-2 bg-[#2563eb] flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Tab Controls */}
      <div className="bg-[#1e1e2e] p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search logs by action or message..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-[#121218] border-gray-700 pl-10"
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <Search size={16} />
            </div>
            {searchValue && (
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={() => {
                  setSearchValue('');
                  clearFilter();
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="sm:w-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="bg-[#121218] border border-gray-700">
                <TabsTrigger value="list" className="data-[state=active]:bg-[#2563eb]">
                  List View
                </TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-[#2563eb]">
                  Timeline
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content based on loading/error state */}
      {isLoading ? (
        <div className="text-center py-8">
          <motion.div
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-10 w-10 text-gray-400" />
          </motion.div>
          <p className="mt-2 text-gray-400">Loading logs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-red-900/20 rounded-lg border border-red-800">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className="mt-2 text-red-300">{error}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={loadLogs}
          >
            Retry
          </Button>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 bg-[#1e1e2e] rounded-lg">
          <i className="ri-file-list-3-line text-5xl text-gray-500"></i>
          <p className="mt-2 text-gray-400">
            {filter ? 'No logs match your search criteria' : 'No logs available'}
          </p>
          {filter && (
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearchValue('');
                clearFilter();
              }}
            >
              Clear Filter
            </Button>
          )}
        </div>
      ) : (
        <div>
          {/* List View */}
          <TabsContent value="list" className="m-0">
            <div className="bg-[#1e1e2e] rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#1e1e2e]/80">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-[#1e1e2e]">
                    {logs.map((log) => (
                      <tr key={log.timestamp}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.action === 'Error' || log.action === 'MQTT Error' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#ef4444]/20 text-[#ef4444]">
                              {log.action}
                            </span>
                          ) : log.action === 'Warning' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#f59e0b]/20 text-[#f59e0b]">
                              {log.action}
                            </span>
                          ) : log.action === 'MQTT' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#10b981]/20 text-[#10b981]">
                              {log.action}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#2563eb]/20 text-[#2563eb]">
                              {log.action}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Timeline View */}
          <TabsContent value="timeline" className="m-0">
            <div className="bg-[#1e1e2e] rounded-xl shadow-md p-4">
              {Object.entries(logsByDate).map(([date, dayLogs]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-md font-medium mb-2 sticky top-0 bg-[#1e1e2e] py-2 z-10 border-b border-gray-700">
                    {formatDate(new Date(date))}
                  </h3>

                  <div className="pl-4 border-l-2 border-gray-700">
                    {dayLogs.map((log, idx) => (
                      <div key={idx} className="relative mb-6 last:mb-0">
                        {/* Timeline dot */}
                        <div 
                          className={`absolute -left-[17px] w-8 h-8 rounded-full flex items-center justify-center ${
                            log.action === 'Error' || log.action === 'MQTT Error'
                              ? 'bg-[#ef4444]/20'
                              : log.action === 'Warning'
                              ? 'bg-[#f59e0b]/20'
                              : log.action === 'MQTT'
                              ? 'bg-[#10b981]/20'
                              : 'bg-[#2563eb]/20'
                          }`}
                        >
                          <i className={`${
                            log.action === 'Error' || log.action === 'MQTT Error'
                              ? 'ri-error-warning-line text-[#ef4444]'
                              : log.action === 'Warning'
                              ? 'ri-alert-line text-[#f59e0b]'
                              : log.action === 'MQTT'
                              ? 'ri-broadcast-line text-[#10b981]'
                              : 'ri-information-line text-[#2563eb]'
                          }`}></i>
                        </div>
                        
                        {/* Log content */}
                        <div className="ml-10">
                          <div className="bg-[#121218] rounded-md p-3">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{log.action}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{log.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      )}

      {/* Status summary */}
      {logs.length > 0 && (
        <div className="mt-6 p-4 bg-[#1e1e2e] rounded-lg text-sm text-gray-400 flex justify-between items-center">
          <div>
            <span className="font-medium">Total: {logs.length} logs</span>
            <span className="mx-2">|</span>
            <span>
              Errors: {logs.filter(log => log.action === 'Error' || log.action === 'MQTT Error').length}
            </span>
            <span className="mx-2">|</span>
            <span>
              Warnings: {logs.filter(log => log.action === 'Warning').length}
            </span>
          </div>
          <button
            className="text-[#2563eb] hover:underline flex items-center"
            onClick={loadLogs}
          >
            <i className="ri-refresh-line mr-1"></i> Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Logs;
