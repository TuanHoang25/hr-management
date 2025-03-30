import PropTypes from "prop-types";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "15px 20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: "280px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Phần icon - Thêm border và điều chỉnh màu */}
      <div
        style={{
          width: "60px",
          height: "60px",
          background: color,
          color: "#ffffff",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          marginRight: "15px",
          boxShadow: `0 4px 8px ${color}40`,
          border: `2px solid ${color}`,
          fontWeight: "bold",
        }}
      >
        {icon}
      </div>

      {/* Phần text và number */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h4 
          style={{ 
            margin: 0, 
            color: "#333", 
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "4px"
          }}
        >
          {text}
        </h4>
        <h2 
          style={{ 
            margin: 0, 
            color: color, 
            fontSize: "24px",
            fontWeight: "bold" 
          }}
        >
          {number}
        </h2>
        <div 
          style={{
            fontSize: "12px",
            color: "#666",
            marginTop: "4px"
          }}
        >
          Cập nhật mới nhất
        </div>
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

export default SummaryCard;
