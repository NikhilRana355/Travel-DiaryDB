const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const diarySchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
    },
    title:{
        type:String,
        required:true,
    },
    countryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"country",
        // required:true,
    },
    // country:{
    //     type: String,
    //     required: true,
    // },
    stateId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"State",
    },
    cityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"City",
    },
    description:{
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
    imageURL:{
        type:String,
        required:true,
    },
    likes:[{ 
        type: [String], 
        ref: 'users',
        default: [] 
    }],
},{
    timestamps:true
})
module.exports = mongoose.model('diary',diarySchema);