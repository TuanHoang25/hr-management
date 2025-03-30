import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addEmployee, editEmployee, getEmployee, getEmployeeProfile, getUser, upload } from "../controllers/employeecontroller.js"
const router = express.Router();

router.get("/", authMiddleware, getEmployee);
router.get("/user", authMiddleware, getUser);
router.get("/:id", authMiddleware, getEmployeeProfile);
router.post("/create", authMiddleware, upload.single('image'), addEmployee);
router.get("/:id", authMiddleware, editEmployee);
router.put("/:id", authMiddleware, editEmployee);
export default router;