import  { useState } from "react";
import {
  Navbar,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import { FaUser, FaEdit, FaInbox, FaSignOutAlt } from "react-icons/fa";
import SettingIcon from "../assets/setting-icon.svg?react";
import DashboardLogo from "../assets/dashboard-logo.svg?react";
import avatar from "../assets/images/avatar/avatar-admin.jpg";
import { useAuth } from "../context/AuthContext";
import "./css/Header.css"; // Import CSS để tạo hiệu ứng mượt mà

const Header = () => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Navbar color="primary" dark expand="md" className="fix-header px-3">
      <div className="d-flex align-items-center">
        <div className="me-3">
          <SettingIcon />
          <DashboardLogo />
        </div>
      </div>
      <Dropdown isOpen={dropdownOpen} toggle={toggle} className="ms-auto dropdown-custom">
        <DropdownToggle color="transparent" className="border-0 p-0">
          <img
            src={avatar}
            alt="profile"
            className="rounded-circle border border-light"
            width="40"
            style={{ cursor: "pointer" }}
          />
        </DropdownToggle>
        <DropdownMenu className={`dropdown-profile-menu shadow-lg border-0 rounded-3 mt-2 ${dropdownOpen ? "show" : "hide"}`}>
          <DropdownItem header className="fw-bold text-primary">
            Thông tin
          </DropdownItem>
          <DropdownItem className="d-flex align-items-center gap-2">
            <FaUser /> Tài khoản của tôi
          </DropdownItem>
          <DropdownItem className="d-flex align-items-center gap-2">
            <FaEdit /> Chỉnh sửa hồ sơ
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem className="d-flex align-items-center gap-2">
            <FaInbox /> Hộp thư đến
          </DropdownItem>
          <DropdownItem className="d-flex align-items-center gap-2 text-danger" onClick={logout}>
            <FaSignOutAlt /> Đăng xuất
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Navbar>
  );
};

export default Header;
