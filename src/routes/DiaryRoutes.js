const routes = require('express').Router();
const diaryController = require("../controller/DiaryController");
const DiaryModel = require('../models/DiaryModel');
routes.post("/addDiary",diaryController.addDiary);
routes.get("/getAllDiary",diaryController.getAllDiary);
routes.get("/getdiarybyuserid/:userId",diaryController.getAllDiaryByUserId),
routes.post('/addWithFile',diaryController.addDiaryWithFile);
routes.put("/updateDiary/:id",diaryController.updateDiary);
routes.get("/getDiaryById",diaryController.getDiaryById);
routes.post("/likePost",diaryController.likePost)
routes.post("/create", diaryController.createDiary);

routes.get("/user/:userId", diaryController.getUserDiaries);


routes.get('/diary/total', async (req, res) => {
  try {
    const totalDiaries = await DiaryModel.countDocuments();
    res.json({ totalDiaries });
  } catch (err) {
    console.error("Diary total error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

routes.get('/alldiaries', async (req, res) => {
  try {
    const diaries = await DiaryModel.find(); // make sure Diary model is imported
    res.json(diaries);
  } catch (error) {
    console.error("Error fetching all diaries:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.delete('/:id', async (req, res) => {
  try {
    const deleted = await DiaryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Diary not found" });
    }
    res.status(200).json({ message: "Diary deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

routes.delete("/deleteDiary/:id", diaryController.deleteDiary);

module.exports = routes;