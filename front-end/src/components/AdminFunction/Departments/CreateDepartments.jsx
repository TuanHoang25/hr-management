import { useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const CreateDepartments = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDepartment = {
      name: departmentName,
      description: departmentDescription,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/department/create",
        newDepartment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }

    setDepartmentName("");
    setDepartmentDescription("");
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{ color: "#4CAF50" }}>
        Thêm Vị Trí Mới
      </h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <FormGroup>
              <Label for="departmentName">Tên Vị Trí</Label>
              <Input
                type="text"
                id="departmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Nhập tên vị trí"
                required
              />
            </FormGroup>
          </Col>
          <Col md={6} className="mb-3">
            <FormGroup>
              <Label for="departmentDescription">Mô Tả</Label>
              <Input
                type="textarea"
                id="departmentDescription"
                value={departmentDescription}
                onChange={(e) => setDepartmentDescription(e.target.value)}
                placeholder="Nhập mô tả cho vị trí"
                required
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="primary" type="submit" className="mt-3">
          Tạo Mới
        </Button>
      </Form>
    </Container>
  );
};

export default CreateDepartments;
