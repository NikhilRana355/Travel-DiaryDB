const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const itinerariesSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
    },
    tripName:{
        type:String,
        required:true,
    },
    destination:{
        type:String,
        required:true,
    },
    startDate:{
        type:String,
        required:true,
    },
    endDate:{
        type:String,
        required:true,
    },
    note:{
        type:String,
        required:true,
    },
})
module.exports = mongoose.model("itin",itinerariesSchema);