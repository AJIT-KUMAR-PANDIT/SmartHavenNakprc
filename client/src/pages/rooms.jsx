import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const RoomCard = ({ room, onEdit, onDelete }) => {
  const { data: devices } = useQuery({ 
    queryKey: ['/api/devices'],
    refetchOnWindowFocus: false
  });
  
  // Filter devices that belong to this room
  const roomDevices = devices ? devices.filter(device => device.roomId === room.id) : [];
  
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
            <i className={`text-6xl text-white opacity-30 ${getRoomIcon(room.type)}`}></i>
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
          <span>{capitalizeFirstLetter(room.type || 'Room')}</span>
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
          {roomDevices.slice(0, 4).map(device => (
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
          <button
            className="py-2 bg-[#1e1e2e] hover:bg-gray-800 transition-colors border border-gray-700 rounded-md flex justify-center items-center"
          >
            <i className="ri-lightbulb-line mr-2"></i>
            All Lights
          </button>
          <button
            className="py-2 bg-[#2563eb] hover:bg-[#1e40af] transition-colors rounded-md flex justify-center items-center"
          >
            <i className="ri-dashboard-3-line mr-2"></i>
            Controls
          </button>
        </div>
      </div>
    </div>
  );
};

// Room form for adding/editing rooms
const RoomForm = ({ isEdit, roomData, onSubmit, onCancel }) => {
  const [name, setName] = useState(roomData?.name || '');
  const [type, setType] = useState(roomData?.type || 'living');
  const [image, setImage] = useState(roomData?.image || '');
  const [floor, setFloor] = useState(roomData?.floor || 1);
  
  const roomTypes = [
    { id: 'living', label: 'Living Room', icon: 'ri-sofa-line' },
    { id: 'bedroom', label: 'Bedroom', icon: 'ri-hotel-bed-line' },
    { id: 'kitchen', label: 'Kitchen', icon: 'ri-fridge-line' },
    { id: 'bathroom', label: 'Bathroom', icon: 'ri-shower-room-line' },
    { id: 'office', label: 'Office', icon: 'ri-computer-line' },
    { id: 'hallway', label: 'Hallway', icon: 'ri-door-line' },
    { id: 'garage', label: 'Garage', icon: 'ri-car-line' },
    { id: 'outdoor', label: 'Outdoor', icon: 'ri-plant-line' },
    { id: 'other', label: 'Other', icon: 'ri-home-line' }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: roomData?.id,
      name,
      type,
      image,
      floor: parseInt(floor),
      createdAt: roomData?.createdAt || new Date().toISOString()
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-[#1e1e2e] rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-6">{isEdit ? 'Edit Room' : 'Add New Room'}</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-2">Room Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-[#121218] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Room Type</label>
        <div className="grid grid-cols-3 gap-2">
          {roomTypes.map(roomType => (
            <div 
              key={roomType.id}
              className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors ${
                type === roomType.id
                  ? 'bg-[#2563eb]/10 border-[#2563eb]'
                  : 'border-gray-700 hover:bg-gray-800'
              }`}
              onClick={() => setType(roomType.id)}
            >
              <i className={`${roomType.icon} text-xl mb-2 ${type === roomType.id ? 'text-[#2563eb]' : 'text-gray-400'}`}></i>
              <span className={`text-xs ${type === roomType.id ? 'text-white' : 'text-gray-400'}`}>{roomType.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium mb-2">Image URL (Optional)</label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/room-image.jpg"
          className="w-full px-3 py-2 bg-[#121218] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
        />
        <p className="text-xs text-gray-500 mt-1">Enter a URL for a room image or leave blank to use default icon</p>
      </div>
      
      <div className="mb-6">
        <label htmlFor="floor" className="block text-sm font-medium mb-2">Floor</label>
        <select
          id="floor"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className="w-full px-3 py-2 bg-[#121218] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
        >
          <option value={-1}>Basement</option>
          <option value={0}>Ground Floor</option>
          <option value={1}>First Floor</option>
          <option value={2}>Second Floor</option>
          <option value={3}>Third Floor</option>
          <option value={4}>Fourth Floor</option>
        </select>
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
          disabled={!name}
        >
          {isEdit ? 'Update Room' : 'Add Room'}
        </button>
      </div>
    </form>
  );
};

// Get room icon based on type
function getRoomIcon(type) {
  const icons = {
    living: 'ri-sofa-line',
    bedroom: 'ri-hotel-bed-line',
    kitchen: 'ri-fridge-line',
    bathroom: 'ri-shower-room-line',
    office: 'ri-computer-line',
    hallway: 'ri-door-line',
    garage: 'ri-car-line',
    outdoor: 'ri-plant-line',
    default: 'ri-home-line'
  };
  
  return icons[type?.toLowerCase()] || icons.default;
}

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

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Rooms() {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch rooms
  const { data: rooms, isLoading } = useQuery({ 
    queryKey: ['/api/rooms'],
    refetchOnWindowFocus: false
  });
  
  // Add room mutation
  const addRoomMutation = useMutation({
    mutationFn: async (roomData) => {
      const res = await apiRequest('POST', '/api/rooms', roomData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      toast({
        title: "Success",
        description: "Room added successfully",
      });
      setShowForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add room: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: async (roomData) => {
      const res = await apiRequest('PUT', `/api/rooms/${roomData.id}`, roomData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      toast({
        title: "Success",
        description: "Room updated successfully",
      });
      setShowForm(false);
      setEditingRoom(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update room: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiRequest('DELETE', `/api/rooms/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete room: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleRoomSubmit = (roomData) => {
    if (editingRoom) {
      updateRoomMutation.mutate(roomData);
    } else {
      addRoomMutation.mutate(roomData);
    }
  };
  
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };
  
  const handleDeleteRoom = (id) => {
    if (confirm("Are you sure you want to delete this room? This will not delete the devices in the room, but they will no longer be associated with any room.")) {
      deleteRoomMutation.mutate(id);
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

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
      
      {showForm ? (
        <RoomForm 
          isEdit={!!editingRoom}
          roomData={editingRoom}
          onSubmit={handleRoomSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
            </div>
          ) : rooms && rooms.length > 0 ? (
            rooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
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
        </div>
      )}
    </motion.div>
  );
}