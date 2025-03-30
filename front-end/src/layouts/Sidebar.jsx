import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import avatar from "../assets/images/avatar/avatar-admin.jpg";
import background from "../assets/images/bg/background-admin.png";
import { useAuth } from "../context/AuthContext";

const navigation = [
  {
    title: "Trang chủ",
    href: "/admin-dashboard",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Điểm danh",
    href: "/admin-dashboard/attendanceManager",
    icon: "bi bi-hourglass-split",
  },
  {
    title: "Vị trí", // Thay đổi tiêu đề thành "Departments"
    href: "/admin-dashboard/departments", // Cập nhật href
    icon: "bi bi-building", // Thay đổi icon thành icon phù hợp với departments
  },
  {
    title: "Nhân viên",
    href: "/admin-dashboard/employees",
    icon: "bi bi-people",
  },
  {
    title: "Tuyển dụng",
    href: "/admin-dashboard/applicants",
    icon: "bi bi-card-text",
  },
  {
    title: "Nghỉ phép",
    href: "/admin-dashboard/leave-manager",
    icon: "bi bi-envelope-paper-fill",
  },
  {
    title: "Công việc",
    href: "/admin-dashboard/task-manager",
    icon: "bi bi-person-workspace",
  },
  {
    title: "DS - Công việc",
    href: "/admin-dashboard/list-tasks",
    icon: "bi bi-list-check",
  },
  {
    title: "About",
    href: "/admin-dashboard/about",
    icon: "bi bi-gear-fill",
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div
        className="profilebg"
        style={{ background: `url(${background}) no-repeat` }}
      >
        <div className="p-3 d-flex">
          <img src={avatar} alt="user" width="50" className="rounded-circle" />
          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        <div className="bg-dark text-white p-2 opacity-75">
          {user && user.name}
        </div>
      </div>
      <div className="p-3 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
          {/* Replace Button with Link */}
          <Button onClick={logout} color="primary" block>
            {/* Use a primary button */}
            <i className="bi bi-box-arrow-in-right"></i> Đăng xuất
          </Button>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
