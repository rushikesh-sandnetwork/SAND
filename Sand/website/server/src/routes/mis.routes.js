import { Router } from "express";
const router = Router();
import upload from "../middlewares/multer.middleware";
import { fetchMisCampaigns } from '../controllers/mis.controller';

router.route("/fetchMisCampaigns").post(fetchMisCampaigns);

export default router;
