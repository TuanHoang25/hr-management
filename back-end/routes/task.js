import express from "express";
import {
    createTask,
    updateTask,
    getTasks,
    getMyTasks,
    submitTask,
    checkDeadline,
    upload
} from "../controllers/taskcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
// Admin Routes
// Route to create a task
router.post("/tasks", authMiddleware, upload.array("attachments"), createTask);

// Route to update a task
router.put("/tasks/:id", authMiddleware, updateTask);

// Route to get tasks with optional filters
router.get("/tasks", authMiddleware, getTasks);

// Employee Routes

// Route to get tasks assigned to the logged-in employee
router.get("/mytasks", authMiddleware, getMyTasks);

// Route to submit a task
router.post("/:id/submit", authMiddleware, upload.array("files"), checkDeadline, submitTask);

export default router;
