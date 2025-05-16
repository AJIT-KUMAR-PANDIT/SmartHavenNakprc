import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useDevices } from '@/hooks/use-devices';
import { useRoutes as useAppRoutes } from '@/hooks/use-routes';
import { Badge } from '@/components/ui/badge';

// Search result categories
const CATEGORIES = {
  DEVICES: 'Devices',
  ROOMS: 'Rooms',
  SCENES: 'Scenes',
  ROUTES: 'Routes',
  PAGES: 'Pages'
};

// App pages for search
const PAGES = [
  { name: 'Dashboard', path: '/dashboard', icon: 'ri-dashboard-line' },
  { name: 'Devices', path: '/devices', icon: 'ri-device-line' },
  { name: 'Rooms', path: '/rooms', icon: 'ri-home-line' },
  { name: 'Scenes', path: '/scenes', icon: 'ri-film-line' },
  { name: 'Routes', path: '/routes', icon: 'ri-route-line' },
  { name: 'Automations', path: '/automations', icon: 'ri-flow-chart' },
  { name: 'Analytics', path: '/analytics', icon: 'ri-bar-chart-line' },
  { name: 'Electricity Monitor', path: '/electricity', icon: 'ri-flashlight-line' },
  { name: 'Logs', path: '/logs', icon: 'ri-file-list-3-line' },
  { name: 'Settings', path: '/settings', icon: 'ri-settings-3-line' }
];

const UniversalSearch = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setLocation] = useLocation();
  const inputRef = useRef(null);
  
  const { devices } = useDevices();
  const { routes } = useAppRoutes();
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);
  
  // Perform search when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const results = [];
    
    // Search devices
    const deviceResults = devices
      .filter(device => device.name.toLowerCase().includes(searchLower) || device.type.toLowerCase().includes(searchLower))
      .map(device => ({
        id: `device-${device.id}`,
        name: device.name,
        description: `${device.type} - ${device.status}`,
        icon: 'ri-device-line',
        category: CATEGORIES.DEVICES,
        path: `/devices?id=${device.id}`,
        data: device
      }));
    
    if (deviceResults.length > 0) {
      results.push(...deviceResults);
    }
    
    // Search routes
    const routeResults = routes
      .filter(route => 
        route.route.toLowerCase().includes(searchLower) || 
        (route.action && route.action.toLowerCase().includes(searchLower))
      )
      .map(route => ({
        id: `route-${route.id}`,
        name: route.route,
        description: route.action || 'No action specified',
        icon: 'ri-route-line',
        category: CATEGORIES.ROUTES,
        path: `/routes?id=${route.id}`,
        data: route
      }));
    
    if (routeResults.length > 0) {
      results.push(...routeResults);
    }
    
    // Search pages
    const pageResults = PAGES
      .filter(page => page.name.toLowerCase().includes(searchLower))
      .map(page => ({
        id: `page-${page.path}`,
        name: page.name,
        description: `Navigate to ${page.name}`,
        icon: page.icon,
        category: CATEGORIES.PAGES,
        path: page.path
      }));
    
    if (pageResults.length > 0) {
      results.push(...pageResults);
    }
    
    setSearchResults(results);
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [searchTerm, devices, routes]);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % searchResults.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
          handleResultClick(searchResults[activeIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  };
  
  // Handle result click
  const handleResultClick = (result) => {
    setLocation(result.path);
    onClose();
  };
  
  // Group results by category
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Search modal */}
          <motion.div
            className="fixed top-24 left-1/2 w-[95%] max-w-2xl -translate-x-1/2 bg-[#1e1e2e] rounded-xl shadow-2xl z-50 border border-gray-700 overflow-hidden mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search input */}
            <div className="flex items-center p-4 border-b border-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search devices, scenes, routes..."
                className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder-gray-400 text-lg"
                autoComplete="off"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="p-1 rounded-full hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {searchResults.length === 0 && searchTerm && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
              
              {Object.entries(groupedResults).map(([category, results]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {results.map((result, index) => {
                      const isActive = searchResults.indexOf(result) === activeIndex;
                      return (
                        <div
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className={`flex items-center p-2 rounded-lg cursor-pointer ${
                            isActive ? 'bg-blue-600/20' : 'hover:bg-gray-800'
                          }`}
                        >
                          <div className={`mr-3 p-2 rounded-full ${isActive ? 'bg-blue-600/20' : 'bg-gray-800'}`}>
                            <i className={`${result.icon} text-lg ${isActive ? 'text-blue-400' : 'text-gray-400'}`}></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium text-white">{result.name}</h4>
                              <Badge variant="outline" className="ml-2">
                                {result.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{result.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Keyboard shortcuts */}
            <div className="p-3 border-t border-gray-700 flex justify-between text-xs text-gray-400">
              <div>
                <span className="inline-block bg-gray-800 rounded px-2 py-1 mr-1">↑</span>
                <span className="inline-block bg-gray-800 rounded px-2 py-1 mr-2">↓</span>
                <span>to navigate</span>
              </div>
              <div>
                <span className="inline-block bg-gray-800 rounded px-2 py-1 mr-2">Enter</span>
                <span>to select</span>
              </div>
              <div>
                <span className="inline-block bg-gray-800 rounded px-2 py-1 mr-2">Esc</span>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UniversalSearch;