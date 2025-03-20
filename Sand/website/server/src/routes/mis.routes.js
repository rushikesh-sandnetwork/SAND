const { Router } = require("express");
const router = Router();
const upload = require("../middlewares/multer.middleware");
const misController = require('../controllers/mis.controller');

router.route("/fetchMisCampaigns").post(misController.fetchMisCampaigns);

module.exports = router;
