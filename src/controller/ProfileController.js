const Profile = require("../models/ProfileModel");
const User = require("../models/UserModel"); // ✅ Import User Model
const { cloudinary } = require("../utils/Cloudnary");

const getProfileByUserId = async (req, res) => {
    const foundProfile = await Profile.findOne({ userId: req.params.id }).populate("userId", "fullName email profilePicture");
    if (!foundProfile) {
        return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile fetched successfully", data: foundProfile });
};

const updateProfile = async (req, res) => {
    try {
        const { bio } = req.body;
        let profilePicture = req.body.profilePicture;

        // ✅ Upload to Cloudinary only if a new file is provided
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, { folder: "profile_pictures" });
            profilePicture = uploadedImage.secure_url;
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: req.params.id },
            { bio, profilePicture },
            { new: true, upsert: true }
        );

        res.json({ message: "Profile updated successfully", data: updatedProfile });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err });
    }
};

module.exports = {
    getProfileByUserId,
    updateProfile
};
