import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/application/getApply"
        );
        setApplications(response.data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await axios.post(
        "http://localhost:3000/api/application/applyStatus",
        { applicationId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotification({
        open: true,
        message: "Cập nhật trạng thái thành công!",
        type: "success",
      });
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      setNotification({
        open: true,
        message: "Có lỗi xảy ra khi cập nhật trạng thái.",
        type: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleOpenDialog = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const input = document.getElementById("application-details");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const pageHeight = 295; // A4 size
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save("application-details.pdf");
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Danh sách đơn ứng tuyển
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Tên</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Số điện thoại</strong>
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
            {applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell>{app.name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.phone}</TableCell>
                <TableCell>{app.status || "Chưa duyệt"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDialog(app)}
                  >
                    Xem
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleUpdateStatus(app._id, "approved")}
                    style={{ marginRight: "8px" }}
                    disabled={
                      app.status === "approved" || app.status === "rejected"
                    }
                  >
                    Duyệt
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleUpdateStatus(app._id, "rejected")}
                    disabled={
                      app.status === "approved" || app.status === "rejected"
                    }
                  >
                    Từ chối
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Dialog for viewing application details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi tiết đơn ứng tuyển</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box id="application-details">
              <Typography>
                <strong>Tên:</strong> {selectedApplication.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedApplication.email}
              </Typography>
              <Typography>
                <strong>Số điện thoại:</strong> {selectedApplication.phone}
              </Typography>
              <Typography>
                <strong>Kì vọng ứng tuyển:</strong>{" "}
                {selectedApplication.aspiration}
              </Typography>
              <Typography>
                <strong>Chứng chỉ ngoại ngữ:</strong>{" "}
                {selectedApplication.languageCertificate}
              </Typography>
              <Typography>
                <strong>Chứng chỉ kỹ năng:</strong>{" "}
                {selectedApplication.skillCertificate}
              </Typography>
              <Typography>
                <strong>CV:</strong>
                <a
                  href={`http://localhost:3000/${selectedApplication.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Xem
                </a>
              </Typography>
              <Typography>
                <strong>Minh chứng ngoại ngữ:</strong>
                <a
                  href={`http://localhost:3000/${selectedApplication.languageProof}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Xem
                </a>
              </Typography>
              <Typography>
                <strong>Minh chứng kỹ năng:</strong>
                <a
                  href={`http://localhost:3000/${selectedApplication.skillProof}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Xem
                </a>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={exportToPDF} color="primary">
            Xuất PDF
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminApplications;
