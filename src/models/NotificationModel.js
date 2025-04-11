const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    recipient:{ 
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required:true 
    },
    sender:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    type:{ 
        type: String, 
        enum: ['follow'], 
        required: true 
    },
    message:{
        type: String,
        required: true,
    },
    isRead:{ 
        type: Boolean, 
        default: false 
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },
    type:{
        type: String,
        enum: ['follow','like','comment'],
        required: true,
    }
})

module.exports = mongoose.model("Notification",notificationSchema)