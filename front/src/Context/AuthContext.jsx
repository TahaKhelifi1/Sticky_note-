import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/auth/session');
        setUser(response.data.user || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
