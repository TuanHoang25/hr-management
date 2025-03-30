import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid2,
  InputLabel,
  Input,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ApplyPageImg from "../../assets/images/bg/LoginBackground.jpg";
import { useNavigate } from "react-router-dom";
import "../../assets/css/apply.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Apply = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null,
    aspiration: "",
    languageCertificate: "",
    skillCertificate: "",
    languageProof: null,
    skillProof: null,
  });
  const [openDialog, setOpenDialog] = useState(false); // State để mở dialog
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "skillProof" || name === "cv" || name === "languageProof") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ApplicantDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      ApplicantDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/application/apply",
        ApplicantDataObj
      );
      // toast.success(response.data.message);
      if(response.data.success){
        setOpenDialog(true);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.error);
      }
    }
  };
  const handleNavigateHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url("' + ApplyPageImg + '")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component={Paper}
        elevation={5}
        sx={{
          p: 4,
          width: "600px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 4,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: "#ffffff",
            mb: 2,
            fontWeight: "700",
            fontStyle: "normal",
          }}
        >
          Form Ứng Tuyển
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                className="apply-input"
                fullWidth
                name="name"
                label="Tên"
                variant="filled"
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#ddd" } }}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                className="apply-input"
                fullWidth
                name="email"
                label="Email"
                type="email"
                variant="filled"
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#ddd" } }}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                className="apply-input"
                fullWidth
                name="phone"
                label="Số điện thoại"
                type="tel"
                variant="filled"
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#ddd" } }}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                className="apply-input"
                fullWidth
                name="aspiration"
                label="Kì vọng ứng tuyển"
                variant="filled"
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#ddd" } }}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                className="apply-input"
                fullWidth
                name="languageCertificate"
                label="Ngoại ngữ"
                variant="filled"
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#ddd" } }}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                className="apply-input"
                fullWidth
                name="skillCertificate"
                label="Kĩ năng"
                variant="filled"
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#ddd" } }}
                onChange={handleChange}
                required
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#ddd" }}>Upload CV</InputLabel>
              <Input
                fullWidth
                type="file"
                name="cv"
                sx={{ color: "#fff" }}
                onChange={handleChange}
                required
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#ddd" }}>
                Upload Chứng chỉ ngoại ngữ
              </InputLabel>
              <Input
                fullWidth
                type="file"
                name="languageProof"
                sx={{ color: "#fff" }}
                onChange={handleChange}
                required
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#ddd" }}>
                Upload Chứng chỉ kỹ năng
              </InputLabel>
              <Input
                fullWidth
                type="file"
                name="skillProof"
                sx={{ color: "#fff" }}
                onChange={handleChange}
                required
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                Gửi Thông Tin
              </Button>
            </Grid2>
          </Grid2>
        </form>
      {/* Dialog thông báo thành công */}
      <Dialog open={openDialog} onClose={handleNavigateHome}>
        <DialogTitle sx={{ textAlign: "center", color: "green" }}>
          <CheckCircleIcon
            sx={{ fontSize: 60, color: "green", mb: 1 }}
          />
          Đăng Ký Thành Công!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center">
            Cảm ơn bạn đã gửi thông tin ứng tuyển. Chúng tôi sẽ liên hệ với bạn
            sớm nhất có thể.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleNavigateHome}
            color="primary"
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              fontWeight: "bold",
              borderRadius: "20px",
            }}
          >
            Trở về trang chủ
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Apply;
