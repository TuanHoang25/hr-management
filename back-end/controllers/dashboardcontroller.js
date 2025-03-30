import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Application from "../models/Application.js";
import Leave from "../models/Leave.js";

const getDashboardStatistics = async (req, res) => {
    try {
        // Đếm số lượng nhân viên
        const employeeCount = await Employee.countDocuments();

        // Đếm số lượng phòng ban
        const departmentCount = await Department.countDocuments();

        // Thống kê đơn tuyển dụng
        const applications = {
            total: await Application.countDocuments(),
            pending: await Application.countDocuments({ status: 'pending' }),
            approved: await Application.countDocuments({ status: 'approved' }),
            rejected: await Application.countDocuments({ status: 'rejected' })
        };

        // Thống kê đơn nghỉ phép
        const leaves = {
            total: await Leave.countDocuments(),
            pending: await Leave.countDocuments({ status: 'Pending' }),
            approved: await Leave.countDocuments({ status: 'Approved' }),
            rejected: await Leave.countDocuments({ status: 'Rejected' })
        };

        res.json({
            employeeCount,
            departmentCount,
            applications,
            leaves
        });

    } catch (error) {
        console.error("Lỗi khi lấy thống kê dashboard:", error);
        res.status(500).json({
            success: false,
            error: "Lỗi khi lấy dữ liệu thống kê"
        });
    }
};

export { getDashboardStatistics }; 