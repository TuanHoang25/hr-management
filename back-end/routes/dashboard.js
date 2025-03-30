import express from "express";
import { getDashboardStatistics } from "../controllers/dashboardcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/statistics", authMiddleware, getDashboardStatistics);

export default router; 