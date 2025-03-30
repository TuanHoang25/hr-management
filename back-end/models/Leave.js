import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const leaveSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: { type: String, enum: ['Lý do cá nhân', 'Lịch công tác', 'Lý do sức khỏe', 'Thời tiết', 'Lý do gia đình'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    proof: { type: String }, // Đường dẫn đến minh chứng (nếu có)
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
