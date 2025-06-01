import express from "express";
import {
  createMonthlyPlan,
  getMonthlyPlan,
  updateMonthlyPlan,
  deleteMonthlyPlan,
  listMonthlyPlans,
} from "../controllers/plan.controller.js";
import {
  authenticate,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";
import { uploadMonthlyPlans } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/plans/monthly",
  authenticate,
  requireAdminOrTeacher,
  uploadMonthlyPlans.single("image"),
  createMonthlyPlan
);
router.get(
  "/plans/monthly/:class_id",
  authenticate,
  requireAdminOrTeacher,
  getMonthlyPlan
);
router.put(
  "/plans/monthly/:plan_id",
  authenticate,
  requireAdminOrTeacher,
  uploadMonthlyPlans.single("image"),
  updateMonthlyPlan
);
router.delete(
  "/plans/monthly/:plan_id",
  authenticate,
  requireAdminOrTeacher,
  deleteMonthlyPlan
);
router.get(
  "/plans/monthly/:class_id/list",
  authenticate,
  requireAdminOrTeacher,
  listMonthlyPlans
);

export default router;
