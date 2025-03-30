import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";

const AttendanceManager = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recordsModal, setRecordsModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);
  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
    employeeId: "",
  });
  const [summaryParams, setSummaryParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    employeeId: "",
  });
  const [users, setUser] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/employee", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data.employees);
    } catch (error) {
      toast.error("Không thể tải danh sách nhân viên", error);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/attendance/records",
        {
          params: {
            page,
            ...filterParams,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setAttendanceRecords(response.data.data.records);
        console.log(response.data.data.records);
        setTotalPages(response.data.data.totalPages);
        setRecordsModal(true);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách điểm danh", error);
    }
  };

  const fetchAttendanceSummary = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/attendance/summary",
        {
          params: {
            ...summaryParams,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setAttendanceSummary(response.data.summary);
        console.log(response.data.summary);
        setSummaryModal(true);
      }
    } catch (error) {
      toast.error("Không thể tải báo cáo thống kê", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchAttendanceRecords();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSummaryParamsChange = (e) => {
    const { name, value } = e.target;
    setSummaryParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Container>
      <Card className="mt-3">
        <CardHeader>Quản Lý Điểm Danh</CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <Card>
                <CardHeader>Danh Sách Điểm Danh</CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Từ Ngày</Label>
                          <Input
                            type="date"
                            name="startDate"
                            value={filterParams.startDate}
                            onChange={handleFilterChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Đến Ngày</Label>
                          <Input
                            type="date"
                            name="endDate"
                            value={filterParams.endDate}
                            onChange={handleFilterChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Nhân Viên</Label>
                          <Input
                            type="select"
                            name="employeeId"
                            value={filterParams.employeeId}
                            onChange={handleFilterChange}
                          >
                            <option value="">Tất Cả</option>
                            {users.map((emp) => (
                              <option key={emp._id} value={emp.userId._id}>
                                {emp.userId.name}
                              </option>
                              //userId là đối tượng nên phải là : userId._id
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="primary" onClick={fetchAttendanceRecords}>
                      Tra Cứu
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardHeader>Báo Cáo Thống Kê</CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Tháng</Label>
                          <Input
                            type="number"
                            name="month"
                            min="1"
                            max="12"
                            value={summaryParams.month}
                            onChange={handleSummaryParamsChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Năm</Label>
                          <Input
                            type="number"
                            name="year"
                            value={summaryParams.year}
                            onChange={handleSummaryParamsChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Nhân Viên</Label>
                          <Input
                            type="select"
                            name="employeeId"
                            value={summaryParams.employeeId}
                            onChange={handleSummaryParamsChange}
                          >
                            <option value="">Tất Cả</option>
                            {users.map((u) => (
                              <option key={u._id} value={u.userId._id}>
                                {u.userId.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button color="primary" onClick={fetchAttendanceSummary}>
                      Xem Báo Cáo
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Modal Danh Sách Điểm Danh */}
      <Modal
        isOpen={recordsModal}
        toggle={() => setRecordsModal(!recordsModal)}
        size="lg"
      >
        <ModalHeader toggle={() => setRecordsModal(!recordsModal)}>
          Danh Sách Điểm Danh
        </ModalHeader>
        <ModalBody>
          <Table striped responsive>
            <thead>
              <tr>
                <th>Nhân Viên</th>
                <th>Ngày</th>
                <th>Giờ Vào</th>
                <th>Giờ Ra</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.employeeId}</td>
                  <td>{format(new Date(record.date), "dd/MM/yyyy")}</td>
                  <td>{format(new Date(record.checkInTime), "HH:mm:ss")}</td>
                  <td>
                    {record.checkOutTime
                      ? format(new Date(record.checkOutTime), "HH:mm:ss")
                      : "Chưa checkout"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Phân Trang */}
          <div className="d-flex justify-content-center">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                color={page === i + 1 ? "primary" : "secondary"}
                onClick={() => handlePageChange(i + 1)}
                className="me-2"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </ModalBody>
      </Modal>

      {/* Modal Báo Cáo Thống Kê */}
      <Modal
        isOpen={summaryModal}
        toggle={() => setSummaryModal(!summaryModal)}
        size="lg"
      >
        <ModalHeader toggle={() => setSummaryModal(!summaryModal)}>
          Báo Cáo Thống Kê Điểm Danh
        </ModalHeader>
        <ModalBody>
          <Table striped>
            <thead>
              <tr>
                <th>Nhân Viên</th>
                <th>Số Ngày Công</th>
                <th>Tổng Giờ Làm</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.map((item, index) => (
                <tr key={index}>
                  <td>{item.employeeDetails._id}</td>
                  <td>{item.totalWorkDays}</td>
                  <td>{item.totalWorkHours.toFixed(2)} giờ</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default AttendanceManager;
