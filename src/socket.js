"use client";

import { io } from "socket.io-client";

const socketUrl =
    process.env.SOCKET_URL ||
    process.env.NEXTAUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

export const socket = io(socketUrl);