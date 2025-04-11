const AdminModerationModel = require("../models/AdminModerationModel");

const addAdminModeration = async (req,res) => {
    try{
        const savedAdminModeration = await AdminModerationModel.create(req.body);
        res.status(201).json({
            message:"Itineraries added succesfully",
            data : savedAdminModeration,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

const getAdminModeration = async(req,res) => {
    try{
        const itineraries = await AdminModerationModel.find();
        res.status(200).json({
            message: "All Admin Moderation fetched succesfully",
            data: AdminModerationModel
        })
    }catch(err){
        res.status(500).json({
            message:err
        })

    }
}
module.exports = {
    addAdminModeration,
    getAdminModeration,
}