import Department from "../models/Department.js";

const getdepartment = async (req, res) => {
    try {
        const departments = await Department.find();
        return res.status(200).json({ success: true, departments });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error , can't get department" });
    }
}

const adddepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newDepartment = new Department({ name, description });
        await newDepartment.save();
        return res.status(200).json({ success: true, department: newDepartment });
    } catch (error) {
        return res.status(500).json({ error: "Server error , can't add department" });
    }
}

const editDepartment = async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    const { name, description } = req.body; // Lấy thông tin từ body
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { name, description },
            { new: true } // Trả về tài liệu đã cập nhật
        );
        if (!updatedDepartment) {
            return res.status(404).json({ success: false, error: "Department not found" });
        }
        return res.status(200).json({ success: true, department: updatedDepartment });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error, can't update department" });
    }
}

const deleteDepartment = async (req, res) => {
    const { id } = req.params; // Lấy id từ params
    try {
        const deletedDepartment = await Department.findByIdAndDelete(id); // Tìm và xóa department theo id
        if (!deletedDepartment) {
            return res.status(404).json({ success: false, error: "Department not found" });
        }
        return res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error, can't delete department" });
    }
}


export { adddepartment, getdepartment, editDepartment, deleteDepartment };