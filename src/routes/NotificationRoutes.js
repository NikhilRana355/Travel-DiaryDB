const routes = require('express').Router();
const notificationController = require('../controller/NotificationController');
const NotificationModel = require('../models/NotificationModel');
// const NotificationModel = require('../models/NotificationModel');
// routes.post('/notifications', notificationController.createNotification);
routes.get('/:userId', notificationController.getNotifications);
routes.delete('/delete',notificationController.deleteNotifications)

// routes.post("/notifications", async (req, res) => {
//     try {
//         const { senderId, receiverId, message } = req.body;
//         const newNotification = new NotificationModel({
//             senderId,
//             receiverId,
//             message,
//             createdAt: new Date()
//         });
//         await newNotification.save();
//         res.status(201).json({ success: true, notification: newNotification });
//     } catch (error) {
//         console.error("Error saving notification:", error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });


routes.post('/notify', async (req, res) => {
    try {
        const { recipient, sender, type } = req.body;

        if (!recipient || !sender || !type ) {
            return res.status(400).json({ error: "Recipient, sender, and type are required" });
        }

        const newNotification = new NotificationModel({
            recipient,
            sender,
            message: " Started following You.",
            type
        });

        await newNotification.save();
        res.status(201).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

// GET unread notification count for user
routes.get('/unread/count/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const count = await NotificationModel.countDocuments({
        recipient: userId,
        isRead: false,
      });
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get unread notifications" });
    }
  });

  routes.post('/mark-read/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      await NotificationModel.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
      );
      res.status(200).json({ message: "Marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark as read" });
    }
  }); 

routes.post('/send', async (req, res) => {
    const { receiverId, senderId, message, type } = req.body;

    if (!receiverId || !senderId || !message || !type) {
        return res.status(400).json({ error: "Missing fields" });
    }
    try {
        const newNotification = new NotificationModel({
            recipient: receiverId,
            sender: senderId,
            message: message,
            type,
             // This will now support "Followed you back!"
        });  

        await newNotification.save();

        res.status(201).json({ message: "Notification sent successfully", notification: newNotification });
    } catch (err) {
        console.error("Notification send failed:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// routes.delete("/delete", async (req, res) => { 
//     try {
//       const { notificationIds } = req.body;
  
//       if (!notificationIds || !Array.isArray(notificationIds)) {
//         return res.status(400).json({ error: "Invalid request" });
//       }
   
//       await Notification.deleteMany({ _id: { $in: notificationIds } });
  
//       res.status(200).json({ message: "Notifications deleted successfully" });
//     } catch (error) {
//       console.error("Delete error:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   });
  


module.exports = routes;