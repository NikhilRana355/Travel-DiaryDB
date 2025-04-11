const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    diaryId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'diary', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },  

})

module.exports = mongoose.model('Comment',commentSchema)