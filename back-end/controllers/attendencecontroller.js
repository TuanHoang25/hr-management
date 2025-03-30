import Attendence from '../models/Attendence.js';
import mongoose from 'mongoose';
// Hàm tạo mã QR chứa thời gian thực tế
const generateQRCode = async (req, res) => {
    const currentDateTime = new Date();
    // const localDateTime = new Date(currentDateTime.getTime() + (7 * 60 * 60 * 1000)); // Thêm 7 giờ
    const qrCodeValue = currentDateTime.toISOString(); // Tạo mã QR từ thời gian thực tế theo múi giờ VN
    console.log(qrCodeValue);
    return res.status(200).json({ success: true, qrCodeValue });
};

// Hàm quét mã QR
const scanQRCode = async (req, res) => {
    const { qrCodeValue } = req.body;
    const employeeId = req.user._id;

    if (!qrCodeValue) {
        return res.status(400).json({ success: false, error: "QR code value is required" });
    }

    try {
        const currentDateTime = new Date();
        const localDateTime = new Date(currentDateTime.getTime() + (7 * 60 * 60 * 1000)); // Thêm 7 giờ
        // const today = currentDateTime.toISOString().split("T")[0];
        const today = localDateTime.toISOString().split("T")[0];
        // Kiểm tra xem có bản ghi chưa check-out của ngày trước không
        const previousUnfinishedRecord = await Attendence.findOne({
            employeeId,
            checkOutTime: null, // Tìm bản ghi chưa hoàn tất
            date: { $lt: today }, // Chỉ kiểm tra các ngày trước hôm nay
        });

        if (previousUnfinishedRecord) {
            // Nếu có bản ghi chưa hoàn tất từ ngày hôm trước, chỉ cập nhật checkOutTime
            previousUnfinishedRecord.checkOutTime = currentDateTime;
            await previousUnfinishedRecord.save();
            return res.status(200).json({
                success: true,
                message: "Check-out successful for previous day",
                attendence: previousUnfinishedRecord,
            });
        }

        // Tìm các bản ghi trong ngày hiện tại
        const attendanceRecords = await Attendence.find({ employeeId, date: today });

        if (attendanceRecords.length === 0) {
            // Nếu chưa có bản ghi nào trong ngày, tạo mới
            const newAttendence = new Attendence({
                employeeId,
                date: today,
                checkInTime: currentDateTime, // Ghi nhận thời gian check-in
                qrCodeValue,
            });
            await newAttendence.save();
            return res.status(200).json({
                success: true,
                message: "Check-in successful",
                attendence: newAttendence,
            });
        } else {
            // Cập nhật thời gian ra nếu đã có bản ghi check-in trong ngày
            let allCheckedOut = true;

            for (const record of attendanceRecords) {
                if (!record.checkOutTime) {
                    record.checkOutTime = currentDateTime;
                    await record.save();
                    allCheckedOut = false;
                }
            }

            if (allCheckedOut) {
                const newAttendence = new Attendence({
                    employeeId,
                    date: today,
                    checkInTime: currentDateTime,
                    qrCodeValue,
                });
                await newAttendence.save();
                return res.status(200).json({
                    success: true,
                    message: "Check-in successful",
                    attendence: newAttendence,
                });
            } else {
                return res.status(200).json({ success: true, message: "Check-out successful" });
            }
        }
    } catch (error) {
        console.error("Error scanning QR code:", error);
        return res.status(500).json({ success: false, error: "Server error, can't scan QR code" });
    }
};
// Hàm quản lý danh sách điểm danh
const getAllAttendanceRecords = async (req, res) => {
    try {
        const { page = 1, limit = 10, employeeId, startDate, endDate } = req.query;

        const filter = {};
        if (employeeId) {
            // filter.employeeId = employeeId;
            filter.employeeId = mongoose.Types.ObjectId.createFromHexString(employeeId);
        }
        console.log(filter);
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate).toISOString().split('T')[0],
                $lte: new Date(endDate).toISOString().split('T')[0]
            };
        }

        const attendanceRecords = await Attendence.find(filter)
            .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
            .skip((page - 1) * limit)
            .limit(Number(limit));
        console.log(attendanceRecords);

        const totalRecords = await Attendence.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: {
                records: attendanceRecords,
                currentPage: Number(page),
                totalPages: Math.ceil(totalRecords / limit),
                totalRecords
            }
        });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        return res.status(500).json({
            success: false,
            error: "Không thể lấy danh sách điểm danh"
        });
    }
};

// Hàm thống kê điểm danh
const getAttendanceSummary = async (req, res) => {
    try {
        const { month, year, employeeId } = req.query;

        const filter = {};
        if (employeeId) {
            // filter.employeeId = new mongoose.Types.ObjectId(employeeId); đã bị deprecated
            filter.employeeId = mongoose.Types.ObjectId.createFromHexString(employeeId);
        }
        console.log(employeeId);
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            filter.date = {
                $gte: startDate.toISOString().split('T')[0],
                $lte: endDate.toISOString().split('T')[0]
            };
        }

        const summary = await Attendence.aggregate([
            { $match: filter },
            {
                $addFields: {
                    validWorkHours: {
                        $cond: {
                            if: { $and: [{ $ifNull: ['$checkInTime', false] }, { $ifNull: ['$checkOutTime', false] }] },
                            then: {
                                $divide: [
                                    {
                                        $subtract: [
                                            { $toDate: '$checkOutTime' },
                                            { $toDate: '$checkInTime' }
                                        ]
                                    },
                                    3600000
                                ]
                            },
                            else: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$employeeId',
                    totalWorkDays: { $sum: 1 },
                    totalWorkHours: { $sum: '$validWorkHours' }
                }
            },
            {
                $lookup: {
                    from: 'users', // Tên collection của User
                    localField: '_id',
                    foreignField: '_id',
                    as: 'employeeDetails'
                }
            },
            { $unwind: '$employeeDetails' }
        ]);
        console.log(summary);
        return res.status(200).json({
            success: true,
            summary
        });
    } catch (error) {
        console.error("Error fetching attendance summary:", error);
        return res.status(500).json({
            success: false,
            error: "Không thể tạo báo cáo thống kê điểm danh"
        });
    }
};

// Hàm xem lịch sử điểm danh của nhân viên
// const getAttendanceHistory = async (req, res) => {
//     const employeeId = req.user._id; // Lấy ID nhân viên từ thông tin người dùng đã xác thực
//     const { dayOfWeek } = req.query; // Nhận thông tin về thứ đã chọn từ query

//     try {
//         const currentDate = new Date();
//         const currentYear = currentDate.getFullYear();
//         const currentMonth = currentDate.getMonth();

//         // Tính toán ngày tương ứng với thứ đã chọn
//         const dayOffset = (parseInt(dayOfWeek) + 1) % 7; // Chuyển đổi từ 0-6 (T2-CN) thành 0-6 (Chủ Nhật là 0)
//         const selectedDate = new Date(currentYear, currentMonth, currentDate.getDate() - currentDate.getDay() + dayOffset);
//         const formattedDate = selectedDate.toISOString().split('T')[0];
//         const attendanceRecords = await Attendence.find({
//             employeeId,
//             date: formattedDate // Chỉ lấy bản ghi cho ngày đã chọn
//         })
//         .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
//         .select('date checkInTime checkOutTime'); // Chọn các trường cần thiết

//         return res.status(200).json({
//             success: true,
//             data: attendanceRecords,
//         });
//     } catch (error) {
//         console.error("Error fetching attendance history:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Không thể lấy lịch sử điểm danh"
//         });
//     }
// };
const getAttendanceHistory = async (req, res) => {
    const employeeId = req.user._id; // Lấy ID nhân viên từ thông tin người dùng đã xác thực
    const { startDate, endDate } = req.query; // Nhận thông tin về khoảng thời gian từ query
    
    try {
        const attendanceRecords = await Attendence.find({
            employeeId,
            date: { $gte: startDate, $lte: endDate },
            // Lấy bản ghi trong khoảng thời gian
        })
            .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
            .select('date checkInTime checkOutTime qrCodeValue'); // Chọn các trường cần thiết
        return res.status(200).json({
            success: true,
            data: attendanceRecords,
        });
    } catch (error) {
        console.error("Error fetching attendance history:", error);
        return res.status(500).json({
            success: false,
            error: "Không thể lấy lịch sử điểm danh"
        });
    }
};

export { generateQRCode, scanQRCode, getAllAttendanceRecords, getAttendanceSummary, getAttendanceHistory };
