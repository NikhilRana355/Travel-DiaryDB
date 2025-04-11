const LikeModel = require("../models/LikeModel")

const toggleLike = async (req, res) => {
    const { id: diaryId } = req.params;
    const { userId } = req.body;

    console.log("Toggle Like Request:", { diaryId, userId });
  
    try {
      const existingLike = await LikeModel.findOne({ diaryId, userId });
  
      if (existingLike) {
        await LikeModel.findByIdAndDelete(existingLike._id);
        return res.status(200).json({ liked: false });
      } else {
        await LikeModel.create({ diaryId, userId });
        return res.status(200).json({ liked: true });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

// const toggleLike = async (req, res) => {
//   const { id: diaryId } = req.params;
//   const { userId } = req.body;

//   console.log("Toggle Like Request:", { diaryId, userId });

//   try {
//     const existingLike = await LikeModel.findOne({ diaryId, userId });

//     if (existingLike) {
//       await LikeModel.findByIdAndDelete(existingLike._id);
//       return res.status(200).json({ liked: false });
//     } else {
//       await LikeModel.create({ diaryId, userId });

//       // 🔔 Send notification logic here
//       const diary = await DiaryModel.findById(diaryId).populate("userId", "fullName");
//       if (diary && diary.userId._id.toString() !== userId) {
//         const sender = await UserModel.findById(userId);

//         const newNotification = new NotificationModel({
//           recipient: diary.userId._id,
//           sender: userId,
//           message: `${sender.fullName} liked your post`,
//           type: "like",
//         });

//         await newNotification.save();
//         console.log("✅ Notification sent");
//       }

//       return res.status(200).json({ liked: true });
//     }
//   } catch (err) {
//     console.error("❌ Error in toggleLike:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };
  
  // Get like status and count
 const getLikeStatus = async (req, res) => {
    const { id: diaryId } = req.params;
    const { userId } = req.query;
  
    try {
      const liked = await LikeModel.findOne({ diaryId, userId });
      const count = await LikeModel.countDocuments({ diaryId });
      return res.status(200).json({ liked: !!liked, count });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  module.exports = {
    getLikeStatus,
    toggleLike,
  }