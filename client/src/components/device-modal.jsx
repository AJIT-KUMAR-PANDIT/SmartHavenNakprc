import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DeviceModal = ({ isOpen, onClose, onSave, device = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    route: "",
    type: "switch",
    pin: "",
  });

  const [errors, setErrors] = useState({});

  // When device data is passed for editing, update the form
  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || "",
        route: device.route || "",
        type: device.type || "switch",
        pin: device.pin || "",
      });
    } else {
      // Reset form for adding a new device
      setFormData({
        name: "",
        route: "",
        type: "switch",
        pin: "",
      });
    }
    setErrors({});
  }, [device, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Device name is required";
    }

    if (!formData.route.trim()) {
      newErrors.route = "Route is required";
    } else if (!formData.route.startsWith("/")) {
      newErrors.route = "Route must start with /";
    }

    if (!formData.type) {
      newErrors.type = "Device type is required";
    }

    if (formData.pin === "") {
      newErrors.pin = "GPIO pin is required";
    } else if (
      isNaN(formData.pin) ||
      Number(formData.pin) < 0 ||
      Number(formData.pin) > 16
    ) {
      newErrors.pin = "Pin must be a number between 0 and 16";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Prepare data and ensure pin is a number
      const deviceData = {
        ...formData,
        pin: Number(formData.pin),
      };

      onSave(deviceData, device?.id);
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
                      {device ? "Edit Device" : "Add New Device"}
                    </h3>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label
                          htmlFor="device-name"
                          className="block text-sm font-medium text-gray-400"
                        >
                          Device Name
                        </label>
                        <Input
                          id="device-name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-700 rounded-md bg-[#121218] px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="device-route"
                          className="block text-sm font-medium text-gray-400"
                        >
                          Device Route
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Input
                            id="device-route"
                            name="route"
                            value={formData.route}
                            onChange={handleInputChange}
                            className="focus:ring-primary focus:border-primary flex-1 block w-full rounded-md sm:text-sm border-gray-700 bg-[#121218] px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600"
                          />
                        </div>
                        {errors.route && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.route}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="device-type"
                          className="block text-sm font-medium text-gray-400 mb-1"
                        >
                          Device Type
                        </label>
                        <Select
                          defaultValue={formData.type}
                          onValueChange={handleSelectChange}
                        >
                          <SelectTrigger className="w-full bg-[#121218] border-gray-700 transition-all duration-200 hover:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e1e2e] border-gray-700">
                            <SelectItem value="switch">Switch</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="sensor">Sensor</SelectItem>
                            <SelectItem value="fan">Fan</SelectItem>
                            <SelectItem value="door">Door</SelectItem>
                            <SelectItem value="camera">Camera</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.type}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="device-pin"
                          className="block text-sm font-medium text-gray-400"
                        >
                          GPIO Pin
                        </label>
                        <Input
                          type="number"
                          id="device-pin"
                          name="pin"
                          min="0"
                          max="16"
                          value={formData.pin}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-700 rounded-md bg-[#121218] px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-600"
                        />
                        {errors.pin && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.pin}
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105"
                  onClick={handleSubmit}
                >
                  {device ? "Update Device" : "Add Device"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-[#1e1e2e] text-base font-medium text-gray-400 hover:bg-[#121218] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105 hover:border-gray-600"
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

export default DeviceModal;
