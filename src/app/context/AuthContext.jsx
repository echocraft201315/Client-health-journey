'use client'
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { socket } from "@/socket";
import { fetchWithSubscriptionCheck } from "@/app/lib/apiUtils";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data: session } = useSession();

  const fetchUserData = async () => {
    try {
      const data = await fetchWithSubscriptionCheck('/api/user/profile', {}, 'User fetch failed');
      if (data.success) {
        setUser(data.user);
      } else {
        signOut();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.message.includes('redirecting to login')) {
        // The utility function already handled the redirect
        return;
      }
      signOut();
    }
  }

  useEffect(() => {
    console.log("session", session);
    if (session?.user && !user) {
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    if (!user) return;

    function onConnect() {
      socket.emit("user_login", user.email);
    }

    socket.on("connect", onConnect);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
