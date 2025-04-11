const routes = require('express').Router();
const itinerariesController = require("../controller/ItinerariesController");
routes.post("/addItineraries",itinerariesController.addItineraries);
routes.get("/getItineraries",itinerariesController.getItineraries);
module.exports= routes;