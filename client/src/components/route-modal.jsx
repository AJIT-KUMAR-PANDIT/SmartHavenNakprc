import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const RouteModal = ({ isOpen, onClose, onSave, route = null }) => {
  const [formData, setFormData] = useState({
    route: '',
    type: 'http',
    action: '',
    method: 'GET',
  });

  const [errors, setErrors] = useState({});
  
  // When route data is passed for editing, update the form
  useEffect(() => {
    if (route) {
      setFormData({
        route: route.route || '',
        type: route.type || 'http',
        action: route.action || '',
        method: route.method || 'GET',
      });
    } else {
      // Reset form for adding a new route
      setFormData({
        route: '',
        type: 'http',
        action: '',
        method: 'GET',
      });
    }
    setErrors({});
  }, [route, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.route.trim()) {
      newErrors.route = 'Route path is required';
    } else if (!formData.route.startsWith('/')) {
      newErrors.route = 'Route must start with /';
    }
    
    if (!formData.type) {
      newErrors.type = 'Route type is required';
    }
    
    if (formData.type === 'http' && !formData.action.trim()) {
      newErrors.action = 'Action is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData, route?.id);
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75" onClick={onClose}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <motion.div 
              className="inline-block align-bottom bg-[#1e1e2e] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium">
                      {route ? 'Edit Route' : 'Add New Route'}
                    </h3>
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="route-path" className="block text-sm font-medium text-gray-400">
                          Route Path
                        </label>
                        <Input
                          id="route-path"
                          name="route"
                          value={formData.route}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-700 rounded-md bg-[#121218] px-3 py-2"
                        />
                        {errors.route && (
                          <p className="mt-1 text-sm text-red-500">{errors.route}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="route-type" className="block text-sm font-medium text-gray-400 mb-1">
                          Route Type
                        </label>
                        <Select 
                          defaultValue={formData.type} 
                          onValueChange={(value) => handleSelectChange('type', value)}
                        >
                          <SelectTrigger className="w-full bg-[#121218] border-gray-700">
                            <SelectValue placeholder="Select route type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e1e2e] border-gray-700">
                            <SelectItem value="http">HTTP</SelectItem>
                            <SelectItem value="device">Device Control</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                        )}
                      </div>
                      
                      {formData.type === 'http' && (
                        <div>
                          <label htmlFor="route-method" className="block text-sm font-medium text-gray-400 mb-1">
                            HTTP Method
                          </label>
                          <Select 
                            defaultValue={formData.method} 
                            onValueChange={(value) => handleSelectChange('method', value)}
                          >
                            <SelectTrigger className="w-full bg-[#121218] border-gray-700">
                              <SelectValue placeholder="Select HTTP method" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e1e2e] border-gray-700">
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="route-action" className="block text-sm font-medium text-gray-400">
                          {formData.type === 'http' ? 'Action / Response' : 'Description'}
                        </label>
                        <Textarea
                          id="route-action"
                          name="action"
                          value={formData.action}
                          onChange={handleInputChange}
                          rows={4}
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-700 rounded-md bg-[#121218] px-3 py-2"
                        />
                        {errors.action && (
                          <p className="mt-1 text-sm text-red-500">{errors.action}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#121218] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2563eb] text-base font-medium sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmit}
                >
                  {route ? 'Update Route' : 'Add Route'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-[#1e1e2e] text-base font-medium text-gray-400 hover:bg-[#121218] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteModal;
