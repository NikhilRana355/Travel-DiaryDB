const cloundinary = require("cloudinary").v2;


const uploadFileToCloudinary = async (file) => {

    //conif
        cloundinary.config({
        cloud_name:"dvtqsq650",
        api_key:"429372563795866",
        api_secret:"vci17Dt8a3iWfV2ER7ZfcN2n51c"
    })

    const cloundinaryResponse = await cloundinary.uploader.upload(file.path, {
        folder: "user-profile-pics",
    });
    return cloundinaryResponse;



};
module.exports = {
    uploadFileToCloudinary
}