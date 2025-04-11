import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(process.env.REACT_APP_SOCKET_API, {
        reconnection: true, // Enable automatic reconnection
        reconnectionAttempts: 5, // Retry up to 5 times
        reconnectionDelay: 2000, // Wait 2 seconds before retrying
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Connected to socket server");
      });

      newSocket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
        setSocket(null); // Reset state so useEffect runs again if needed
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  // If socket is null, try creating it again
  if (!socket) {
    setSocket(io(process.env.REACT_APP_SOCKET_API));
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
