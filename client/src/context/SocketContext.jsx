
import { createContext, useContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null); // 🔑 persistent socket
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socketRef.current) return; // ✅ prevent re-creation

    // const socketInstance = io(
    //   import.meta.env.VITE_SOCKET_URL || "http://localhost:5002",
    //   {
    //     transports: ["websocket", "polling"],
    //     reconnection: true,
    //     reconnectionAttempts: Infinity,
    //   }
    // );
    const socketInstance = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
});


    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      setConnected(true);
      console.log("🔌 Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
      console.log("❌ Socket disconnected");
    });

    socketInstance.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("message_sent", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 🚫 DO NOT disconnect on unmount
    return () => {};
  }, []);

  const registerUser = (userId, role) => {
    socketRef.current?.emit("register", { userId, role });
  };

  const sendMessage = (data) => {
    socketRef.current?.emit("send_message", data);
  };

  const markAsRead = (messageId, userId) => {
    socketRef.current?.emit("mark_as_read", { messageId, userId });
  };

  const emitTyping = (receiverId, isTyping) => {
    socketRef.current?.emit("typing", { receiverId, isTyping });
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        messages,
        registerUser,
        sendMessage,
        markAsRead,
        emitTyping,
        setMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

