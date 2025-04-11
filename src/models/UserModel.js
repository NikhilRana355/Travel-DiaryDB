const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName:{
        type:String,
        required: true,
    },
    userName:{
        type:String,
        unique: true
    },
    roleId:{
        type:Schema.Types.ObjectId,
        ref:"roles"
    },
    email:{
        type:String,
        unique:true,
        required: true,
    },
    password:{
        type:String,
        required: true,
    
    },  
    profilePic:{ 
         type:String, 
         default: "" 
    }, 
    bio: {
        type: String,
        default: "",
    },
    socialLinks: {
        type: [String],
        default: [],
    },
    age :{
        type: Number
    }, 
    followers:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users"  
    }],
    following: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users" 
    }],
     posts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post" 
    }],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users' 
    }]
})

module.exports = mongoose.model("users",userSchema)