import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useRoutes from '@/hooks/use-routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RouteModal from '@/components/route-modal';
import { timeElapsedSince } from '@/lib/utils';

const Routes = () => {
  const { routes, isLoading, error, loadRoutes, createRoute, editRoute, deleteRoute } = useRoutes();
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Apply filtering when routes, search query, or filter type changes
  useEffect(() => {
    if (!routes) return;

    let filtered = [...routes];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(route => 
        route.route.toLowerCase().includes(query) || 
        (route.action && route.action.toLowerCase().includes(query))
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(route => route.type === filterType);
    }
    
    setFilteredRoutes(filtered);
  }, [routes, searchQuery, filterType]);

  const handleEditRoute = (route) => {
    setSelectedRoute(route);
    setRouteModalOpen(true);
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      await deleteRoute(routeId);
    }
  };

  const handleSaveRoute = async (routeData, routeId = null) => {
    if (routeId) {
      await editRoute(routeId, routeData);
    } else {
      await createRoute(routeData);
    }
    setSelectedRoute(null);
  };

  // Get status badge based on route type
  const getStatusBadge = (route) => {
    const isSystemRoute = route.type === 'system';
    
    // For system routes, always show active
    if (isSystemRoute) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#10b981]/20 text-[#10b981]">
          Active
        </span>
      );
    }
    
    // For device routes, check if associated device exists and is online
    if (route.type === 'device') {
      const isOffline = route.deviceStatus === 'offline';
      return isOffline ? (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#ef4444]/20 text-[#ef4444]">
          Offline
        </span>
      ) : (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#10b981]/20 text-[#10b981]">
          Active
        </span>
      );
    }
    
    // Default is active
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#10b981]/20 text-[#10b981]">
        Active
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Dynamic Routes</h2>
          <p className="text-gray-400">Manage API endpoints and device routes</p>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#2563eb]"
          onClick={() => {
            setSelectedRoute(null);
            setRouteModalOpen(true);
          }}
        >
          <i className="ri-add-line"></i>
          Add Route
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#1e1e2e] p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search routes by path or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121218] border-gray-700"
            />
          </div>
          <div className="sm:w-48">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-[#121218] border-gray-700">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e2e] border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
                <SelectItem value="device">Device Control</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <motion.div
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <i className="ri-loader-4-line text-3xl text-gray-400"></i>
          </motion.div>
          <p className="mt-2 text-gray-400">Loading routes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-red-900/20 rounded-lg border border-red-800">
          <i className="ri-error-warning-line text-5xl text-red-500"></i>
          <p className="mt-2 text-red-300">{error}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={loadRoutes}
          >
            Retry
          </Button>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-10 bg-[#1e1e2e] rounded-lg">
          <i className="ri-route-line text-5xl text-gray-500"></i>
          <p className="mt-2 text-gray-400">
            {searchQuery || filterType !== 'all'
              ? 'No routes match your search criteria'
              : 'No routes added yet'}
          </p>
          {searchQuery || filterType !== 'all' ? (
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button
              className="mt-4 bg-[#2563eb]"
              onClick={() => {
                setSelectedRoute(null);
                setRouteModalOpen(true);
              }}
            >
              Add Your First Route
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-[#1e1e2e] rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#1e1e2e]/80">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Route</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Access</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-[#1e1e2e]">
                {filteredRoutes.map((route) => (
                  <tr key={route.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{route.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{route.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(route)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {route.lastAccessed ? timeElapsedSince(route.lastAccessed) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex space-x-2">
                        <button 
                          className="text-[#2563eb] hover:text-[#2563eb]/80"
                          onClick={() => handleEditRoute(route)}
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        {/* Disable delete for system routes */}
                        {route.type === 'system' ? (
                          <button className="text-gray-500 cursor-not-allowed">
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        ) : (
                          <button 
                            className="text-[#ef4444] hover:text-[#ef4444]/80"
                            onClick={() => handleDeleteRoute(route.id)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status summary */}
      {filteredRoutes.length > 0 && (
        <div className="mt-6 p-4 bg-[#1e1e2e] rounded-lg text-sm text-gray-400 flex justify-between items-center">
          <div>
            <span className="font-medium">Total: {filteredRoutes.length} routes</span>
            <span className="mx-2">|</span>
            <span>HTTP: {filteredRoutes.filter(r => r.type === 'http').length}</span>
            <span className="mx-2">|</span>
            <span>Device: {filteredRoutes.filter(r => r.type === 'device').length}</span>
            <span className="mx-2">|</span>
            <span>System: {filteredRoutes.filter(r => r.type === 'system').length}</span>
          </div>
          <button
            className="text-[#2563eb] hover:underline flex items-center"
            onClick={loadRoutes}
          >
            <i className="ri-refresh-line mr-1"></i> Refresh
          </button>
        </div>
      )}

      {/* Route Modal */}
      <RouteModal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        onSave={handleSaveRoute}
        route={selectedRoute}
      />
    </div>
  );
};

export default Routes;
