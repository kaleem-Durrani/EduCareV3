import express from "express";
import {
  createMonthlyPlan,
  getMonthlyPlan,
  updateMonthlyPlan,
  deleteMonthlyPlan,
  listMonthlyPlans,
} from "../controllers/plan.controller.js";
import { authenticate, requireAdminOrTeacher } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/plans/monthly", authenticate, requireAdminOrTeacher, createMonthlyPlan);
router.get("/plans/monthly/:class_id", authenticate, requireAdminOrTeacher, getMonthlyPlan);
router.put("/plans/monthly/:plan_id", authenticate, requireAdminOrTeacher, updateMonthlyPlan);
router.delete("/plans/monthly/:plan_id", authenticate, requireAdminOrTeacher, deleteMonthlyPlan);
router.get("/plans/monthly/:class_id/list", authenticate, requireAdminOrTeacher, listMonthlyPlans);

export default router;
