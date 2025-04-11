const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      diaryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "diary",
        required: true,
      },
    }, { timestamps: true 

});

likeSchema.index({ userId: 1, diaryId: 1 }, { unique: true });

module.exports = mongoose.model('Like',likeSchema);