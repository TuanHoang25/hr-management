import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa"; // Import icon chuông
import "./NoficationBell.css"; // Import file CSS cho styling

const NotificationBell = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  // Giả sử gọi API hoặc tăng số thông báo
  useEffect(() => {
    // Giả sử có 1 thông báo mới trong ứng dụng
    setNotificationCount(1); // Thay đổi số lượng thông báo nếu có thông báo mới
  }, []);

  return (
    <div className="notification-bell-container">
      <FaBell size={25} className="bell-icon" />

      {/* Hiển thị số lượng thông báo nếu có */}
      {notificationCount > 0 && (
        <span className="notification-badge">{notificationCount}</span>
      )}
    </div>
  );
};

export default NotificationBell;
