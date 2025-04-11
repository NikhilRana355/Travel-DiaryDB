const routes = require('express').Router();
const AdminModerationController = require('../controller/AdminModerationController');
routes.post("/addAdminModeration", AdminModerationController.addAdminModeration);    
routes.get("/getAdminModeration", AdminModerationController.getAdminModeration);
module.exports = routes;