import express from "express";
import {
  getConversation,
  getConversations,
  getUnreadCount,
  markMessagesRead,
} from "../services/message.service.js";

const router = express.Router();


/**
 * GET unread message count
 * Used by MessageList.jsx
 */
router.get("/unread-count/:userId", async (req, res) => {
  try {
    const count = await getUnreadCount(req.params.userId);
    res.json({ count });
  } catch (err) {
    console.error("Unread count error:", err);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});
/**
 * GET all conversations for a user
 * Used by MessageList.jsx
 */
router.get("/conversations/:userId", async (req, res) => {
  try {
    const conversations = await getConversations(req.params.userId);
    res.json(conversations);
  } catch (err) {
    console.error("Conversation fetch error:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

/**
 * GET chat history between two users
 * Used by ChatInterface.jsx
 */
router.get("/:userId/:otherUserId", async (req, res) => {
  try {
    const messages = await getConversation(
      req.params.userId,
      req.params.otherUserId
    );
    res.json(messages);
  } catch (err) {
    console.error("Message fetch error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});



/**
 * Mark messages as read
 */
router.put("/mark-read", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    await markMessagesRead(senderId, receiverId);
    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

router.get("/history/:userId/:otherUserId", async (req, res) => {
  const messages = await getConversation(
    req.params.userId,
    req.params.otherUserId
  );
  res.json(messages);
});


export default router;
