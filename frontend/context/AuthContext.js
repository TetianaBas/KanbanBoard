import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to update login status
  const logIn = () => setIsLoggedIn(true);
  const logOut = () => setIsLoggedIn(false);

  useEffect(() => {
    // Fetch login status from backend on component mount
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/login_status', {
          credentials: 'include', // Necessary for sessions to work
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isLoggedIn);
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
