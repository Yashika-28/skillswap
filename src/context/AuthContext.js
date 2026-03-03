// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  const [users, setUsers] = useState(() =>
    JSON.parse(localStorage.getItem("users")) || []
  );

  const signup = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // auto login after signup
    setUser(newUser);
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));
  };

  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) return false;
    setUser(foundUser);
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <AuthContext.Provider value={{ user, users, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
