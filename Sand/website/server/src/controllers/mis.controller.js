
const { Router } = require("express");
const userController = require("../controllers/users.controller");
const router = Router();
const apiResponse = require("../utils/apiResponse");
const apiError = require("../utils/apiError");
const uploadOnCloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const client = require("../models/client.model");
const campaign = require("../models/campaign.model");
const Promoter = require("../models/promoter.model");
const campaignRights = require("../models/campaignsRightSchema.model");
const FormFieldSchema = require("../models/forms.fields.model");
const asyncHandler = require("../utils/asyncHandler");
const formsFieldsModel = require("../models/forms.fields.model");
const User = require("../models/user.model");




const fetchMisCampaigns = asyncHandler(async (req, res) => {
    try {
        const { misId } = req.body;

        if (!misId) {
            return res.status(404).json(new apiResponse(404, "No mis was found."));
        }

        const misDoc = await User.findById(misId);

        if (!misDoc) {
            return res.status(404).json(new apiResponse(404, "No mis was found."));
        }

        // Fetch campaign details using campaign IDs
        const misCampaigns = await campaign.find({ _id: { $in: misDoc.listOfCampaigns } });

        res.status(200).json(new apiResponse(200, misCampaigns,"Fetched campaigns successfully."));
    } catch (error) {
        console.error(`Error in fetching campaigns`, error);
        res.status(400).json(new apiError(400, `Error fetching campaigns.`));
    }
});


module.exports = {
    fetchMisCampaigns
};