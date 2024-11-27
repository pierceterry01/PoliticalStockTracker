// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getUserData, setUserData } from '../data/userData';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getUserData());

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;