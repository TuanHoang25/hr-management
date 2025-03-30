import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    image: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments(); // Lấy danh sách phòng ban khi component được mount
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/department", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy danh sách phòng ban:", error);
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setEmployeeData({ ...employeeData, [name]: value });
  // };
  //   Đã xử lý riêng trường hình ảnh
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEmployeeData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeDataObj = new FormData();
    Object.keys(employeeData).forEach((key) => {
      employeeDataObj.append(key, employeeData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/employee/create",
        employeeDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{ color: "#4CAF50" }}>
        Tạo Tài Khoản Nhân Viên Mới
      </h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="text-center mb-4">
          <Label for="image">Hình Ảnh</Label>
          <Input
            type="file"
            name="image"
            id="image"
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="name">Tên</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={employeeData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={employeeData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Mật Khẩu</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={employeeData.password}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="employeeId">ID Nhân Viên</Label>
              <Input
                type="text"
                name="employeeId"
                id="employeeId"
                value={employeeData.employeeId}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="dob">Ngày Sinh</Label>
              <Input
                type="date"
                name="dob"
                id="dob"
                value={employeeData.dob}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="gender">Giới Tính</Label>
              <Input
                type="select"
                name="gender"
                id="gender"
                value={employeeData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Chọn Giới Tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="maritalStatus">Hôn Nhân</Label>
              <Input
                type="select"
                name="maritalStatus"
                id="maritalStatus"
                value={employeeData.maritalStatus}
                onChange={handleChange}
                required
              >
                <option value="">Chọn Tình Trạng Hôn Nhân</option>
                <option value="single">Độc thân</option>
                <option value="married">Kết hôn</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="signature">Chữ Ký</Label>
              <Input
                type="text"
                name="designation"
                id="designation"
                value={employeeData.designation}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="department">Vị Trí</Label>
              <Input
                type="select"
                name="department"
                id="department"
                value={employeeData.department}
                onChange={handleChange}
                required
              >
                <option value="">Chọn Vị Trí</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="salary">Lương</Label>
              <Input
                type="number"
                name="salary"
                id="salary"
                value={employeeData.salary}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="primary" type="submit">
          Tạo
        </Button>
      </Form>
    </Container>
  );
};

export default CreateEmployees;
