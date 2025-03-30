import { useState, useEffect } from "react";
import axios from "axios";
import SummaryCard from "./SummaryCard";

const DashboardContent = () => {
  // State để lưu trữ dữ liệu thống kê
  const [statistics, setStatistics] = useState({
    employeeCount: 0,
    departmentCount: 0,
    applications: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    leaves: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  });

  // Hàm lấy dữ liệu thống kê từ server
  const fetchDashboardStatistics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/dashboard/statistics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatistics(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchDashboardStatistics();
  }, []);

  const adminData = [
    {
      icon: "👩‍💼",
      text: "Employees",
      number: statistics.employeeCount,
      color: "#4CAF50",
    },
    {
      icon: "📂",
      text: "Departments",
      number: statistics.departmentCount,
      color: "#2196F3",
    },
  ];

  const leaveData = [
    {
      icon: "📝",
      text: "Tổng đơn",
      number: statistics.applications.total + statistics.leaves.total,
      color: "#4CAF50",
    },
    {
      icon: "⏳",
      text: "Đơn chờ duyệt",
      number: statistics.applications.pending + statistics.leaves.pending,
      color: "#FF9800",
    },
    {
      icon: "✅",
      text: "Đơn chấp thuận",
      number: statistics.applications.approved + statistics.leaves.approved,
      color: "#2196F3",
    },
    {
      icon: "❌",
      text: "Đơn từ chối",
      number: statistics.applications.rejected + statistics.leaves.rejected,
      color: "#FFB6C1",
    },
  ];

  return (
    <div>
      {/* Tiêu đề cho Admin Summary */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#4CAF50",
          textAlign: "center",
          textTransform: "uppercase",
          marginBottom: "20px",
          letterSpacing: "2px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        NHÂN SỰ
      </h1>
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {adminData.map((item, index) => (
          <SummaryCard
            key={index}
            icon={item.icon}
            text={item.text}
            number={item.number}
            color={item.color}
          />
        ))}
      </div>
      {/* Thêm khoảng cách giữa Admin Summary và Leave Manager */}
      <div style={{ margin: "40px 0" }} /> {/* Khoảng cách giữa hai phần */}
      {/* Tiêu đề cho Leave Manager */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#2196F3",
          textAlign: "center",
          textTransform: "uppercase",
          marginBottom: "20px",
          letterSpacing: "2px",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        ĐƠN TỪ
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {leaveData.map((item, index) => (
          <SummaryCard
            key={index}
            icon={item.icon}
            text={item.text}
            number={item.number}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
