const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
    stateId:{
        type:Schema.Types.ObjectId,
        ref:"State",
    },
    name:{
        type: String,
        required: true,
        unique: true
    },
},{
    timestamps: true
})
module.exports = mongoose.model('City', citySchema);