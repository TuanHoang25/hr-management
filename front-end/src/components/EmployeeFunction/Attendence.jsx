import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { ToastContainer, toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import "./Attendence.css";
const Attendence = () => {
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [modal, setModal] = useState(false);
  // const [, setSelectedDay] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  // Hàm tạo mã QR
  const handleGenerateQRCode = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/attendance/getqr",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setQrCodeValue(response.data.qrCodeValue);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Có lỗi xảy ra khi tạo mã QR.");
    }
  };

  // Hàm điểm danh
  const handleScanQRCode = async () => {
    if (!qrCodeValue) {
      toast.warn("Vui lòng chọn Quét bằng QR trước.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/attendance/scan",
        { qrCodeValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // Tạo mã QR mới sau khi điểm danh
        handleGenerateQRCode();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error scanning QR code:", error);
      toast.error("Có lỗi xảy ra khi quét mã QR.");
    }
  };

  // Hàm lấy lịch sử điểm danh
  const fetchAttendanceHistory = async (weekStartDate) => {
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    console.log("test IOS STRING",weekEndDate.toISOString());
    console.log("test BINH THUONG",weekEndDate);
    const adjustedStartDate = new Date(weekStartDate);
    adjustedStartDate.setHours(adjustedStartDate.getHours() + 7);
    
    const adjustedEndDate = new Date(weekEndDate);
    adjustedEndDate.setHours(adjustedEndDate.getHours() + 7);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/attendance/history?startDate=${
          adjustedStartDate.toISOString().split("T")[0]
        }&endDate=${adjustedEndDate.toISOString().split("T")[0]}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setAttendanceRecords(response.data.data);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      toast.error("Có lỗi xảy ra khi lấy lịch sử điểm danh.");
    }
  };

  // Hàm mở modal xem lịch sử
  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setAttendanceRecords([]); // Reset records khi mở modal
      const currentWeekStart = getStartOfWeek(new Date());
      console.log(currentWeekStart);
      setSelectedWeek(currentWeekStart);
      setCurrentWeek(currentWeekStart);
    }
  };

  // Hàm chọn tuần trước
  const handlePreviousWeek = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const previousWeek = getStartOfWeek(selectedWeek);
    previousWeek.setDate(previousWeek.getDate() - 7);
    setSelectedWeek(previousWeek);
    await fetchAttendanceHistory(previousWeek);
    setIsLoading(false);
  };

  // Hàm chọn tuần tiếp theo
  const handleNextWeek = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextWeek = getStartOfWeek(selectedWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    console.log(nextWeek);
    setSelectedWeek(nextWeek);
    await fetchAttendanceHistory(nextWeek);
    setIsLoading(false);
  };
  // Hàm tính toán ngày bắt đầu của tuần (Thứ Hai)
  const getStartOfWeek = (date) => {
    date = new Date(date);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Tính toán cho thứ Hai
    return new Date(date.setDate(date.getDate() + diff));
  };
  const getEndOfWeek = (date) => {
    date = new Date(date);
    const day = date.getDay();
    const diff = day === 0 ? 0 : 7 - day; // Tính toán cho Chủ Nhật
    return new Date(date.setDate(date.getDate() + diff));
  };

  const displayDateInVietnam = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };
  // Hàm chọn tuần hiện tại ,tạm thời xóa
  // const handleCurrentWeek = () => {
  //   setSelectedWeek(new Date());
  //   fetchAttendanceHistory(new Date());
  // };
  useEffect(() => {
    const startOfWeek = getStartOfWeek(selectedWeek);
    fetchAttendanceHistory(startOfWeek);
  }, [selectedWeek]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Điểm Danh Nhân Viên</h1>
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={handleGenerateQRCode}>
          Quét bằng QR
        </button>
        <button className="btn btn-info ms-2" onClick={toggleModal}>
          Xem lịch sử
        </button>
      </div>
      {qrCodeValue && (
        <div className="text-center mb-4">
          <h2>Mã QR:</h2>
          <QRCode value={qrCodeValue} />
        </div>
      )}
      <div className="text-center mb-4">
        <button className="btn btn-success" onClick={handleScanQRCode}>
          Điểm danh
        </button>
      </div>

      {/* Modal xem lịch sử điểm danh */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Lịch Sử Điểm Danh</ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-between mb-3">
            <Button onClick={handlePreviousWeek}>&lt;</Button>
            <div>
              {
                getStartOfWeek(selectedWeek)
                  .toLocaleDateString("vi-VN")
                  .split("T")[0]
              }{" "}
              -{" "}
              {
                getEndOfWeek(selectedWeek)
                  .toLocaleDateString("vi-VN")
                  .split("T")[0]
              }
            </div>
            <Button
              onClick={handleNextWeek}
              disabled={
                selectedWeek.toLocaleDateString("vi-VN").split("T")[0] ===
                currentWeek.toLocaleDateString("vi-VN").split("T")[0]
              }
            >
              &gt;
            </Button>
          </div>
          <div className="attendance-history">
            {attendanceRecords
              .slice()
              .sort((a, b) => {
                const timeA = a.checkOutTime
                  ? new Date(a.checkOutTime).getTime()
                  : new Date(a.checkInTime).getTime();
                const timeB = b.checkOutTime
                  ? new Date(b.checkOutTime).getTime()
                  : new Date(b.checkInTime).getTime();
                return timeB - timeA; // Sắp xếp theo thời gian giảm dần
              })
              .map((record, index) => {
                const checkInDate = new Date(record.checkInTime);
                const checkOutDate = new Date(record.checkOutTime);
                const isOvernight =
                  checkInDate.getDate() !== checkOutDate.getDate();
                return (
                  <div key={index} className="attendance-bubble">
                    <div className="check-in">
                      Vào lúc:{" "}
                      {new Date(record.checkInTime).toLocaleTimeString("vi-VN")}
                    </div>
                    <div className="date-label">
                      {displayDateInVietnam(record.qrCodeValue)}{" "}
                      {/* Hiển thị ngày */}
                    </div>
                    <div
                      className={`check-out ${
                        isOvernight ? "check-out-overnight" : ""
                      }`}
                    >
                      Ra lúc:{" "}
                      {record.checkOutTime
                        ? new Date(record.checkOutTime).toLocaleTimeString(
                            "vi-VN"
                          )
                        : "Chưa ra"}
                    </div>
                  </div>
                );
              })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Đóng
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Attendence;
