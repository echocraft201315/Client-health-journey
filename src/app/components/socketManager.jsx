"use client";

import { useEffect } from "react";
import { socket } from "@/socket";
import { useAuth } from "../context/AuthContext";

export default function SocketManager() {
  const { user } = useAuth();

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

  return null;
}
