const routes = require('express').Router();
const diaryController = require("../controller/DiaryController");
routes.post("/addDiary",diaryController.addDiary);
routes.get("/getAllDiary",diaryController.getAllDiary);
routes.get("/getdiarybyuserid/:userId",diaryController.getAllDiaryByUserId),
routes.post('/addWithFile',diaryController.addDiaryWithFile);
routes.put("/updateDiary/:id",diaryController.updateDiary);
routes.get("/getDiaryById",diaryController.getDiaryById);
routes.post("/likePost",diaryController.likePost)
module.exports = routes;