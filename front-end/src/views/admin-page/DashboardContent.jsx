import SummaryCard from "./SummaryCard";

const DashboardContent = () => {
  const adminData = [
    { icon: "👩‍💼", text: "Employees", number: 120, color: "#4CAF50" },
    { icon: "📂", text: "Departments", number: 12, color: "#2196F3" },
    { icon: "🕒", text: "Projects", number: 8, color: "#FF9800" },
  ];

  const leaveData = [
    {
      icon: "📝",
      text: "Đơn nghỉ phép",
      number: 45,
      color: "#4CAF50",
    },
    {
      icon: "⏳",
      text: "Đơn chờ duyệt",
      number: 8,
      color: "#FF9800",
    },
    {
      icon: "✅",
      text: "Đơn chấp thuận",
      number: 32,
      color: "#2196F3",
    },
    {
      icon: "❌",
      text: "Đơn từ chối",
      number: 5,
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
        Dashboard Overview
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
        Leave Manager
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