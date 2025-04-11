const routes = require("express").Router();
const profileController = require("../controller/ProfileController");
const { upload } = require("../utils/Cloudnary");

// ✅ Get user profile
routes.get("/profiles/:id", profileController.getProfileByUserId);

// ✅ Fix: Handle Multer properly to avoid errors
routes.put("/profile/update/:id", (req, res, next) => {
    upload.single("profilePicture")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "Image upload failed", error: err.message });
        }
        next();
    });
}, profileController.updateProfile);

module.exports = routes;
