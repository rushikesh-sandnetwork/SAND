
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




const fetchManagerClients = asyncHandler(async (req, res) => {
    try {
        const { managerId } = req.body;

        if (!managerId) {
            return res.status(404).json(new apiResponse(404, "No manager was found."));
        }

        const managerDoc = await User.findById(managerId);

        if (!managerDoc) {
            return res.status(404).json(new apiResponse(404, "No manager was found."));
        }

        // Fetch campaign details using campaign IDs
        const managerClients = await client.find({ _id: { $in: managerDoc.listOfClients } });

        res.status(200).json(new apiResponse(200, managerClients,"Fetched clients successfully."));
    } catch (error) {
        console.error(`Error in fetching clients`, error);
        res.status(400).json(new apiError(400, `Error fetching clients.`));
    }
});


module.exports = {
    fetchManagerClients
};