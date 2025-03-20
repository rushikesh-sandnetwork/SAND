import { Router } from "express";
import { fetchAttendance, fetchPromoterForms, fetchFormFilledData, fillFormData, fetchPromoterAttendanceDetails, fillAttendancePunchIn, fillAttendancePunchOut, fetchPromoterDetails, promoterLogin, fetchFormField, fetchAllPromoters, createNewPromoter } from "../controllers/promoter.controller.js";
const router = Router();
import { any, fields } from "../middlewares/multer.middleware";

router.route("/fetchAttendance").post(fetchAttendance);
router.route("/fetchAllForms").post(fetchPromoterForms);

router
  .route("/fetchFormFilledData")
  .post(fetchFormFilledData);
router.post(
  "/fillFormData/:collectionName",
  any(),
  fillFormData
);

//Done
router
  .route("/fetchPromoterAttendanceDetails")
  .post(fetchPromoterAttendanceDetails);
router.route("/fillAttendancePunchIn").post(
  fields([
    {
      name: "loginPhoto",
      maxCount: 1,
    },
  ]),
  fillAttendancePunchIn
);
router.route("/fillAttendancePunchOut").post(
  fields([
    {
      name: "logOutPhoto",
      maxCount: 1,
    },
  ]),
  fillAttendancePunchOut
);
router
  .route("/fetchPromoterDetails")
  .post(fetchPromoterDetails);
router.route("/loginPromoter").post(promoterLogin);
router.route("/fetchFormField").post(fetchFormField);
router.route("/fetchPromoters").get(fetchAllPromoters);

router.route("/registerNewPromoter").post(createNewPromoter);
export default router;
