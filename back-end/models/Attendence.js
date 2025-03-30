import mongoose from "mongoose";
import { Schema } from "mongoose";

const attendenceSchema = new mongoose.Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: String, required: true },
    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    qrCodeValue: { type: String, required: true },
});
const Attendence = mongoose.model("Attendence", attendenceSchema);
export default Attendence;