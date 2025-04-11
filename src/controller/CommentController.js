const CommentModel = require("../models/CommentModel");
// const commentModel = require("../models/CommentModel")

// Create a comment
const createComment = async (req, res) => {
  try {
    const { diaryId, userId, content } = req.body;
    const comment = new CommentModel({ diaryId, userId, content });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Could not create comment' });
  }
};

// Get comments for a diary
const getCommentsByDiary = async (req, res) => {
  try {
    const comments = await CommentModel.find({ diaryId: req.params.diaryId })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName userName profilePic');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch comments' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete comment' });
  }
};


module.exports = {
    deleteComment, 
    getCommentsByDiary,
    createComment,
}