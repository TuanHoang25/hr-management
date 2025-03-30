
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { approveLeaveRequest, createLeaveRequest, getLeaveRequests, upload } from "../controllers/leavecontroller.js";

const router = express.Router();
router.post('/create', authMiddleware, upload.single('proof'), createLeaveRequest);
router.get('/:id', authMiddleware, getLeaveRequests);
router.post('/leaveStatus', authMiddleware, approveLeaveRequest);
export default router;