import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getDeviceIcon } from "@/lib/utils";

const SceneModal = ({ isOpen, onClose, onSave, scene = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    devices: [],
  });

  const [errors, setErrors] = useState({});

  const { data: devices } = useQuery({
    queryKey: ["/api/devices"],
    refetchOnWindowFocus: false,
  });

  // When scene data is passed for editing, update the form
  useEffect(() => {
    if (scene) {
      setFormData({
        name: scene.name || "",
        description: scene.description || "",
        devices: scene.devices || [],
      });
    } else {
      // Reset form for adding a new scene
      setFormData({
        name: "",
        description: "",
        devices: [],
      });
    }
    setErrors({});
  }, [scene, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleDevice = (device) => {
    setFormData((prev) => {
      if (prev.devices.some((d) => d.id === device.id)) {
        return {
          ...prev,
          devices: prev.devices.filter((d) => d.id !== device.id),
        };
      } else {
        return { ...prev, devices: [...prev.devices, device] };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Scene name is required";
    }

    if (formData.devices.length === 0) {
      newErrors.devices = "At least one device must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const sceneData = {
        ...formData,
        id: scene?.id, // Include ID if editing
      };
      onSave(sceneData);
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
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-black opacity-75"
                onClick={onClose}
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              className="inline-block align-bottom bg-[#1e1e2e] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-800 backdrop-blur-lg"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-2xl leading-6 font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      {scene ? "Edit Scene" : "Add New Scene"}
                    </h3>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label
                          htmlFor="scene-name"
                          className="block text-sm font-medium text-gray-400"
                        >
                          Scene Name
                        </label>
                        <Input
                          id="scene-name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-700 rounded-md bg-[#121218] px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600"
                          required
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="scene-description"
                          className="block text-sm font-medium text-gray-400"
                        >
                          Description
                        </label>
                        <textarea
                          id="scene-description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-700 rounded-md bg-[#121218] px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600"
                          rows="3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Devices in Scene
                        </label>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {devices &&
                            devices.map((device) => (
                              <div
                                key={device.id}
                                className={`flex items-center p-3 border rounded-md cursor-pointer ${
                                  formData.devices.some(
                                    (d) => d.id === device.id
                                  )
                                    ? "bg-[#2563eb]/10 border-[#2563eb]"
                                    : "border-gray-700 hover:bg-gray-800"
                                }`}
                                onClick={() => toggleDevice(device)}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <i
                                      className={`${getDeviceIcon(
                                        device.type
                                      )} mr-2 text-lg`}
                                    ></i>
                                    <span>{device.name}</span>
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {device.route}
                                  </div>
                                </div>
                                <div>
                                  {formData.devices.some(
                                    (d) => d.id === device.id
                                  ) && (
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
                        {errors.devices && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.devices}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#121218] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmit}
                  disabled={
                    !formData.name.trim() || formData.devices.length === 0
                  }
                >
                  {scene ? "Save Changes" : "Add Scene"}
                </Button>
                <Button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-[#1e1e2e] text-base font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default SceneModal;
