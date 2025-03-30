
import multer from "multer";
import path from "path";
import Task from "../models/Task.js";
import Employee from "../models/Employee.js";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/works"); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage })
// POST /api/tasks: Create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, deadline, recipientsType, assignedTo, department } = req.body;
        console.log(title, description, deadline, recipientsType, assignedTo, department);
        const attachments = req.files ? req.files.map(file => file.path) : [];
        // Kiểm tra loại người nhận
        let assignedEmployees = [];
        if (recipientsType === "employee") {
            if (assignedTo === "all") {
                // Lấy tất cả nhân viên
                assignedEmployees = await Employee.find({});
            } else if (Array.isArray(assignedTo) && assignedTo.length > 0) {
                // Tìm nhân viên theo danh sách ID được chỉ định
                assignedEmployees = await Employee.find({ _id: { $in: assignedTo } });
            } else {
                return res.status(400).json({ error: "Danh sách nhân viên không hợp lệ" });
            }
        } else if (recipientsType === "department") {
            // Lấy tất cả nhân viên trong phòng ban được chỉ định
            const departmentEmployees = await Employee.find({ department });
            assignedEmployees = departmentEmployees;
        }

        // Kiểm tra nếu không có nhân viên nào được gán
        if (assignedEmployees.length === 0) {
            return res.status(400).json({ error: "Không tìm thấy nhân viên nào để gán công việc" });
        }
        const newTask = new Task({
            title,
            description,
            deadline,
            recipientsType,
            assignedTo: assignedEmployees.map(emp => emp._id), // Chỉ lưu ID của nhân viên
            department,
            createdBy: req.user._id,
            attachments
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/tasks/:id: Update task information
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/tasks: Get all tasks (with filters)
const getTasks = async (req, res) => {
    try {
        const { department, status } = req.query;

        const filters = {};
        if (department) filters.department = department;
        if (status) filters.status = status;

        const tasks = await Task.find(filters)
            .populate({
                path: "assignedTo",
                populate: {
                    path: "department", // Populate phòng ban của nhân viên
                    model: "Department",
                },
            })
            .populate("department") // Populate phòng ban của task (nếu có)
            .populate("createdBy");
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/tasks/my-tasks: Get tasks assigned to the logged-in employee
const getMyTasks = async (req, res) => {
    try {
        // Lấy thông tin nhân viên dựa trên user._id
        const employee = await Employee.findOne({ userId: req.user._id });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found for this user" });
        }

        const tasks = await Task.find({ assignedTo: employee._id });
        const formattedTasks = tasks.map((task) => ({
            ...task.toObject(), // Chuyển đổi Document thành Object thuần
            _id: task._id.toString(),
            assignedTo: task.assignedTo.map((id) => id.toString()),
            createdBy: task.createdBy.toString(),
        }));
        // console.log("Formatted Tasks:", formattedTasks);
        res.status(200).json({ tasks: formattedTasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/tasks/:id/submit: Submit a task
const submitTask = async (req, res) => {
    try {
        const { id } = req.params;
        const employeeId = req.user._id;  // Lấy ID của nhân viên từ user đang đăng nhập
        const completedFiles = req.files.map(file => file.path); // Array of submitted file paths

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (new Date() > new Date(task.deadline)) {
            return res.status(400).json({ error: "Cannot submit task after the deadline" });
        }

        // Kiểm tra nếu nhân viên đã nộp file trước đó
        const existingSubmission = task.completedFiles.find(submission => submission.employeeId.toString() === employeeId.toString());

        if (existingSubmission) {
            // Nếu nhân viên đã nộp file trước đó, thêm file mới vào
            existingSubmission.files.push(...completedFiles);
        } else {
            // Nếu nhân viên chưa nộp file, thêm mới vào
            task.completedFiles.push({
                employeeId,
                files: completedFiles,
            });
        }

        // Cập nhật trạng thái công việc
        task.submittedAt = new Date();
        const assignedEmployeeIds = task.assignedTo.map((id) => id.toString());
        const completedEmployeeIds = task.completedFiles.map((submission) => submission.employeeId.toString());

        if (assignedEmployeeIds.every((id) => completedEmployeeIds.includes(id))) {
            // Nếu tất cả nhân viên trong assignedTo đã hoàn thành, cập nhật trạng thái "Hoàn thành"
            task.status = "Hoàn thành";
        }

        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkDeadline = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (new Date() > new Date(task.deadline)) {
            task.status = "Muộn";
            await task.save();
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export { createTask, updateTask, getTasks, getMyTasks, submitTask, upload, checkDeadline };