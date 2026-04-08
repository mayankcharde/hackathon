import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only connect if user is authenticated
    if (user && user._id) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
      
      newSocket.on('connect', () => {
        console.log('🔌 Connected to Socket.io server');
        // Join the user's private notification room
        newSocket.emit('join', user._id);
      });

      // Listen for new message notifications
      newSocket.on('new_notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        
        // Notification Sound Logic
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio playback failed:', e));

        // Open a native notification if possible
        if (Notification.permission === 'granted') {
          new Notification(data.itemName || 'Foundit Alert', { body: data.message });
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Request browser notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const clearNotifications = () => setNotifications([]);

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
