import Message from "../models/Message.js";

const userSocketMap = new Map(); // userId -> socketId

export default function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Register user
    socket.on("register", ({ userId, role }) => {
      userSocketMap.set(userId, socket.id);
      socket.userId = userId;
      socket.role = role;
      console.log(`✅ User ${userId} (${role}) registered`);
    });

    // Send message
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, content, senderRole, receiverRole } = data;

      // ❌ student → student not allowed
      if (senderRole === "student" && receiverRole === "student") {
        return socket.emit("error", {
          message: "Students cannot message each other",
        });
      }

      try {
        const message = await Message.create({
          senderId,
          receiverId,
          senderRole,
          receiverRole,
          content,
          read: false,
        });

        // Emit to sender
        socket.emit("message_sent", message);

        // Emit to receiver if online
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }
      } catch (err) {
        console.error("❌ Message save error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Mark as read
    socket.on("mark_as_read", async ({ messageId, userId }) => {
      try {
        await Message.updateOne(
          { _id: messageId, receiverId: userId },
          { $set: { read: true } }
        );
      } catch (err) {
        console.error("❌ Mark read error:", err);
      }
    });

    // Typing indicator ✅ FIXED
    socket.on("typing", ({ receiverId, isTyping }) => {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", {
          senderId: socket.userId,
          isTyping,
        });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        userSocketMap.delete(socket.userId);
        console.log(`❌ User ${socket.userId} disconnected`);
      }
    });
  });
}
