
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export const useFirstTimeSetup = () => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [checking, setChecking] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await api.get('/auth/check-setup');
        setIsFirstTime(response.data.isFirstTime);
      } catch (error) {
        console.error('Error checking setup:', error);
        // Asume que es la primera vez si hay un error
        setIsFirstTime(true);
      } finally {
        setChecking(false);
      }
    };

    checkSetup();
  }, []);

  const register = async (username: string, password: string) => {
    setRegistering(true);
    try {
      const response = await api.post('/auth/setup', { username, password });
      localStorage.setItem('token', response.data.token);
      setIsFirstTime(false);
      return response.data;
    } catch (error) {
      console.error('Error during setup:', error);
      throw error;
    } finally {
      setRegistering(false);
    }
  };

  return { isFirstTime, checking, register, registering };
};
