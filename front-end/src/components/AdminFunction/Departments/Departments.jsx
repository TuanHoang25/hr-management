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
import { Link } from "react-router-dom"; // Import Link
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaList,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"; // Import icon từ react-icons

import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state cho thanh tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(5); // Số lượng items trên mỗi trang
  useEffect(() => {
    fetchDepartments(); // Lấy danh sách departments khi component được mount
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.get("http://localhost:3000/api/department", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
      setDepartments(response.data.departments); // Giả sử API trả về danh sách departments
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy danh sách vị trí:", error);
    }
  };

  const handleDeleteDepartment = async (index) => {
    const departmentToDelete = departments[index];
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      await axios.delete(
        `http://localhost:3000/api/department/${departmentToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      ); // Gọi API để xóa department
      const updatedDepartments = departments.filter((_, i) => i !== index);
      setDepartments(updatedDepartments);
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa vị trí:", error);
    }
  };

  const toggleModal = () => setModal(!modal);

  const handleEditDepartment = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.get(
        `http://localhost:3000/api/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      const department = response.data.department;
      setDepartmentName(department.name);
      setDepartmentDescription(department.description);
      setEditDepartmentId(id);
      toggleModal(); // Mở modal
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy thông tin vị trí:", error);
    }
  };

  const handleUpdateDepartment = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const updatedDepartment = {
        name: departmentName,
        description: departmentDescription,
      };
      await axios.put(
        `http://localhost:3000/api/department/${editDepartmentId}`,
        updatedDepartment,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      fetchDepartments(); // Cập nhật lại danh sách departments
      toggleModal(); // Đóng modal
    } catch (error) {
      console.error("Có lỗi xảy ra khi cập nhật vị trí:", error);
    }
  };

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Lọc danh sách phòng ban theo tên

  const indexOfLastDepartment = currentPage * itemsPerPage; // Tính chỉ số cuối của trang hiện tại
  const indexOfFirstDepartment = indexOfLastDepartment - itemsPerPage; // Tính chỉ số đầu của trang hiện tại
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstDepartment,
    indexOfLastDepartment
  ); // Lấy danh sách phòng ban hiện tại

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage); // Tính tổng số trang

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Cập nhật trang hiện tại
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Cập nhật số lượng items trên mỗi trang
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{ color: "#4CAF50" }}>
        Danh Sách Vị Trí
      </h1>
      <Link to="/admin-dashboard/create-departments">
        <Button color="primary" className="mb-3">
          <FaPlus /> Thêm Ngành Nghề Mới
        </Button>
      </Link>

      <Row className="mb-3">
        <Col md={6}>
          <FormGroup>
            <Label
              for="search"
              className="d-flex align-items-center font-weight-bold text-primary"
            >
              <FaSearch className="mr-2" /> {/* Thêm icon tìm kiếm */}
              Tìm Kiếm Vị Trí
            </Label>
            <Input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên vị trí để tìm kiếm"
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label
              for="itemsPerPage"
              className="d-flex align-items-center font-weight-bold text-primary"
            >
              <FaList className="mr-2" /> {/* Thêm icon cho số lượng mục */}
              Số lượng mục trên mỗi trang
            </Label>
            <Input
              type="select"
              id="itemsPerPage"
              onChange={handleItemsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped>
            <thead>
              <tr>
                <th>Tên Vị Trí</th>
                <th>Mô Tả</th>
                <th>Số Lượng Nhân Sự</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {currentDepartments.map((department, index) => (
                <tr key={department._id}>
                  <td>{department.name}</td>
                  <td>{department.description}</td>
                  <td>{department.staffCount}</td>
                  <td>
                    <Button
                      color="warning"
                      onClick={() => handleEditDepartment(department._id)} // Gọi hàm để lấy thông tin department
                    >
                      <FaEdit /> Sửa
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteDepartment(index)}
                      className="ml-2"
                    >
                      <FaTrash /> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1"
        >
          <FaChevronLeft /> {/* Icon Previous */}
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 ${currentPage === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1"
        >
          <FaChevronRight /> {/* Icon Next */}
        </Button>
      </div>

      {/* Modal để chỉnh sửa department */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Chỉnh Sửa Vị Trí</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="departmentName">Tên Vị Trí Mới</Label>
              <Input
                type="text"
                id="departmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Nhập tên vị trí mới"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="departmentDescription">Mô Tả Mới</Label>
              <Input
                type="textarea"
                id="departmentDescription"
                value={departmentDescription}
                onChange={(e) => setDepartmentDescription(e.target.value)}
                placeholder="Nhập mô tả mới cho vị trí"
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateDepartment}>
            Sửa
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>

      {/* Thêm component CreateDepartments và truyền hàm handleAddDepartment */}
    </Container>
  );
};

export default Departments;
