import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // State mở Dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Nội dung thông báo
  const [openProofDialog, setOpenProofDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { id } = useParams();
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

  const handleApprove = async (requestId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/leave/leaveStatus",
        { requestId, status: "Approved" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setDialogMessage("Đơn đã được duyệt thành công!");
        setDialogOpen(true); // Hiển thị Dialog
        setLeaveRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: "Approved" } : req
          )
        );
      }
    } catch (error) {
      console.error(error);
      setDialogMessage("Có lỗi xảy ra khi duyệt đơn.");
      setDialogOpen(true); // Hiển thị Dialog lỗi
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/leave/leaveStatus",
        { requestId, status: "Rejected" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setDialogMessage("Đơn đã bị từ chối!");
        setDialogOpen(true); // Hiển thị Dialog
        setLeaveRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: "Rejected" } : req
          )
        );
      }
    } catch (error) {
      console.error(error);
      setDialogMessage("Có lỗi xảy ra khi từ chối đơn.");
      setDialogOpen(true); // Hiển thị Dialog lỗi
    }
  };
  const handleOpenProofDialog = (request) => {
    setSelectedRequest(request);
    setOpenProofDialog(true);
  };

  const handleCloseProofDialog = () => {
    setOpenProofDialog(false);
    setSelectedRequest(null);
  };

  return (
    <div>
      <h2>Quản lý duyệt đơn nghỉ phép</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loại đơn</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
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
                    color={
                      request.status === "Approved"
                        ? "success"
                        : request.status === "Rejected"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleApprove(request._id)}
                    disabled={request.status !== "Pending"}
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleReject(request._id)}
                    style={{ marginLeft: 8 }}
                    disabled={request.status !== "Pending"}
                  >
                    Từ chối
                  </Button>
                  <Button
                    variant="outlined" // Thay đổi kiểu nút
                    color="info" // Màu sắc khác cho nút
                    onClick={() => handleOpenProofDialog(request)}
                    style={{ marginLeft: 8, padding: "6px 12px" }} // Thay đổi padding
                    startIcon={<VisibilityIcon />} // Thêm biểu tượng
                  >
                    Xem minh chứng
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog thông báo */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle style={{ textAlign: "center" }}>
          {dialogMessage.includes("lỗi") ? (
            <ErrorIcon color="error" style={{ fontSize: 48 }} />
          ) : (
            <CheckCircleIcon color="success" style={{ fontSize: 48 }} />
          )}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <h3>{dialogMessage}</h3>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogOpen(false)}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openProofDialog} onClose={handleCloseProofDialog}>
        <DialogTitle>Minh chứng đơn xin nghỉ phép</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <div>
              <Typography>
                <strong>Lý do:</strong> {selectedRequest.reason}
              </Typography>
              {selectedRequest.proof && (
                <div>
                  <Typography>
                    <strong>Minh chứng:</strong>
                  </Typography>
                  <img
                    src={`http://localhost:3000/${selectedRequest.proof}`} // Đường dẫn đến minh chứng
                    alt="Minh chứng"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProofDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaveApproval;
