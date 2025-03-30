
import Leave from '../models/Leave.js';
import path from 'path';
import multer from 'multer';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/leaves'); // Đường dẫn lưu trữ hình ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
    },
});
const upload = multer({ storage: storage });
// Tạo đơn xin nghỉ phép
const createLeaveRequest = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user._id;
    try {
        const leaveRequest = new Leave({ employeeId, leaveType, startDate, endDate, reason, proof: req.file ? req.file.filename : "" });
        await leaveRequest.save();
        return res.status(201).json({ success: true, leaveRequest });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Có lỗi xảy ra khi tạo đơn xin nghỉ phép." });
    }
};

// Lấy danh sách đơn xin nghỉ phép của nhân viên
const getLeaveRequests = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const leaveRequests = await Leave.find(employeeId);
        // console.log(leaveRequests);
        return res.status(200).json({ success: true, leaveRequests });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Có lỗi xảy ra khi lấy danh sách đơn xin nghỉ phép." });
    }
};

// Duyệt đơn xin nghỉ phép
const approveLeaveRequest = async (req, res) => {
    const { requestId, status } = req.body;
    try {
        const leaveRequest = await Leave.findById(requestId);
        if (!leaveRequest) {
            return res.status(404).json({ success: false, error: "Đơn xin nghỉ phép không tồn tại." });
        }

        // Kiểm tra nếu không có minh chứng
        if (!leaveRequest.proof && status === 'Approved') {
            return res.status(400).json({ success: false, message: "Cần bổ sung minh chứng trước khi duyệt." });
        }

        leaveRequest.status = status;
        await leaveRequest.save();
        return res.status(200).json({ success: true, leaveRequest });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Có lỗi xảy ra khi duyệt đơn xin nghỉ phép." });
    }
};

export { createLeaveRequest, getLeaveRequests, approveLeaveRequest, upload };
