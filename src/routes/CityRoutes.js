const routes = require('express').Router();
const cityController = require('../controller/CityController');
routes.post("/addcity", cityController.addCity);    
routes.get("/getallcities", cityController.getCities);
routes.get("/getcitybystateid/:stateId",cityController.getCityByStateId)
module.exports = routes;