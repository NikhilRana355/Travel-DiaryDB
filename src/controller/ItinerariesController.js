const ItinerariesModel = require("../models/ItinerariesModel");

// const itinerariesModel = require("../models/ItinerariesModel");

const addItineraries = async (req,res) => {
    try{
        const savedItineraries = await ItinerariesModel.create(req.body);
        res.status(201).json({
            message:"Itineraries added succesfully",
            data : savedItineraries,
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

const getItineraries = async(req,res) => {
    try{
        const itineraries = await ItinerariesModel.find();
        res.status(200).json({
            message: "All itineraries fetched succesfully",
            data: itineraries
        })
    }catch(err){
        res.status(500).json({
            message:err
        })

    }
}

// ✅ GET /itin/user/:userId
const getUserItineraries = async (req, res) => {
    try {
      const itineraries = await ItinerariesModel.find({ userId: req.params.userId });
      res.status(200).json(itineraries);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
module.exports = {
    addItineraries,
    getItineraries,
    getUserItineraries,
}