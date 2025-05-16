import { useState, useEffect } from 'react';
import { addRoute, updateRoute, removeRoute, getAllRoutes, updateRouteAccess } from '@/lib/db';
import { addLog } from '@/lib/db';

export function useRoutes() {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load all routes on initial mount
  useEffect(() => {
    loadRoutes();
  }, []);
  
  // Function to load routes
  const loadRoutes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allRoutes = await getAllRoutes();
      setRoutes(allRoutes);
    } catch (err) {
      console.error('Failed to load routes:', err);
      setError('Failed to load routes');
      addLog('Error', `Failed to load routes: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to add a new route
  const createRoute = async (routeData) => {
    try {
      const newRoute = await addRoute(routeData);
      setRoutes(prev => [...prev, newRoute]);
      return newRoute;
    } catch (err) {
      console.error('Failed to add route:', err);
      setError('Failed to add route');
      addLog('Error', `Failed to add route: ${err.message}`);
      return null;
    }
  };
  
  // Function to update an existing route
  const editRoute = async (id, routeData) => {
    try {
      const updated = await updateRoute(id, routeData);
      if (updated) {
        setRoutes(prev => prev.map(r => r.id === id ? updated : r));
      }
      return updated;
    } catch (err) {
      console.error('Failed to update route:', err);
      setError('Failed to update route');
      addLog('Error', `Failed to update route: ${err.message}`);
      return null;
    }
  };
  
  // Function to delete a route
  const deleteRoute = async (id) => {
    try {
      const success = await removeRoute(id);
      if (success) {
        setRoutes(prev => prev.filter(r => r.id !== id));
      }
      return success;
    } catch (err) {
      console.error('Failed to delete route:', err);
      setError('Failed to delete route');
      addLog('Error', `Failed to delete route: ${err.message}`);
      return false;
    }
  };
  
  // Function to record a route access
  const recordAccess = async (route) => {
    try {
      const updated = await updateRouteAccess(route);
      if (updated) {
        setRoutes(prev => prev.map(r => r.route === route ? updated : r));
      }
      return updated;
    } catch (err) {
      console.error('Failed to record route access:', err);
      // Not setting error state here as this is a background operation
      return null;
    }
  };
  
  // Function to get a route by path
  const getRouteByPath = (path) => {
    return routes.find(r => r.route === path);
  };
  
  return {
    routes,
    isLoading,
    error,
    loadRoutes,
    createRoute,
    editRoute,
    deleteRoute,
    recordAccess,
    getRouteByPath
  };
}

export default useRoutes;
