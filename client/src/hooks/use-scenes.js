import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllScenes,
  addScene,
  updateScene,
  removeScene,
  activateScene,
} from "@/lib/db";

const useScenes = () => {
  const queryClient = useQueryClient();

  // Fetch scenes
  const {
    data: scenes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/scenes"],
    queryFn: getAllScenes, // Use local db function
    refetchOnWindowFocus: false,
  });

  // Create scene mutation
  const createScene = useMutation({
    mutationFn: async (sceneData) => {
      // const res = await apiRequest("POST", "/api/scenes", sceneData); // Remove API call
      // return res.json();
      return addScene(sceneData); // Use local db function
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scenes"] });
    },
  });

  // Update scene mutation
  const editScene = useMutation({
    mutationFn: async ({ id, sceneData }) => {
      // const res = await apiRequest("PUT", `/api/scenes/${id}`, sceneData); // Remove API call
      // return res.json();
      return updateScene(id, sceneData); // Use local db function
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scenes"] });
    },
  });

  // Delete scene mutation
  const deleteScene = useMutation({
    mutationFn: async (id) => {
      // const res = await apiRequest("DELETE", `/api/scenes/${id}`); // Remove API call
      // return res.json();
      return removeScene(id); // Use local db function
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scenes"] });
    },
  });

  // Activate scene mutation
  const activateScene = useMutation({
    mutationFn: async (id) => {
      // const res = await apiRequest("POST", `/api/scenes/${id}/activate`); // Remove API call
      // return res.json();
      return activateScene(id); // Use local db function
    },
    onSuccess: () => {
      // Invalidate devices query as activating a scene updates device states
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scenes"] }); // Also invalidate scenes to reflect potential changes
    },
  });

  return {
    scenes,
    isLoading,
    error,
    createScene: createScene.mutateAsync,
    editScene: editScene.mutateAsync,
    deleteScene: deleteScene.mutateAsync,
    activateScene: activateScene.mutateAsync,
  };
};

export default useScenes;
