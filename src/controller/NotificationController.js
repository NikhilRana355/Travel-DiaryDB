// const NotificationModel = require("../models/NotificationModel");
const NotificationModel = require("../models/NotificationModel");
const notificationModel = require("../models/NotificationModel");
const userModel = require("../models/UserModel")

const createNotification = async (req, res) => {
    try {
        const { recipient, sender } = req.body;
        if (!recipient || !sender) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch sender username
        const senderUser = await userModel.findById(sender);
        if (!senderUser) {
            return res.status(404).json({ message: "Sender not found" });
        }
        const message = `${senderUser.fullName} started following you`;

        const notification = new notificationModel({
            recipient,
            sender,
            message,  // Store the proper notification message
            type: "follow",
            createdAt: new Date(),
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const getNotifications = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const notifications = await notificationModel.find({ recipient: userId })
//             .populate("sender", "fullName");
//         res.status(200).json(notifications);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getNotifications = async (req, res) => {
    try {
      const userId = req.params.userId;
      const notifications = await NotificationModel.find({ recipient: userId })
        .populate("sender", "fullName profilePic") // to show sender's name
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  };

const deleteNotifications = async (req, res) => {
    try {
      const { notificationIds } = req.body;
  
      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({ error: "Invalid request" });
      }
  
      await notificationModel.deleteMany({ _id: { $in: notificationIds } });
  
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const sendNotification = async (req, res) => {
    try {
        const { receiverId, senderId, message } = req.body;

        console.log("🔹 Received Notification Request:", { receiverId, senderId, message });

        if (!receiverId || !senderId || !message) {
            console.log("❌ Missing fields:", { receiverId, senderId, message });
            return res.status(400).json({ error: "Missing fields", details: { receiverId, senderId, message } });
        }

        const newNotification = new NotificationModel({
            recipient: receiverId,
            sender: senderId,
            message: message,
        });

        await newNotification.save();
        console.log("✅ Notification Saved Successfully:", newNotification);

        res.status(201).json({ message: "Notification sent successfully", notification: newNotification });
    } catch (err) {
        console.error("❌ Error Details:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};


  



module.exports = {
    createNotification, sendNotification,
    getNotifications, deleteNotifications
}