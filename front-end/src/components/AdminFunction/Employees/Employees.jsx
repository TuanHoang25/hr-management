import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaDollarSign, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link

const Employees = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modal, setModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments(); // Lấy danh sách nhân viên khi component được mount
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

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(response.data.employees); // Giả sử API trả về danh sách nhân viên
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy danh sách nhân viên:", error);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleEditEmployee = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/employee/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const employee = response.data.employee;
      setEmployeeData({
        name: employee?.userId?.name || "",
        email: employee?.userId?.email || "",
        dob: employee?.dob || "",
        gender: employee?.gender || "",
        maritalStatus: employee?.maritalStatus || "",
        designation: employee?.designation || "",
        department: employee?.department || "",
        salary: employee?.salary || "",
      });
      setEditEmployeeId(id);
      toggleModal(); // Mở modal
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy thông tin nhân viên:", error);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/employee/${editEmployeeId}`,
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchEmployees(); // Cập nhật lại danh sách nhân viên
      toggleModal(); // Đóng modal
    } catch (error) {
      console.error("Có lỗi xảy ra khi cập nhật nhân viên:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{ color: "#4CAF50" }}>
        Danh Sách Nhân Viên
      </h1>
      <Link to="/admin-dashboard/create-employees">
        <Button color="primary" className="mb-3">
          <FaPlus /> Tạo Tài Khoản Nhân Viên Mới
        </Button>
      </Link>
      <Row>
        <Col>
          <Table striped>
            <thead>
              <tr>
                <th>Hình Ảnh</th>
                <th>Tên</th>
                <th>Ngày Sinh</th>
                <th>Vị Trí</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <img
                      src={`http://localhost:3000/${employee.userId.image}`}
                      alt={employee.userId.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{employee.userId.name}</td>
                  <td>{new Date(employee.dob).toLocaleDateString()}</td>
                  <td>{employee.department.name}</td>
                  <td>
                    <Button
                      color="warning"
                      className="mr-2"
                      onClick={() => handleEditEmployee(employee._id)}
                    >
                      <FaEdit /> Sửa
                    </Button>
                    <Button color="danger" className="mr-2">
                      <FaTrash /> Xóa
                    </Button>
                    <Button color="info" className="mr-2" onClick={() => handleEditEmployee(employee._id)}
                    >
                      <FaEye /> Xem
                    </Button>
                    <Button color="success">
                      <FaDollarSign /> Lương
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal để chỉnh sửa nhân viên */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Chỉnh Sửa Nhân Viên</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Tên</Label>
              <Input
                type="text"
                id="name"
                value={employeeData.name}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, name: e.target.value })
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={employeeData.email}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, email: e.target.value })
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="dob">Ngày Sinh</Label>
              <Input
                type="date"
                id="dob"
                value={employeeData.dob}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, dob: e.target.value })
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="gender">Giới Tính</Label>
              <Input
                type="select"
                id="gender"
                value={employeeData.gender}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, gender: e.target.value })
                }
                required
              >
                <option value="">Chọn Giới Tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="maritalStatus">Tình Trạng Hôn Nhân</Label>
              <Input
                type="select"
                id="maritalStatus"
                value={employeeData.maritalStatus}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    maritalStatus: e.target.value,
                  })
                }
                required
              >
                <option value="">Chọn Tình Trạng Hôn Nhân</option>
                <option value="single">Độc thân</option>
                <option value="married">Kết hôn</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="designation">Chức Vụ</Label>
              <Input
                type="text"
                id="designation"
                value={employeeData.designation}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    designation: e.target.value,
                  })
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="department">Phòng Ban</Label>
              <Input
                type="select"
                name="department"
                id="department"
                value={employeeData.department}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    department: e.target.value,
                  })
                }
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
                id="salary"
                value={employeeData.salary}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, salary: e.target.value })
                }
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateEmployee}>
            Cập Nhật
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Employees;
