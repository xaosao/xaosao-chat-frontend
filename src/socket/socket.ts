// @ts-nocheck
import { io } from "socket.io-client";
import { getAuthToken } from "../utils/getAuthToken";

let socket: SocketIOClient;

export const initiateSocketConnection = () => {
  if (!socket) {
    const token = getAuthToken();
    socket = io(`${import.meta.env.VITE_SOCKET_URL}?token=${token}`, {
      path: "/socket",
    });
    // socket = io(`http://192.168.0.27:1808`);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const socketInstance = () => {
  if (!socket) {
    const token = getAuthToken();
    socket = io(`${import.meta.env.VITE_SOCKET_URL}?token=${token}`, {
      path: "/socket",
    });

    // socket = io(`http://192.168.0.27:1808`);
  }
  return socket;
};
