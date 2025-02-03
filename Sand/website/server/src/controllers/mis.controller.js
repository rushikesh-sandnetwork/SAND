// import { Router } from "express";
// import userController from "../controllers/users.controller.js";
// import apiResponse from "../utils/apiResponse.js";
// import apiError from "../utils/apiError.js";
// import uploadOnCloudinary from "../utils/cloudinary.js";
// import mongoose from "mongoose";
// import client from "../models/client.model.js";
// import campaign from "../models/campaign.model.js";
// import Promoter from "../models/promoter.model.js";
// import campaignRights from "../models/campaignsRightSchema.model.js";
// import FormFieldSchema from "../models/forms.fields.model.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import formsFieldsModel from "../models/forms.fields.model.js";
// import User from "../models/user.model.js";

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

const acceptRejectData = asyncHandler(async (req, res) => {
    const { formId, userId, collectionName, status } = req.body;

    // Input validation
    if (!formId || !userId || !status || !collectionName) {
        return res.status(400).json(new apiError(400, "Missing required data fields."));
    }

    try {
        const DynamicModel = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);

        const result = await DynamicModel.updateOne({ formId, userId }, { $set: { status } });

        if (result.nModified === 0) {
            return res.status(404).json(new apiError(404, "No matching document found to update"));
        }

        res.status(200).json(new apiResponse(200, result, "Status updated successfully"));
    } catch (error) {
        console.error('Error in acceptRejectData:', error);
        res.status(400).json(new apiError(400, "Error updating the status of data."));
    }
});


const fetchDataByStatus = asyncHandler(async (req, res, status) => {
    const { collectionName } = req.body;

    // Input validation
    if (!collectionName) {
        return res.status(400).json(new apiError(400, "Collection Name is required."));
    }

    try {
        const DynamicModel = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);

        if (!DynamicModel) {
            throw new apiResponse(404, "No model was found.");
        }

        const data = await DynamicModel.find({ status });

        res.status(200).json(new apiResponse(200, data, `${status ? 'Accepted' : 'Rejected'} Data fetched successfully.`));
    } catch (error) {
        console.error(`Error in fetch${status ? 'Accepted' : 'Rejected'}Data:`, error);
        res.status(400).json(new apiError(400, `Error fetching ${status ? 'Accepted' : 'Rejected'} data.`));
    }
});


const fetchAcceptedData = asyncHandler(async (req, res) => {
    await fetchDataByStatus(req, res, true);
});


const fetchRejectedData = asyncHandler(async (req, res) => {
    await fetchDataByStatus(req, res, false);
});


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

        res.status(200).json(new apiResponse(200, "Fetched campaigns successfully.", misCampaigns));
    } catch (error) {
        console.error(`Error in fetching campaigns`, error);
        res.status(400).json(new apiError(400, `Error fetching campaigns.`));
    }
});


module.exports = {
    acceptRejectData,
    fetchAcceptedData,
    fetchRejectedData,
    fetchMisCampaigns
};
