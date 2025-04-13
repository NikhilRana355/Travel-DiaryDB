const routes = require("express").Router()
const multer = require("multer");
// const { followUser, getFollowing } = require("../controllers/UserController");

const userController = require("../controller/UserController");
const UserModel = require("../models/UserModel");
routes.get("/users",userController.getAllUsers)
routes.post("/user",userController.signup)
// routes.get("/user/:id",userController.getUserById)
routes.delete("/user/:id",userController.deleteUserById)
routes.post("/user/login",userController.loginUser)
// routes.get("/user/profile/:id", userController.getUserProfile);
// routes.put("/user/profile/update/:id", userController.updateUserProfile);
routes.post("/user/forgotpassword",userController.forgotPassword)
routes.post("/user/resetpassword",userController.resetpassword)

// ================= Profile Routes =================
routes.get("/user/profile/:id", userController.getUserProfile);
routes.put("/user/profile/update/:id", userController.updateUserProfile);
// routes.put("/user/profile/pic/:id", userController.uploadProfilePic);

routes.get("/user/:id", userController.getUserById);
// routes.get("/:userId", userController.getUserById)
routes.put("/user/:id", userController.updateUserById);

// routes.get("/user/check-username/:userName", userController.checkUserNameExists);
// routes.get("/users/search/:query", userController.searchUsers);

// ✅ Configure Multer for Profile Picture Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images in `uploads/` folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// ✅ Route: Get user stats (Posts, Followers, Following)
routes.get("/user/stats/:id", userController.getUserStats);
routes.put("/user/:userId/uploadProfilePic", userController.uploadProfilePic);

routes.get("/user/check-username/:userName", userController.checkUserNameExists);
routes.get("/users/search", userController.searchUsers);
routes.get("/user/posts/:id", userController.getUserPosts);

routes.post("/user/follow", userController.followUser);
routes.post("/user/unfollow", userController.unfollowUser);
routes.get("/user/following/:id",userController.getFollowing);
routes.get("/user/followers/:id", userController.getFollowers);

// routes.put("/user/toggleLike/:id", userController.toggleLike);
// routes.get("/user/isLiked/:id",  userController.isPostLiked);
 // routes/userRoutes.js or adminRoutes.js

 routes.get("/users/total", userController.getTotalUsers);

// ❗️ THIS COMES AFTER
routes.get('/user/id/:id', userController.getUserById);

routes.put("/user/soft-delete/:id", userController.softDeleteUser);


  

module.exports = routes