const routes = require("express").Router();
const countryController = require('../controller/CountryController');
routes.post("/addCountry",countryController.addCountry);
routes.get("/getCountry",countryController.getAllCountry);
module.exports = routes;