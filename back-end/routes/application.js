import express from "express";
import { apply, getApplicationDetails, getApply, updateApplicationStatus, upload } from "../controllers/applicationcontroller.js";

const router = express.Router();
router.get("/getApply", getApply);
router.get("/:id", getApplicationDetails);
// router.post("/apply", upload.single('image'), apply);
router.post("/apply", upload.fields([{ name: 'cv' }, { name: 'skillProof' }, { name: 'languageProof' }]), apply);
router.post("/applyStatus", updateApplicationStatus);
export default router;