import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import useScenes from "@/hooks/use-scenes"; // Import the new hook
import SceneModal from "@/components/scene-modal"; // Import the new modal

const SceneCard = ({ scene, onActivate, onEdit, onDelete }) => {
  const [isActive, setIsActive] = useState(false); // State to track if the scene is active
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
          {scene.devices.map((device) => (
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
          onClick={async () => {
            const newState = isActive ? "off" : "on";
            try {
              await onActivate(scene.id, newState);
              setIsActive(!isActive);
            } catch (err) {
              // Error handling is already in parent component, just log or handle locally if needed
              console.error(`Failed to ${newState} scene:`, err);
            }
          }}
          className={`w-full py-2 mt-2 rounded-md flex justify-center items-center ${
            isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-[#2563eb] hover:bg-[#1e40af]"
          } transition-colors`}
        >
          <i
            className={`${isActive ? "ri-stop-fill" : "ri-play-fill"} mr-2`}
          ></i>
          {isActive ? "Deactivate Scene" : "Activate Scene"}
        </button>
      </div>
    </div>
  );
};

// Get device icon based on type
function getDeviceIcon(type) {
  const icons = {
    light: "ri-lightbulb-line",
    fan: "ri-windmill-line",
    door: "ri-door-lock-line",
    camera: "ri-camera-line",
    sensor: "ri-sensor-line",
    switch: "ri-toggle-line",
    thermostat: "ri-temp-hot-line",
    speaker: "ri-speaker-line",
    default: "ri-device-line",
  };

  return icons[type?.toLowerCase()] || icons.default;
}

export default function Scenes() {
  const [showForm, setShowForm] = useState(false); // State to control modal visibility
  const [editingScene, setEditingScene] = useState(null); // State to hold scene data for editing
  const { toast } = useToast();
  // Use the useScenes hook for data and mutations
  const {
    scenes,
    isLoading,
    error,
    createScene,
    editScene,
    deleteScene,
    activateScene,
  } = useScenes();

  const handleSceneSubmit = async (sceneData) => {
    try {
      if (editingScene) {
        await editScene({ id: editingScene.id, ...sceneData }); // Use editScene from hook and pass all data
      } else {
        await createScene(sceneData); // Use createScene from hook
      }
      setShowForm(false); // Close modal on success
      setEditingScene(null); // Reset editing state
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to save scene: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditScene = (scene) => {
    setEditingScene(scene);
    setShowForm(true); // Open modal for editing
  };

  const handleDeleteScene = async (id) => {
    if (confirm("Are you sure you want to delete this scene?")) {
      try {
        await deleteScene(id); // Use deleteScene from hook
      } catch (err) {
        toast({
          title: "Error",
          description: `Failed to delete scene: ${err.message}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleActivateScene = async (id) => {
    try {
      await activateScene(id); // Use activateScene from hook
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to activate scene: ${err.message}`,
        variant: "destructive",
      });
      // No need to revert state here, the parent handler already shows the toast
    }
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
          onClick={() => {
            setEditingScene(null); // Reset editing state for new scene
            setShowForm(true); // Open modal for adding
          }}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1e40af] rounded-md flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          New Scene
        </button>
      </div>

      {/* Render the SceneModal instead of the inline form */}
      <SceneModal
        isOpen={showForm}
        onClose={handleCancelForm}
        scene={editingScene} // Pass editingScene data
        onSave={handleSceneSubmit} // Pass submit handler
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12 bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-800/50 backdrop-blur-sm">
            <i className="ri-error-warning-line text-6xl text-red-500 animate-pulse"></i>
            <p className="mt-4 text-red-300 text-lg">{error.message}</p>
            {/* Add a retry button if needed */}
          </div>
        ) : scenes && scenes.length > 0 ? (
          scenes.map((scene) => (
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
              onClick={() => {
                setEditingScene(null); // Reset editing state for new scene
                setShowForm(true); // Open modal for adding
              }}
              className="px-4 py-2 bg-[#2563eb] hover:bg-[#1e40af] rounded-md inline-flex items-center"
            >
              <i className="ri-add-line mr-2"></i>
              Create Your First Scene
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
