const routes = require('express').Router();
const itinerariesController = require("../controller/ItinerariesController");
const ItinerariesModel = require('../models/ItinerariesModel');
routes.post("/addItineraries",itinerariesController.addItineraries);
routes.get("/getItineraries",itinerariesController.getItineraries);

// routes/itineraryRoutes.js or adminRoutes.js
routes.get('/itinerary/total', async (req, res) => {
  try {
    const totalItineraries = await ItinerariesModel.countDocuments();
    res.json({ total: totalItineraries });
  } catch (err) {
    console.error("Itinerary total error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
  
module.exports= routes;