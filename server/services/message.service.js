import Message from "../models/Message.js";
import mongoose from "mongoose";

/**
 * Save a new message
 */
export async function saveMessage(data) {
  return await Message.create(data);
}

/**
 * Get full conversation between two users
 */
export async function getConversation(userId, otherUserId) {
  return await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }).sort({ createdAt: 1 });
}

/**
 * Get last message per conversation
 */
export async function getConversations(userId) {
  const objectId = new mongoose.Types.ObjectId(userId);

  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ senderId: objectId }, { receiverId: objectId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$senderId", objectId] },
            "$receiverId",
            "$senderId",
          ],
        },
        lastMessage: { $first: "$content" },
        lastMessageTime: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", objectId] },
                  { $eq: ["$read", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
        role: { $first: "$senderRole" },
      },
    },
    { $sort: { lastMessageTime: -1 } },
  ]);

  return conversations.map((c) => ({
    userId: c._id,
    lastMessage: c.lastMessage,
    lastMessageTime: c.lastMessageTime,
    unreadCount: c.unreadCount,
    role: c.role,
  }));
}

/**
 * Get unread message count
 */
export async function getUnreadCount(userId) {
  return await Message.countDocuments({
    receiverId: userId,
    read: false,
  });
}

/**
 * Mark messages as read
 */
export async function markMessagesRead(senderId, receiverId) {
  return await Message.updateMany(
    { senderId, receiverId, read: false },
    { $set: { read: true } }
  );
}
