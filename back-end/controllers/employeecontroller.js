
import User from '../models/User.js'; // Giả sử bạn có model User để kiểm tra userId
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import Employee from '../models/Employee.js';

// Cấu hình multer để lưu trữ hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Đường dẫn lưu trữ hình ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
    },
});

const upload = multer({ storage: storage }); // Chỉ định trường hình ảnh

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error , can't get User" });
    }
};

const getEmployee = async (req, res) => {
    try {
        const employees = await Employee.find().populate("userId", { password: 0 }).populate("department");
        return res.status(200).json({ success: true, employees });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error , can't get Employee" });
    }
};
const getEmployeeProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const employees = await Employee.findOne({ userId: id }).populate("userId", { password: 0 }).populate("department");
        return res.status(200).json({ success: true, employees });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error, can't get Profile Employee" });
    }
};
// Hàm thêm nhân viên
const addEmployee = async (req, res) => {
    try {
        const { employeeId, name, email, password, dob, gender, maritalStatus, designation, department, salary, role } = req.body;
        console.log(req.body);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "employee registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            image: req.file ? req.file.filename : ""
        })
        const saveUser = await newUser.save();
        const newEmployee = new Employee({
            userId: saveUser._id,
            employeeId,
            gender,
            dob,
            maritalStatus,
            designation,
            department,
            salary,
        });
        await newEmployee.save();
        return res.status(200).json({ success: true, message: "Create Employee successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error , can't add Employee" });
    }

};

const editEmployee = async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    const { name, email, dob, gender, maritalStatus, designation, department, salary } = req.body;

    try {
        // Tìm nhân viên theo id
        const employee = await Employee.findById({ _id: id });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const user = await User.findById({ _id: employee.userId });
        if (!user) {
            return res.status(404).json({ success: false, error: "Nhân viên not found" });
        }

        // // Nếu có mật khẩu mới, hash mật khẩu
        // if (password) {
        //     employee.password = await bcrypt.hash(password, 10);
        // }

        // Cập nhật hình ảnh nếu có
        // if (req.file) {
        //     employee.image = req.file.filename; // Cập nhật hình ảnh
        // }
        const updateUser = await User.findByIdAndUpdate({ _id: employee.userId }, { name, email });
        const updateEmployee = await Employee.findByIdAndUpdate({ _id: id }, {
            maritalStatus,
            designation,
            salary,
            department,
            dob,
            gender,
        });
        if (!updateEmployee || !updateUser) {
            return res.status(404).json({ success: false, error: "both user and employee document not found" });
        }
        return res.status(200).json({ success: true, user: updateUser, employee: updateEmployee, message: "Cập nhật nhân viên thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Lỗi máy chủ, không thể cập nhật nhân viên" });
    }

};

export { addEmployee, getEmployee, getUser, getEmployeeProfile, editEmployee, upload };