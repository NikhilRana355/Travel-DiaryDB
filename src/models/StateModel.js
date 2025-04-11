const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    countryId:{
        type: Schema.Types.ObjectId,
        ref:"country"

    },
    name:{
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true
})
module.exports = mongoose.model('State', stateSchema);