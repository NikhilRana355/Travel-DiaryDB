const diaryModel = require("../models/DiaryModel")
const multer = require('multer');
const path = require('path');
const CloudinaryUtil = require("../utils/CloudnaryUtil");
const DiaryModel = require("../models/DiaryModel");
const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

const addDiary = async (req, res) => {
  try {
    const savedDiary = await diaryModel.create(req.body);
    res.status(201).json({
      message: "Diary addedSuccesfully",
      data: savedDiary,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

// const getAllDiary = async (req, res) => {
//     try {
//         const diaries = await diaryModel.find().populate("userId", "fullName  userName  profilePic"); // Ensure userId & name are included
//         console.log("📢 Sending Diaries:", diaries); // Debugging step 4
//         res.status(200).json({
//             message: "All Diaries fetched successfully",
//             data: diaries
//         });
//     } catch (err) {
//         console.error("🚨 Error in getAllDiary:", err);
//         res.status(500).json({
//             message: err.message
//         });
//     }
// };

const getAllDiary = async (req, res) => {
  try {
    const diaries = await diaryModel.find()
      .populate("userId", "fullName userName profilePic")
      .populate("countryId", "name")
      .populate("stateId", "name")
      .populate("cityId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All Diaries fetched successfully",
      data: diaries,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const getAllDiaryByUserId = async (req, res) => {
  try {
    const diary = await diaryModel
      .find({ userId: req.params.userId }).populate("userId");
    if (diary.length === 0) {
      res.status(404).json({ message: "No diary found" });
    } else {
      res.status(200).json({
        message: "Diary found succesfully",
        data: diary,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addDiaryWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      // database data store
      //cloundinary

      const cloundinaryResponse = await CloudinaryUtil.uploadFileToCloudinary(req.file);
      console.log(cloundinaryResponse);
      console.log(req.body);

      //store data in database
      req.body.imageURL = cloundinaryResponse.secure_url;
      const savedDiary = await DiaryModel.create(req.body);

      res.status(200).json({
        message: "image saved successfully",
        data: savedDiary
      });
    }
  });
};

const updateDiary = async (req, res) => {
  try {
    const updateDiary = await diaryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Diary updated succesfully ",
      data: updateDiary,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while update image",
      err: err,
    });
  }
};

const getDiaryById = async (req, res) => {
  try {
    const Diary = await diaryModel.findById(req.params.id);
    if (!Diary) {
      res.status(404).json({ message: "No Diary Found" });
    } else {
      res.status(200).json({
        message: "Diary found succesfully",
        data: Diary,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const diary = await DiaryModel.findById(postId);
    if (!diary) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (diary.likes.includes(userId)) {
      diary.likes = diary.likes.filter((id) => id !== userId);
      await diary.save();
      return res.status(200).json({ message: "Unliked the post", diary });
    } else {
      diary.likes.push(userId);
      await diary.save();

      // 🔔 Send a notification to the post owner (if not the liker themselves)
      if (diary.userId.toString() !== userId) {
        const senderUser = await UserModel.findById(userId);
        const message = `${senderUser.fullName} liked your post`;

        const newNotification = new NotificationModel({
          recipient: diary.userId,
          sender: userId,
          message,
          type: "like",
        });

        await newNotification.save();
      }

      return res.status(200).json({ message: "Liked the post", diary });
    }
  } catch (error) {
    console.error("Error in likePost:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const commentPost = async (req, res) => {
  const { diaryId, commenterId, commentText } = req.body;

  try {
    const diary = await DiaryModel.findById(diaryId).populate("user");
    const commenter = await UserModel.findById(commenterId);

    if (!diary || !commenter) {
      return res.status(404).json({ message: "User or post not found" });
    }

    // Add comment to the diary
    diary.comments.push({
      user: commenterId,
      text: commentText,
      createdAt: new Date()
    });

    await diary.save();

    // Send notification to the post owner
    // await createNotification({
    //   senderId: commenterId,
    //   receiverId: diary.user._id.toString(),
    //   message: `${commenter.fullName} commented on your post`,
    //   type: "comment",
    // });

    const newNotification = new NotificationModel({
      recipient: diary.user._id,
      sender: commenterId,
      message: `${commenter.fullName} commented on your post`,
      type: "comment",
    });
    await newNotification.save();
    

    res.status(200).json({ message: "Comment added and notification sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createDiary = async (req, res) => {
  try {
    const newDiary = new Diary({
      userId: "67d6a35ab8c858b01e422ae1", // this should come from auth middleware
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      imageURL: req.body.imageURL,
      countryId: req.body.countryId,  // 🔥 ObjectId from frontend
      stateId: req.body.stateId,
      cityId: req.body.cityId,
    });

    const saved = await newDiary.save();

    res.status(201).json({
      message: "Diary created successfully",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addDiary,
  getAllDiary,
  getAllDiaryByUserId,
  addDiaryWithFile,
  updateDiary,
  getDiaryById,createDiary,
  likePost, commentPost,
}