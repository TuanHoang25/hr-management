import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

const Leave = () => {
  const { id } = useParams();
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    proof: null, // Dùng để lưu file minh chứng
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openForm, setOpenForm] = useState(false); // State điều khiển form gửi đơn

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proof") {
      setLeaveData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setLeaveData({ ...leaveData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const leaveDataObj = new FormData();
    Object.keys(leaveData).forEach((key) => {
      leaveDataObj.append(key, leaveData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/leave/create",
        leaveDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setSnackbarMessage("Đơn xin nghỉ phép đã được gửi thành công!");
        setSnackbarOpen(true);
        setOpenForm(false);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Có lỗi xảy ra khi gửi đơn xin nghỉ phép.");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/leave/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLeaveRequests(response.data.leaveRequests);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLeaveRequests();
  }, [id]);

  const statusColors = {
    Pending: "warning",
    Approved: "success",
    Rejected: "error",
  };

  return (
    <Box>
      <Typography variant="h5" marginBottom={2}>
        Danh sách đơn xin nghỉ phép đã gửi
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenForm(true)}
        style={{ marginBottom: 16 }}
      >
        Gửi đơn mới
      </Button>

      {/* Table hiển thị danh sách đơn */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Loại đơn</strong>
              </TableCell>
              <TableCell>
                <strong>Ngày bắt đầu</strong>
              </TableCell>
              <TableCell>
                <strong>Ngày kết thúc</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell>
                <strong>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.leaveType}</TableCell>
                <TableCell>
                  {new Date(request.startDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {new Date(request.endDate).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={statusColors[request.status] || "default"}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(request)}
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form gửi đơn */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Gửi đơn xin nghỉ phép</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Loại đơn</InputLabel>
              <Select
                name="leaveType"
                value={leaveData.leaveType}
                onChange={handleChange}
                required
              >
                <MenuItem value="Lý do cá nhân">Lý do cá nhân</MenuItem>
                <MenuItem value="Lịch công tác">Lịch công tác</MenuItem>
                <MenuItem value="Lý do sức khỏe">Lý do sức khỏe</MenuItem>
                <MenuItem value="Thời tiết">Thời tiết</MenuItem>
                <MenuItem value="Lý do gia đình">Lý do gia đình</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="date"
              name="startDate"
              value={leaveData.startDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              type="date"
              name="endDate"
              value={leaveData.endDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="reason"
              value={leaveData.reason}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Lý do"
              multiline
              rows={4}
              required
            />
            <input
              type="file"
              name="proof"
              id="proof"
              onChange={handleChange}
              style={{ marginTop: 16 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 16 }}
            >
              Gửi đơn
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog xem chi tiết */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi tiết đơn xin nghỉ phép</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography>
                <strong>Loại đơn:</strong> {selectedRequest.leaveType}
              </Typography>
              <Typography>
                <strong>Ngày bắt đầu:</strong>{" "}
                {new Date(selectedRequest.startDate).toLocaleDateString(
                  "vi-VN"
                )}
              </Typography>
              <Typography>
                <strong>Ngày kết thúc:</strong>{" "}
                {new Date(selectedRequest.endDate).toLocaleDateString("vi-VN")}
              </Typography>
              <Typography>
                <strong>Lý do:</strong> {selectedRequest.reason}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography component="span">
                  <strong>Trạng thái:</strong>
                </Typography>
                <Chip
                  label={selectedRequest.status}
                  color={statusColors[selectedRequest.status] || "default"}
                />
              </Box>

              {selectedRequest.proof && (
                <Box marginTop={2}>
                  <Typography>
                    <strong>Minh chứng:</strong>
                  </Typography>
                  <img
                    src={`http://localhost:3000/${selectedRequest.proof}`}
                    alt="Minh chứng"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Leave;
