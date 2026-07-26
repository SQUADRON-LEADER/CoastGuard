import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';
import { api } from '../lib/mongodb';
import { useNavigate } from 'react-router-dom';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
  updateUserLocation: (location: { lat: number; lng: number; address: string }) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  preferredLanguage: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is stored in localStorage on app load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('coastguard_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setAuthState({
            user: {
              ...userData,
              createdAt: new Date(userData.createdAt),
              lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
              badges: userData.badges || [],
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('coastguard_user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data.user;

      const user: User = {
        ...userData,
        id: userData._id,
        createdAt: new Date(userData.createdAt),
        lastLogin: new Date(),
        badges: userData.badges || [],
      };

      // Store user data in localStorage
      localStorage.setItem('coastguard_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect based on role to ensure dashboard loads
      if (user.role === 'verifier_protector') {
        navigate('/verifier-dashboard', { replace: true });
      } else if (user.role === 'community_validator') {
        navigate('/community-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      console.log('AuthContext.register: Attempting to register user:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('AuthContext.register: Registration response:', response);
      const newUserData = response.data.user;

      const user: User = {
        ...newUserData,
        id: newUserData._id,
        createdAt: new Date(newUserData.createdAt),
        badges: [],
      };

      // Store user data in localStorage
      localStorage.setItem('coastguard_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect after registration
      if (user.role === 'verifier_protector') {
        navigate('/verifier-dashboard', { replace: true });
      } else if (user.role === 'community_validator') {
        navigate('/community-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

      console.log('AuthContext.register: Registration successful');
      return true;
    } catch (error) {
      console.error('AuthContext.register: Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('coastguard_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUserRole = async (role: UserRole) => {
    if (authState.user) {
      try {
        await api.patch(`/users/${authState.user.id}/role`, { role });
        const updatedUser = { ...authState.user, role };
        
        // Update localStorage
        localStorage.setItem('coastguard_user', JSON.stringify(updatedUser));
        
        setAuthState(prev => ({ ...prev, user: updatedUser }));
      } catch (error) {
        console.error('Failed to update user role:', error);
      }
    }
  };

  const updateUserLocation = async (location: { lat: number; lng: number; address: string }) => {
    if (authState.user) {
      try {
        await api.patch(`/users/${authState.user.id}/location`, { location });
        const updatedUser = { ...authState.user, location };
        
        // Update localStorage
        localStorage.setItem('coastguard_user', JSON.stringify(updatedUser));
        
        setAuthState(prev => ({ ...prev, user: updatedUser }));
      } catch (error) {
        console.error('Failed to update user location:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      register, 
      logout, 
      updateUserRole, 
      updateUserLocation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};