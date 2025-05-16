import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const SceneCard = ({ scene, onActivate, onEdit, onDelete }) => {
  return (
    <div className="bg-[#1e1e2e] rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800">
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">{scene.name}</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(scene)}
              className="p-2 rounded-full hover:bg-gray-700/50"
            >
              <i className="ri-edit-line text-gray-400"></i>
            </button>
            <button 
              onClick={() => onDelete(scene.id)}
              className="p-2 rounded-full hover:bg-gray-700/50"
            >
              <i className="ri-delete-bin-line text-gray-400"></i>
            </button>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">{scene.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {scene.devices.map(device => (
            <span 
              key={device.id} 
              className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300"
            >
              <i className={`${getDeviceIcon(device.type)} mr-1`}></i>
              {device.name}
            </span>
          ))}
        </div>
        
        <button
          onClick={() => onActivate(scene.id)}
          className="w-full py-2 mt-2 bg-[#2563eb] hover:bg-[#1e40af] transition-colors rounded-md flex justify-center items-center"
        >
          <i className="ri-play-fill mr-2"></i>
          Activate Scene
        </button>
      </div>
    </div>
  );
};

// Scene form for adding/editing scenes
const SceneForm = ({ isEdit, sceneData, onSubmit, onCancel }) => {
  const [name, setName] = useState(sceneData?.name || '');
  const [description, setDescription] = useState(sceneData?.description || '');
  const [selectedDevices, setSelectedDevices] = useState(sceneData?.devices || []);
  
  const { data: devices } = useQuery({ 
    queryKey: ['/api/devices'],
    refetchOnWindowFocus: false
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: sceneData?.id,
      name,
      description,
      devices: selectedDevices,
      createdAt: sceneData?.createdAt || new Date().toISOString()
    });
  };
  
  const toggleDevice = (device) => {
    if (selectedDevices.some(d => d.id === device.id)) {
      setSelectedDevices(selectedDevices.filter(d => d.id !== device.id));
    } else {
      setSelectedDevices([...selectedDevices, device]);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-[#1e1e2e] rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-6">{isEdit ? 'Edit Scene' : 'New Scene'}</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-2">Scene Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-[#121218] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-[#121218] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          rows="3"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Devices in Scene</label>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {devices && devices.map(device => (
            <div 
              key={device.id} 
              className={`flex items-center p-3 border rounded-md cursor-pointer ${
                selectedDevices.some(d => d.id === device.id) 
                  ? 'bg-[#2563eb]/10 border-[#2563eb]' 
                  : 'border-gray-700 hover:bg-gray-800'
              }`}
              onClick={() => toggleDevice(device)}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <i className={`${getDeviceIcon(device.type)} mr-2 text-lg`}></i>
                  <span>{device.name}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{device.route}</div>
              </div>
              <div>
                {selectedDevices.some(d => d.id === device.id) && (
                  <i className="ri-check-line text-[#2563eb]"></i>
                )}
              </div>
            </div>
          ))}
          
          {(!devices || devices.length === 0) && (
            <div className="text-center py-4 text-gray-400">
              No devices available. Add devices first.
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1e40af] rounded-md"
          disabled={!name || selectedDevices.length === 0}
        >
          {isEdit ? 'Save Changes' : 'Create Scene'}
        </button>
      </div>
    </form>
  );
};

// Get device icon based on type
function getDeviceIcon(type) {
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

export default function Scenes() {
  const [showForm, setShowForm] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch scenes
  const { data: scenes, isLoading } = useQuery({ 
    queryKey: ['/api/scenes'],
    refetchOnWindowFocus: false
  });
  
  // Add scene mutation
  const addSceneMutation = useMutation({
    mutationFn: async (sceneData) => {
      const res = await apiRequest('POST', '/api/scenes', sceneData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scenes'] });
      toast({
        title: "Success",
        description: "Scene created successfully",
      });
      setShowForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create scene: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update scene mutation
  const updateSceneMutation = useMutation({
    mutationFn: async (sceneData) => {
      const res = await apiRequest('PUT', `/api/scenes/${sceneData.id}`, sceneData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scenes'] });
      toast({
        title: "Success",
        description: "Scene updated successfully",
      });
      setShowForm(false);
      setEditingScene(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update scene: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete scene mutation
  const deleteSceneMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiRequest('DELETE', `/api/scenes/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scenes'] });
      toast({
        title: "Success",
        description: "Scene deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete scene: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Activate scene mutation
  const activateSceneMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiRequest('POST', `/api/scenes/${id}/activate`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: "Scene Activated",
        description: `Successfully activated the scene. ${data.devicesUpdated} devices updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to activate scene: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSceneSubmit = (sceneData) => {
    if (editingScene) {
      updateSceneMutation.mutate(sceneData);
    } else {
      addSceneMutation.mutate(sceneData);
    }
  };
  
  const handleEditScene = (scene) => {
    setEditingScene(scene);
    setShowForm(true);
  };
  
  const handleDeleteScene = (id) => {
    if (confirm("Are you sure you want to delete this scene?")) {
      deleteSceneMutation.mutate(id);
    }
  };
  
  const handleActivateScene = (id) => {
    activateSceneMutation.mutate(id);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingScene(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scenes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1e40af] rounded-md flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          New Scene
        </button>
      </div>
      
      {showForm ? (
        <SceneForm 
          isEdit={!!editingScene}
          sceneData={editingScene}
          onSubmit={handleSceneSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
            </div>
          ) : scenes && scenes.length > 0 ? (
            scenes.map(scene => (
              <SceneCard
                key={scene.id}
                scene={scene}
                onActivate={handleActivateScene}
                onEdit={handleEditScene}
                onDelete={handleDeleteScene}
              />
            ))
          ) : (
            <div className="col-span-full bg-[#1e1e2e] rounded-xl p-8 text-center border border-gray-800">
              <div className="text-6xl text-gray-600 mb-4">
                <i className="ri-film-line"></i>
              </div>
              <h3 className="text-xl font-medium mb-2">No Scenes Yet</h3>
              <p className="text-gray-400 mb-6">
                Create scenes to control multiple devices with a single tap.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[#2563eb] hover:bg-[#1e40af] rounded-md inline-flex items-center"
              >
                <i className="ri-add-line mr-2"></i>
                Create Your First Scene
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}