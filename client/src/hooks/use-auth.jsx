import { createContext, useContext, useState, useEffect } from 'react';
import { createUser, getAllUsers, authenticateUser } from '@/lib/db';

// Create a context for authentication
const AuthContext = createContext(null);

// Authentication provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for existing session when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a stored user session
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setIsAuthenticated(true);
          // Log authentication action (removed addLog function call that's not defined)
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthError('Failed to restore session');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Function to handle login
  const login = async (username, pin) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const user = await authenticateUser(username, pin);
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        // Store user in local storage for session persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Auth:', `User ${username} logged in`);
        return true;
      } else {
        setAuthError('Invalid username or PIN');
        console.error('Auth:', `Failed login attempt for user ${username}`);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('Login failed: ' + error.message);
      console.error('Auth:', `Login error: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle signup
  const signup = async (username, pin) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Check if username already exists
      const users = await getAllUsers();
      const existingUser = users.find(user => user.username === username);
      
      if (existingUser) {
        setAuthError('Username already exists');
        return false;
      }
      
      // Create new user
      const newUser = await createUser({ username, pin });
      
      if (newUser) {
        // Automatically log in
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        console.log('Auth:', `New user ${username} created and logged in`);
        return true;
      } else {
        setAuthError('Failed to create user');
        return false;
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setAuthError('Signup failed: ' + error.message);
      console.error('Auth:', `Signup error: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    console.log('Auth:', 'User logged out');
  };

  // Provider value
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    authError,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Default export for the hook
export default useAuth;