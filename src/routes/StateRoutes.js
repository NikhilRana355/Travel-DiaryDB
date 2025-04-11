const routes = require('express').Router();
const stateController = require('../controller/StateController');
routes.post("/addstate", stateController.addState);
routes.get("/getallstates", stateController.getAllStates);
routes.get("/getstatebycountry/:countryId",stateController.getStateByCountryId)
module.exports = routes; 