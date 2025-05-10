import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Simulate incoming WebSocket messages
    const interval = setInterval(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: 'New tag suggestion from AI' }]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <WebSocketContext.Provider value={{ messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};
