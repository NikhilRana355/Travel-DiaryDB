
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminmodrationSchema = new Schema({
   reportId :{
    type:Object,
    required: true,
    unique: true
   },
   reportedby:{
    type:Object,
    required: true,
   },
   reportedContent:{
    type: Object,
    required: true,
   },
   status:{
    type:String,
    required:true,
   },
   reviewedby:{
    type:Object,
    required:true,
   }
},{
    timestamps:true
})
module.exports = mongoose.model('admin',adminmodrationSchema);