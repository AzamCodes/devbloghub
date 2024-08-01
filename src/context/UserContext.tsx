// context/UserContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  img: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  fetchUserDetails: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (status: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      const { message, data } = res.data;
      if (message === "User found" && data) {
        setUser(data);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        fetchUserDetails,
        setUser,
        setIsLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
