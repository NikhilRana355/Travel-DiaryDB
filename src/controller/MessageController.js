const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");
// const User = require("../models/UserModel");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Validate sender and receiver
    const sender = await UserModel.findById(senderId);
    const receiver = await UserModel.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }

    // Check if sender is following the receiver
    const isFollowing = sender.following.includes(receiverId);
    if (!isFollowing) {
      return res.status(403).json({ message: "You can only message users you follow" });
    }

    // Create and save the message
    const newMessage = new MessageModel({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await newMessage.save();

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

  
  // Get messages between two users
// Show all messages between sender and receiver
const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const markMessagesAsRead = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    await MessageModel.updateMany(
      { sender: senderId, receiver: receiverId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};



module.exports = {
    sendMessage,
    getMessages,
    markMessagesAsRead,

}