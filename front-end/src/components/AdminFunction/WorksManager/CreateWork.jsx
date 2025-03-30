import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Box,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateWork = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [recipientsType, setRecipientsType] = useState("employee");
  const [assignedTo, setAssignedTo] = useState([]);
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attachments, setAttachments] = useState(null);
  useEffect(() => {
    // Lấy danh sách phòng ban và nhân viên
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Lấy Bearer token từ localStorage
      const headers = { Authorization: `Bearer ${token}` };
      const departmentsResponse = await axios.get(
        "http://localhost:3000/api/department",
        {
          headers,
        }
      );
      setDepartments(departmentsResponse.data.departments);
      const employeesResponse = await axios.get(
        "http://localhost:3000/api/employee",
        {
          headers,
        }
      );
      setEmployees(employeesResponse.data.employees);
    };
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("recipientsType", recipientsType);
    if (recipientsType === "employee") {
      if (assignedTo.length === employees.length) {
        // Nếu tất cả nhân viên được chọn
        formData.append("assignedTo", "all");
      } else {
        assignedTo.forEach((id) => formData.append("assignedTo[]", id)); // Đảm bảo gửi dưới dạng mảng
      }
    } else if (recipientsType === "department") {
      formData.append("department", department);
    }
    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
    }
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.post("http://localhost:3000/api/task/tasks", formData, {
        headers,
      });
      toast.success("Công việc đã được tạo thành công");
      // Reset form after submission
      setTitle("");
      setDescription("");
      setDeadline("");
      setRecipientsType("employee");
      setAssignedTo([]);
      setDepartment("");
      setAttachments(null);
    } catch (error) {
      toast.error("Không có nhân viên thuộc vị trí này",error);
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Tiêu đề"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Mô tả"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        label="Hạn chót"
        type="datetime-local"
        variant="outlined"
        fullWidth
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        sx={{ mt: 2 }}
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Loại người nhận</InputLabel>
        <Select
          value={recipientsType}
          onChange={(e) => setRecipientsType(e.target.value)}
        >
          <MenuItem value="employee">Nhân viên</MenuItem>
          <MenuItem value="department">Phòng ban</MenuItem>
        </Select>
      </FormControl>
      {recipientsType === "employee" && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Chọn nhân viên</InputLabel>
          <Select
            multiple
            value={assignedTo}
            onChange={(e) => {
              if (e.target.value.includes("all")) {
                setAssignedTo(employees.map((emp) => emp._id)); // Chọn tất cả nhân viên
              } else {
                setAssignedTo(e.target.value);
              }
            }}
            renderValue={(selected) => selected.join(", ")}
          >
            <MenuItem value="all">
              <Checkbox checked={assignedTo.length === employees.length} />
              <ListItemText primary="Tất cả nhân viên" />
            </MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                <Checkbox checked={assignedTo.indexOf(employee._id) > -1} />
                <ListItemText primary={employee.employeeId} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {recipientsType === "department" && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Chọn phòng ban</InputLabel>
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <MenuItem key={dept._id} value={dept._id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <input
        type="file"
        multiple
        onChange={(e) => setAttachments(e.target.files)}
        style={{ marginTop: "16px" }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Tạo công việc
      </Button>
      <ToastContainer />
    </Box>
  );
};
export default CreateWork;
