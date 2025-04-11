const countryModel = require("../models/CountryModel");

const addCountry = async (req,res) => {
    try{
        const savedCountry = await countryModel.create(req.body);
        res.status(201).json({
            message: "Country added successfully",
            data: savedCountry,
        });
    } catch(err){
        res.status(500).json({
            message: err,
        });
    }
};

const getAllCountry = async (req, res) => {
    try{
        const country = await countryModel.find();
        res.status(200).json({
            message:"All county fetched successfully",
            data: country
        })
    } catch(err) {
        res.status(500).json({
            message:err
        })
    }
}
module.exports = {
    addCountry,
    getAllCountry,
}