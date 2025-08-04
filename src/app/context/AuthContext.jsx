'use client'
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/apiUtils";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const res = await apiFetch(`/api/user/profile`);
      
      // If apiFetch returned a handled response (subscription inactive)
      if (res.success === false) {
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        signOut();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
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
