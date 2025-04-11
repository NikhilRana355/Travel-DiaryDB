const routes = require('express').Router();
const CommentController = require('../controller/CommentController')
routes.post('/',CommentController.createComment);
routes.get("/:diaryId",CommentController.getCommentsByDiary);
routes.delete('/:id',CommentController.deleteComment);

module.exports = routes;