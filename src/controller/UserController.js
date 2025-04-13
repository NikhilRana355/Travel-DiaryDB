const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt")
const mailUtil = require("../utils/MailUtil")
const jwt = require("jsonwebtoken");
const secret = "secret";
const mongoose = require("mongoose");
const CloudinaryUtil = require("../utils/CloudnaryUtil");
const multer = require('multer');
const UserModel = require("../models/UserModel");
const DiaryModel = require("../models/DiaryModel");
const path = require("path");
const fs = require("fs"); // ✅ This is missing!


const storage = multer.diskStorage({
    destination: "./uploads",
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage
}).single("image");

const loginUser = async (req,res) => {

    const email = req.body.email;
    const password = req.body.password;

    const foundUserfromEmail = await userModel.findOne({email: email}).populate("roleId")
    console.log(foundUserfromEmail); 

    if (foundUserfromEmail != null ) {
        const isMatch = bcrypt.compareSync(password, foundUserfromEmail.password);

        if (isMatch == true) {
            res.status(200).json({
                message:"login success",
                data : foundUserfromEmail,
            });
        } else {
            res.status(404).json({
                message:"invalid cred..",
            });
        } 
    } else {
            res.status(404).json({
                message:"email not found..",
            });
        }
    }; 
    
const signup = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword =bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;
        const createdUser = await userModel.create(req.body);

        //send mail to user...
    //const mailResponse = await mailUtil.sendingMail(createdUser.email,"welcome to eadvertisement","this is welcome mail")
    await mailUtil.sendingMail(createdUser.email,"welcome to Travel Diary","this is welcome mail")

        res.status(201).json({
            message:"user created..",
            data: createdUser,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message:"error",
            data: err,
        });
    }
};

const addUser = async (req, res) => {
    const savedUser = await userModel.create(req.body);
    res.json({
        message:"User saved successfully",
        data: savedUser,
    });
};
const getAllUsers = async (req, res) => {
    const users = await userModel.find().populate("roleId");
    res.json({
        message:"User fetched successfully..",
        data: users,
    });
};

// const getUserById = async (req, res) => {
//     const foundUser = await userModel.findById(req.params.id);
//     res.json({
//         message: "user fetched successfully..",
//         data: foundUser,
//     });
// };

const deleteUserById = async (req, res) => {
    console.log("User ID received:", req.params.id || req.body.id); // Debugging

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully", data: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// const getUserById = async (req, res) => {
//     try {
//         const foundUser = await userModel.findById(req.params.id);
//         if (!foundUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json({ message: "User fetched successfully", data: { ...foundUser._doc, profilePic: foundUser.profilePic || "" } });
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching user", error: err });
//     }
// };

// const updateUserProfile = async (req, res) => {
//     try {
//         const { fullName, bio, socialLinks } = req.body;

//         // Prepare updated fields
//         let updatedFields = { fullName, bio, socialLinks };

//         // Check if a profile picture is uploaded and update it
//         if (req.file) {
//             const cloundinaryResponse = await uploadFileToCloudinary(req.file);
//             updatedFields.profilePic = cloundinaryResponse.secure_url;
//         }

//         // Update the user with new data
//         const updatedUser = await userModel.findByIdAndUpdate(
//             req.params.id,
//             updatedFields,
//             { new: true }
//         );

//         res.json({
//             message: "Profile updated successfully",
//             data: updatedUser,
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "Error updating profile",
//             error: err,
//         });
//     }
// };

const forgotPassword = async (req, res) => {
    const email = req.body.email;
    const foundUser = await userModel.findOne({ email: email });

    if (foundUser) {
        const token = jwt.sign({ _id: foundUser._id }, secret, { expiresIn: "15m" });
        console.log("Generated Token:", token); // Debugging

        const url = `http://localhost:5173/resetpassword/${token}`;
        const mailContent = `<html>
                                <a href="${url}">Reset Password</a>
                             </html>`;
        
        await mailUtil.sendingMail(foundUser.email, "Reset Password", mailContent);

        res.json({
            message: "Reset password link sent to your email.",
            token: token  // ✅ Sending token in response
        });
    } else {
        res.status(404).json({
            message: "User not found. Please register first.",
        });
    }
};
  
  const resetpassword = async (req, res) => {
    const token = req.body.token; //decode --> email | id
    const newPassword = req.body.password;
  
    const userFromToken = jwt.verify(token, secret);
    //object -->email,id..
    //password encrypt...
    const salt = bcrypt.genSaltSync(10);
    const hashedPasseord = bcrypt.hashSync(newPassword,salt);
  
    const updatedUser = await userModel.findByIdAndUpdate(userFromToken._id, {
      password: hashedPasseord,
    });
    res.json({
      message: "password updated successfully..",
    });
  };
  
//   const getUserProfile = async (req, res) => {
//     try {
//         const foundUser = await userModel.findById(req.params.id).select(
//             "fullName email profilePic bio location socialLinks"
//         );

//         if (!foundUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.json({
//             message: "Profile fetched successfully",
//             data: foundUser,
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: "Error fetching profile",
//             error: err,
//         });
//     }
// };

// ================= Profile Controller =================
const updateUserProfile = async (req, res) => {
    try {
        const { fullName, bio, socialLinks } = req.body;
        let updatedFields = { fullName, bio, socialLinks };
        if (req.file) {
            const cloundinaryResponse = await uploadFileToCloudinary(req.file);
            updatedFields.profilePic = cloundinaryResponse.secure_url;
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );
        res.json({ message: "Profile updated successfully", data: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err });
    }
};

const getUserProfile = async (req, res) => {
    console.log("User ID received:", req.params.id || req.body.id);
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update UserController.js
// const uploadProfilePic = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//         cloudinary.uploader.upload_stream({ resource_type: "image", folder: "profile_pictures" },
//             async (error, result) => {
//                 if (error) {
//                     console.error("Cloudinary Upload Error:", error);
//                     return res.status(500).json({ error: "Cloudinary upload failed" });
//                 }

//                 // Update user profile with Cloudinary image URL
//                 const updatedUser = await User.findByIdAndUpdate(
//                     req.params.userId,
//                     { profilePicture: result.secure_url },
//                     { new: true }
//                 );

//                 if (!updatedUser) {
//                     return res.status(404).json({ error: "User not found" });
//                 }

//                 res.status(200).json({ profilePicture: updatedUser.profilePicture });
//             }
//         ).end(req.file.buffer); // Send file buffer to Cloudinary

//     } catch (error) {
//         console.error("Profile picture upload error:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };

/* main uploadprofilepic ↓*/ 

// const uploadProfilePic = async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             console.error("Multer Error:", err);
//             return res.status(400).json({ message: err.message });
//         }

//         console.log("File received:", req.file);
//         console.log("Request body:", req.body);

//         if (!req.file) {
//             return res.status(400).json({ message: "No image file provided" });
//         }

//         const userId = req.body.userId; // Ensure userId is sent in request

//         if (!userId || userId.length !== 24) { // ObjectId is 24 characters
//             return res.status(400).json({ message: "Invalid userId format" });
//         }

//         try {
//             const cloudinaryResponse = await CloudinaryUtil.uploadFileToCloudinary(req.file.path);
//             console.log("Cloudinary response:", cloudinaryResponse);

//             if (!cloudinaryResponse.secure_url) {
//                 throw new Error("Cloudinary upload failed");
//             }

//             const imageUrl = cloudinaryResponse.secure_url;

//             const user = await userModel.findById(userId);
//             if (!user) {
//                 console.error("User not found");
//                 return res.status(404).json({ message: "User not found" });
//             }

//             user.profilePicture = imageUrl;
//             await user.save();

//             res.status(200).json({
//                 message: "Profile picture uploaded successfully",
//                 profilePicture: imageUrl,
//             });
//         } catch (error) {
//             console.error("Upload failed:", error);
//             res.status(500).json({ message: "Server error: " + error.message });
//         }
//     });
// };


// const getUserById = async (req, res) => {
//     const foundUser = await userModel.findById(req.params.id);
//     res.json({
//       message: "user fetched successfully..",
//       data: foundUser,
//     });
//   };  

const uploadProfilePic = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
  
      const userId = req.params.userId;
      const normalizedPath = path.resolve(req.file.path); // Normalize path for Windows
  
      try {
        // ✅ Upload to Cloudinary
        const cloudinaryResponse = await CloudinaryUtil.uploadFileToCloudinary(req.file);
  
        if (!cloudinaryResponse.secure_url) {
          throw new Error("Cloudinary upload failed");
        }
  
        // ✅ Save URL to user's profilePicture
        const user = await userModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        user.profilePic = cloudinaryResponse.secure_url;
        await user.save();
  
        // ✅ Optional: Delete local file
        fs.unlinkSync(normalizedPath);
  
        // ✅ Send response back
        res.status(200).json({
          message: "Profile picture uploaded successfully",
          profilePicture: cloudinaryResponse.secure_url,
        });
      } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ message: "Server error: " + error.message });
      }
    });
  };
  
// const getUserById = async (req, res) => {
//     console.log("User ID received:", req.params.id || req.body.id); // Debugging

//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid user ID format" });
//         }

//         const foundUser = await userModel.findById(id);
//         if (!foundUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.json({ message: "User fetched successfully", data: foundUser });
//     } catch (error) {
//         console.error("Error fetching user:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

const getUserById = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        data: {
          _id: user._id,
          fullName: user.fullName,
          userName: user.userName,
          profilePicture: user.profilePic || "", // ✅ this is important
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error: " + error.message });
    }
};
  
const updateUserById = async (req, res) => {
    console.log("User ID received:", req.params.id || req.body.id);
    try {
        const { userName, fullName, age } = req.body;
        const { id } = req.params;

        // Check if the userName already exists (excluding the current user)
        const existingUser = await userModel.findOne({ userName, _id: { $ne: id } });

        if (existingUser) {
            return res.status(400).json({ message: "User ID already exists" });
        }

        // Proceed with updating the user profile
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { userName, fullName, age },
            { new: true }
        );

        res.json({ message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

  const checkUserNameExists = async (req, res) => {
    try {
        const { userName } = req.params;
        const existingUser = await userModel.findOne({ userName });

        if (existingUser) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking username:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const searchUsers = async (req, res) => {
    try {
        console.log("Received search request with query:", req.query.query);

        const query = req.query.query;

        if (!query || query.trim().length < 2) {
            console.log("Invalid search query:", query);
            return res.status(400).json({ error: "Search query must be at least 2 characters long." });
        }

        // Ensure the query is NOT treated as an ObjectId
        if (mongoose.Types.ObjectId.isValid(query)) {
            console.log("Query looks like an ObjectId, skipping _id search:", query);
        }

        // Perform a case-insensitive search using regex
        const users = await userModel.find({
            $or: [
                { fullName: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } }
            ]
        });

        console.log("Users found:", users.length);
        return res.status(200).json(users);
    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUserStats = async (req, res) => {
    console.log("User ID received:", req.params.id || req.body.id);
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await userModel.findById(userId);  // ✅ Fix: Changed User to userModel
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const stats = {
            posts: user.posts?.length || 0,
            followers: user.followers?.length || 0,
            following: user.following?.length || 0,
        };

        res.json(stats);
    } catch (error) {
        console.error("❌ Error fetching user stats:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from params
        const user = await userModel.findById(userId); // Fetch user details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user has posts (Modify this if posts are stored elsewhere)
        if (!user.posts || user.posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        res.json(user.posts); // Return only posts
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const followUser = async (req, res) => {
    try {
        const { followerId, followingId } = req.body;
        if (!followerId || !followingId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const follower = await userModel.findById(followerId);
        const following = await userModel.findById(followingId);

        if (!follower || !following) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!follower.following) follower.following = [];
        if (!following.followers) following.followers = [];

        // Add the IDs to respective arrays
        follower.following.push(followingId);
        following.followers.push(followerId);

        await follower.save();
        await following.save();

        res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}; 
  // Get following list
 const getFollowing = async (req, res) => {
    try {
        const { id } = req.params; // Extract user ID from URL params

        // Ensure valid user ID is provided
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the user and populate the following list
        const user = await UserModel.findById(id).populate("following", "fullName userName profilePic");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the list of followed users
        res.status(200).json({ following: user.following });
    } catch (error) {
        console.error("Error fetching following list:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const unfollowUser = async (req, res) => {
    try {
      const { followerId, followingId } = req.body;
      await userModel.findByIdAndUpdate(followerId, { $pull: { following: followingId } });
      await userModel.findByIdAndUpdate(followingId, { $pull: { followers: followerId } });
      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      console.error("Unfollow Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const getFollowers = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).populate("followers", "userName fullName profilePicture");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ followers: user.followers });
    } catch (error) {
        res.status(500).json({ error: "Error fetching followers" });
    }
};

const getTotalUsers = async (req, res) => {
    try {
      const totalUsers = await UserModel.countDocuments();
      res.json({ total: totalUsers });
    } catch (err) {
      console.error("Error counting users:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
module.exports = {
    addUser,getTotalUsers,
    getAllUsers,
    getUserById,
    deleteUserById,
    signup,
    loginUser,
    updateUserProfile,
    forgotPassword,
    resetpassword,
    getUserProfile,
    uploadProfilePic,
    updateUserById,
    checkUserNameExists,
    searchUsers, 
    getUserStats, unfollowUser,getFollowers,
    getUserPosts, followUser, getFollowing
};