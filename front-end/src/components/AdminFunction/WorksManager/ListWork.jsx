import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import axios from "axios";

const ListWork = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/task/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/task/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Danh Sách Công Việc Đã Giao
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Tiêu đề</strong>
              </TableCell>
              <TableCell>
                <strong>Mô tả</strong>
              </TableCell>
              <TableCell>
                <strong>Hạn chót</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell>
                <strong>Loại Người Nhận</strong>
              </TableCell>
              <TableCell>
                <strong>Vị trí</strong>
              </TableCell>
              <TableCell>
                <strong>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              // Lọc danh sách phòng ban không trùng lặp
              const uniqueDepartments = [
                ...new Set(
                  task.assignedTo.map(
                    (emp) => emp.department && emp.department.name
                  )
                ),
              ].filter(Boolean);

              return (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    {task.description.length > 50
                      ? `${task.description.substring(0, 50)}...`
                      : task.description}
                  </TableCell>
                  <TableCell>
                    {new Date(task.deadline).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={
                        task.status === "Hoàn thành"
                          ? "success"
                          : task.status === "Muộn"
                          ? "error"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        task.recipientsType === "employee"
                          ? "Nhân viên"
                          : "Phòng ban"
                      }
                      color={
                        task.recipientsType === "employee"
                          ? "primary"
                          : "success"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {task.recipientsType === "employee"
                      ? uniqueDepartments.length > 0
                        ? uniqueDepartments.join(", ")
                        : "Không có nhân viên"
                      : task.department
                      ? task.department.name || "Không có phòng ban"
                      : "Không có"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => alert("Xem chi tiết công việc")}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => alert("Chỉnh sửa công việc")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {tasks.length === 0 && (
        <Typography sx={{ mt: 3 }} color="text.secondary">
          Không có công việc nào để hiển thị.
        </Typography>
      )}
    </Box>
  );
};

export default ListWork;
