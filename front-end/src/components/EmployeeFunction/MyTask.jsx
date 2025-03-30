import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
  Grid2,
  Chip,
} from "@mui/material";
import axios from "axios";

const TaskListWithSubmit = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/task/mytasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleFileChange = (taskId, event) => {
    setSelectedFiles({
      ...selectedFiles,
      [taskId]: event.target.files,
    });
  };

  const handleSubmitTask = async (taskId) => {
    const files = selectedFiles[taskId];
    if (!files || files.length === 0) {
      alert("Bạn chưa chọn tệp!");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `http://localhost:3000/api/task/${taskId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        alert("Nộp công việc thành công!");
      }
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: "Hoàn thành" } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Nộp công việc thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Danh Sách Công Việc
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "50vh" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container spacing={3}>
          {tasks.map((task) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={task._id}>
              <Card
                variant="outlined"
                sx={{
                  "&:hover": {
                    boxShadow: 6,
                  },
                  padding: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", marginBottom: 1 }}
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Mô tả công việc:</strong> {task.description}
                  </Typography>
                  <Chip
                    label={`Trạng thái: ${task.status}`}
                    color={task.status === "Hoàn thành" ? "success" : "warning"}
                    size="small"
                    sx={{ marginBottom: 1 }}
                  />
                  {task.submittedAt && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Thời gian hoàn thành:</strong>{" "}
                      {new Date(task.submittedAt).toLocaleString()}
                    </Typography>
                  )}
                  {task.status !== "Hoàn thành" && (
                    <Box sx={{ marginTop: 2 }}>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(task._id, e)}
                        style={{
                          marginBottom: 2,
                          display: "block",
                          width: "100%",
                          padding: "8px 0",
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmitTask(task._id)}
                        disabled={isSubmitting}
                        fullWidth
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Nộp công việc"
                        )}
                      </Button>
                    </Box>
                  )}
                  {task.status === "Hoàn thành" && (
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ marginTop: 2, fontWeight: "bold" }}
                    >
                      Công việc đã hoàn thành.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default TaskListWithSubmit;
