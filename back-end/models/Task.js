import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    attachments: {
        type: [String], // Array of file URLs
        default: [],
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["Đã giao", "Hoàn thành", "Muộn"],
        default: "Đã giao",
    },

    recipientsType: {
        type: String,
        enum: ["employee", "department"], // "employee" or "department"
        required: true
    },

    assignedTo: [
        {
            type: Schema.Types.ObjectId,
            ref: "Employee",
        },
    ],
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    submittedAt: {
        type: Date,
    },
    completedFiles: [
        {
            employeeId: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            files: [String], // Array of file URLs
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
