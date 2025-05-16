import { QueryClient, QueryFunction } from "@tanstack/react-query";
import mockApiService from "../../mock-api/mock-service";

// Local API request function that uses our mock service instead of making HTTP requests
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  console.log(`Local API request: ${method} ${url}`);
  
  try {
    // Handle different API endpoints using the mock service
    if (url.startsWith('/api/devices')) {
      const id = url.split('/').pop();
      
      if (method === 'GET' && url === '/api/devices') {
        const devices = await mockApiService.getDevices();
        return { json: async () => devices };
      } else if (method === 'POST') {
        const result = await mockApiService.addDevice(data as any);
        return { json: async () => result };
      } else if (method === 'PUT' && id !== 'devices') {
        const result = await mockApiService.updateDevice(id as string, data as any);
        return { json: async () => result };
      } else if (method === 'DELETE' && id !== 'devices') {
        const success = await mockApiService.deleteDevice(id as string);
        return { json: async () => ({ success }) };
      }
    }
    else if (url.startsWith('/api/routes')) {
      const id = url.split('/').pop();
      
      if (method === 'GET' && url === '/api/routes') {
        const routes = await mockApiService.getRoutes();
        return { json: async () => routes };
      } else if (method === 'POST') {
        const result = await mockApiService.addRoute(data as any);
        return { json: async () => result };
      } else if (method === 'PUT' && id !== 'routes') {
        const result = await mockApiService.updateRoute(id as string, data as any);
        return { json: async () => result };
      } else if (method === 'DELETE' && id !== 'routes') {
        const success = await mockApiService.deleteRoute(id as string);
        return { json: async () => ({ success }) };
      }
    }
    else if (url.startsWith('/api/logs')) {
      if (method === 'GET') {
        const logs = await mockApiService.getLogs();
        return { json: async () => logs };
      }
    }
    else if (url.startsWith('/api/settings')) {
      if (url.includes('/export')) {
        const result = await mockApiService.exportSettings();
        return { json: async () => result };
      } else if (url.includes('/import')) {
        const result = await mockApiService.importSettings((data as any).data);
        return { json: async () => result };
      } else if (method === 'GET') {
        const settings = await mockApiService.getSettings();
        return { json: async () => settings };
      } else if (method === 'POST') {
        const result = await mockApiService.saveSettings(data as any);
        return { json: async () => result };
      }
    }
    else if (url.startsWith('/api/auth/login')) {
      const { username, pin } = data as any;
      const result = await mockApiService.login(username, pin);
      return { json: async () => result };
    }
    else if (url.startsWith('/api/auth/register')) {
      const { username, pin } = data as any;
      const result = await mockApiService.register(username, pin);
      return { json: async () => result };
    }
    
    throw new Error(`Unhandled API request: ${method} ${url}`);
  } catch (error: any) {
    console.error('Local API request error:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const url = queryKey[0] as string;
      
      // Use our local API request function instead of fetch
      const response = await apiRequest('GET', url, undefined);
      
      // Get the JSON from the response
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Query function error:', error);
      if (error.message === 'Invalid credentials' && unauthorizedBehavior === 'returnNull') {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
