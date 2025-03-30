import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from "mdb-react-ui-kit";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/employee-dashboard"); // Điều hướng về trang Dashboard
  };

  return (
    <MDBContainer
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <MDBCard className="text-center p-4" style={{ maxWidth: "500px" }}>
        <MDBCardBody>
          <MDBCardTitle className="text-danger">
            404 - Truy cập bị từ chối
          </MDBCardTitle>
          <MDBCardText className="mb-4">
            Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị
            viên nếu cần hỗ trợ.
          </MDBCardText>
          <MDBBtn color="primary" onClick={handleBackToDashboard}>
            Trở về Dashboard
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Unauthorized;
