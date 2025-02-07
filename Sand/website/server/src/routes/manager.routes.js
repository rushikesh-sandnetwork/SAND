const { Router } = require("express");
const router = Router();
const upload = require("../middlewares/multer.middleware");
const managerController = require('../controllers/manager.controller');

router.route("/fetchManagerClients").post(managerController.fetchManagerClients);

module.exports = router;
