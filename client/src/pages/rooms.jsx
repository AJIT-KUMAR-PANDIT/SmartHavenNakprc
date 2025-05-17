import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import useRooms from "@/hooks/use-rooms";
import useDevices from "@/hooks/use-devices";
import RoomModal from "@/components/room-modal";
import DeviceCard from "@/components/ui/device-card";

const RoomCard = ({ room, onEdit, onDelete, roomDevices }) => {
  const { data: devices } = useQuery({
    queryKey: ["/api/devices"],
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-[#1e1e2e] rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800">
      <div className="h-40 bg-gradient-to-r from-[#2563eb]/40 to-[#8b5cf6]/40 relative">
        {room.image ? (
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <i
              className={`text-6xl text-white opacity-30 ${getRoomIcon(
                room.type
              )}`}
            ></i>
          </div>
        )}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => onEdit(room)}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <i className="ri-edit-line"></i>
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-medium mb-2">{room.name}</h3>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <i className={`${getRoomIcon(room.type)} mr-2`}></i>
          <span>{capitalizeFirstLetter(room.type || "Room")}</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Devices</span>
            <span className="text-sm font-medium">{roomDevices.length}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563eb] rounded-full"
              style={{ width: `${Math.min(100, roomDevices.length * 10)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {roomDevices.slice(0, 4).map((device) => (
            <span
              key={device.id}
              className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300"
            >
              <i className={`${getDeviceIcon(device.type)} mr-1`}></i>
              {device.name}
            </span>
          ))}
          {roomDevices.length > 4 && (
            <span className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300">
              +{roomDevices.length - 4} more
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="py-2 bg-[#1e1e2e] hover:bg-gray-800 transition-colors border border-gray-700 rounded-md flex justify-center items-center">
            <i className="ri-lightbulb-line mr-2"></i>
            All Lights
          </button>
          <button className="py-2 bg-[#2563eb] hover:bg-[#1e40af] transition-colors rounded-md flex justify-center items-center">
            <i className="ri-dashboard-3-line mr-2"></i>
            Controls
          </button>
        </div>
      </div>
    </div>
  );
};

// Get room icon based on type
function getRoomIcon(type) {
  const icons = {
    living: "ri-sofa-line",
    bedroom: "ri-hotel-bed-line",
    kitchen: "ri-fridge-line",
    bathroom: "ri-shower-room-line",
    office: "ri-computer-line",
    hallway: "ri-door-line",
    garage: "ri-car-line",
    outdoor: "ri-plant-line",
    default: "ri-home-line",
  };

  return icons[type?.toLowerCase()] || icons.default;
}

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

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Rooms() {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const { toast } = useToast();

  // Use the new useRooms hook
  const {
    rooms,
    isLoading: isLoadingRooms,
    error: errorRooms,
    createRoom,
    editRoom,
    deleteRoom,
  } = useRooms();

  // Use the useDevices hook to fetch all devices
  const {
    devices,
    isLoading: isLoadingDevices,
    error: errorDevices,
  } = useDevices();

  // Group devices by room
  const devicesByRoom = useMemo(() => {
    if (!devices) return {};
    return devices.reduce((acc, device) => {
      const roomId = device.roomId || "unassigned"; // Group devices without a room under 'unassigned'
      if (!acc[roomId]) {
        acc[roomId] = [];
      }
      acc[roomId].push(device);
      return acc;
    }, {});
  }, [devices]);

  const handleRoomSubmit = async (roomData) => {
    try {
      if (editingRoom) {
        await editRoom(roomData.id, roomData);
        toast({
          title: "Success",
          description: "Room updated successfully",
        });
      } else {
        await createRoom(roomData);
        toast({
          title: "Success",
          description: "Room added successfully",
        });
      }
      setShowForm(false);
      setEditingRoom(null);
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to save room: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleDeleteRoom = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this room? This will not delete the devices in the room, but they will no longer be associated with any room."
      )
    ) {
      try {
        await deleteRoom(id);
        toast({
          title: "Success",
          description: "Room deleted successfully",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: `Failed to delete room: ${err.message}`,
          variant: "destructive",
        });
      }
    }
  };

  const isLoading = isLoadingRooms || isLoadingDevices;
  const error = errorRooms || errorDevices;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1e40af] rounded-md flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          Add Room
        </button>
      </div>
      <RoomModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        isEdit={!!editingRoom}
        roomData={editingRoom}
        onSubmit={handleRoomSubmit}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12 bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-800/50 backdrop-blur-sm">
            <i className="ri-error-warning-line text-6xl text-red-500 animate-pulse"></i>
            <p className="mt-4 text-red-300 text-lg">{error}</p>
            {/* Add a retry button if needed */}
          </div>
        ) : rooms && rooms.length > 0 ? (
          // Render rooms with their associated devices
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
              roomDevices={devicesByRoom[room.id] || []}
            />
          ))
        ) : (
          <div className="col-span-full bg-[#1e1e2e] rounded-xl p-8 text-center border border-gray-800">
            <div className="text-6xl text-gray-600 mb-4">
              <i className="ri-home-line"></i>
            </div>
            <h3 className="text-xl font-medium mb-2">No Rooms Added Yet</h3>
            <p className="text-gray-400 mb-6">
              Organize your smart home by adding rooms to group your devices.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[#2563eb] hover:bg-[#1e40af] rounded-md inline-flex items-center"
            >
              <i className="ri-add-line mr-2"></i>
              Add Your First Room
            </button>
          </div>
        )}
        {/* Render unassigned devices if any */}
        {devicesByRoom["unassigned"] &&
          devicesByRoom["unassigned"].length > 0 && (
            <div className="col-span-full">
              <h2 className="text-xl font-bold mb-4">Unassigned Devices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devicesByRoom["unassigned"].map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    // Pass necessary props for device actions if needed
                    // onToggle={toggleDevice}
                    // onEdit={handleEditDevice}
                    // onDelete={handleDeleteDevice}
                  />
                ))}
              </div>
            </div>
          )}
      </div>
    </motion.div>
  );
}
