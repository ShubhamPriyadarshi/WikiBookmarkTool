import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import api from './api';
const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading, true/false = result
  const { logout } = useAuth();
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');


      try {
        const res = await api.get('/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.valid === true ) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsAuthorized(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthorized === null) {
    return null; // Or a loading spinner
  }

  if (!isAuthorized) {
    logout();

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
