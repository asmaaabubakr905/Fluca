import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import socket from '../socket';
import notificationSound from '../assets/notification.mp3';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRideType, setSelectedRideType] = useState('private');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'captain',
      message: 'Hello! I\'m Captain Omar. I\'ll be your captain today. I\'m on my way to pick you up!',
      timestamp: '14:25'
    },
    {
      id: '2',
      sender: 'user',
      message: 'Great! How long until you arrive?',
      timestamp: '14:26'
    },
    {
      id: '3',
      sender: 'captain',
      message: 'About 3 minutes. I\'m in a blue and white yacht. Look for "Sea Breeze"',
      timestamp: '14:27'
    }
  ]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const audioRef = useRef(null);

  // استقبال رسائل الشات وتشغيل صوت الإشعار وتفعيل hasNewMessage
  useEffect(() => {
    const handleChatMessage = (msg) => {
      setHasNewMessage(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    };
    socket.on('chatMessage', handleChatMessage);
    return () => socket.off('chatMessage', handleChatMessage);
  }, []);

  // Custom setSelectedTrip with logging
  const setSelectedTripWithLogging = (trip) => {
    console.log('AppContext - setSelectedTrip called with:', trip);
    setSelectedTrip(trip);
  };

  const value = {
    selectedLanguage,
    setSelectedLanguage,
    selectedRideType,
    setSelectedRideType,
    pickupLocation,
    setPickupLocation,
    destination,
    setDestination,
    selectedSeats,
    setSelectedSeats,
    selectedTrip,
    setSelectedTrip: setSelectedTripWithLogging,
    chatMessages,
    setChatMessages,
    hasNewMessage,
    setHasNewMessage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={notificationSound} preload="auto" />
    </AppContext.Provider>
  );
};