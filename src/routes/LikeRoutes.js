const routes = require("express").Router()
const LikeController = require("../controller/LikeController")
routes.put("/togglelike/:id",LikeController.toggleLike)
routes.get("/getlikeStatus/:id",LikeController.getLikeStatus)
module.exports = routes;

