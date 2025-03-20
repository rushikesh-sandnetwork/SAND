import { Router } from "express";
const router = Router();
import upload from "../middlewares/multer.middleware";
import { fetchManagerClients } from '../controllers/manager.controller';

router.route("/fetchManagerClients").post(fetchManagerClients);

export default router;
