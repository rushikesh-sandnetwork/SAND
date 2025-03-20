import { Router } from "express";
const router = Router();
import { fields } from "../middlewares/multer.middleware.js";
import { createNestedForm, acceptRejectData, createNewClient, deleteClient, deleteCampaign, fetchClient, fetchAllClients, fetchAllClientSpecificCampaigns, fetchAllCampaigns, fetchCampaignDetails, createNewCampaign, createNewForm, assignCreatedForm, unassignCreatedForm, updateUserRights, fetchUserRights, fetchData, fetchNumberOfClientsAndCampaigns, fetchFormsForCampaigns, fetchNestedForms , assignCampaignToMis, unassignCampaignToMis, assignClientToManager, unassignClientToManager, fetchUsersByRole } from '../controllers/admins.controller.js';
// import { fetchNestedForms } from '../controllers/admins.controller';


router.route("/createNestedForm").post(createNestedForm);
router.route("/updateAcceptedData").patch(acceptRejectData);

// Done----------
// create new client 
router.route("/createNewClient").post(
    fields([
        {
            name: "clientPhoto",
            maxCount: 1
        }
    ])
    , createNewClient);


// delete new client
router.route("/deleteClient").delete(deleteClient);

// delete campaign
router.route("/deleteCampaign").delete(deleteCampaign);

// fetchClient
router.route("/fetchClient").post(fetchClient);

// fetch all client 
router.route("/fetchAllClient").get(fetchAllClients);


// fetch all client specific campaigns
router.route("/fetchAllCampaigns").post(fetchAllClientSpecificCampaigns);

// fetch last 4 campaigns
router.route("/fetchLastCampaigns").get(fetchAllCampaigns);


// fetch campaign details
router.route("/fetchCampaignDetails").post(fetchCampaignDetails);


// create new campaign
router.route("/createNewCampaign").post(
    fields([
        {
            name: "campaignPhoto",
            maxCount: 1
        }
    ]),
    createNewCampaign);


// create new form
router.route("/createNewForm").post(createNewForm)

// assignCreatedForm
router.route("/assignCreatedForms").post(assignCreatedForm);


// unassignCreatedForm
router.route("/unassignCreatedForms").post(unassignCreatedForm);


// update user rights
router.route("/updateUserRights").post(updateUserRights);

// fetch User Rights
router.route("/fetchUserRight").post(fetchUserRights);

// fetch data from the form 
router.route("/fetchDataFromCollection").post(fetchData)

// fetch number of clients and campaigns
router.route("/fetchNumberOfClientsAndCampaigns").get(fetchNumberOfClientsAndCampaigns);

// fetch forms
router.route("/fetchFormsForGivenClient").post(fetchFormsForCampaigns);

//fetch nested forms
router.route("/fetchnestedforms").post(fetchNestedForms);

//assign campaign to MIS and Manager
router.route("/assignCampaignToMis").post(assignCampaignToMis);

router.route("/unassignCampaignToMis").post(unassignCampaignToMis);
router.route("/assignClientToManager").post(assignClientToManager);

router.route("/unassignClientToManager").post(unassignClientToManager);

router.route("/fetchUsersByRole").post(fetchUsersByRole);

export default router;