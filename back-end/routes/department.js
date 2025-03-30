import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adddepartment, getdepartment, editDepartment, deleteDepartment } from "../controllers/departmentcontroller.js";

const router = express.Router();
router.post("/create", authMiddleware, adddepartment);
router.get("/", authMiddleware, getdepartment);
router.get("/:id", authMiddleware, editDepartment);
router.put("/:id", authMiddleware, editDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);
export default router;