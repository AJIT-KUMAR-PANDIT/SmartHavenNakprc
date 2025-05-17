import { useState, useEffect } from "react";
import { getAllRooms, addRoom, updateRoom, removeRoom } from "@/lib/db";

const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const roomsData = await getAllRooms();
      setRooms(roomsData);
    } catch (err) {
      setError(err.message || "Failed to load rooms");
      console.error("Failed to load rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async (roomData) => {
    try {
      const newRoom = await addRoom(roomData);
      // Optimistically update the state or refetch
      loadRooms(); // Refetch for simplicity
      return newRoom;
    } catch (err) {
      setError(err.message || "Failed to create room");
      console.error("Failed to create room:", err);
      throw err; // Re-throw to allow component to handle
    }
  };

  const editRoom = async (roomId, roomData) => {
    try {
      const updatedRoom = await updateRoom(roomId, roomData);
      // Optimistically update the state or refetch
      loadRooms(); // Refetch for simplicity
      return updatedRoom;
    } catch (err) {
      setError(err.message || "Failed to update room");
      console.error("Failed to update room:", err);
      throw err; // Re-throw to allow component to handle
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      await removeRoom(roomId);
      // Optimistically update the state or refetch
      loadRooms(); // Refetch for simplicity
    } catch (err) {
      setError(err.message || "Failed to delete room");
      console.error("Failed to delete room:", err);
      throw err; // Re-throw to allow component to handle
    }
  };

  // Load rooms on initial mount
  useEffect(() => {
    loadRooms();
  }, []);

  return {
    rooms,
    isLoading,
    error,
    loadRooms,
    createRoom,
    editRoom,
    deleteRoom,
  };
};

export default useRooms;
