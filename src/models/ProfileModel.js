const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  // userId:{
  //   type:mongoose.Schema.Types.ObjectId, 
  //   ref:'User',
  //   required:true, 
  //   unique: true 
  // },
  fullName:{ 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref:"users"
  },
  email:{ 
    type:String, 
    required: true, 
    unique: true 
  },
  bio:{ 
    type:String, 
    default: '' 
  },
  profilePicture:{ 
    type: String, 
    default: '' 
  }
});

module.exports = mongoose.model("Profile", ProfileSchema);
