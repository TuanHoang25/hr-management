import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import background from "../assets/images/bg/background-admin.png";
import { useAuth } from "../context/AuthContext";

const navigation = [
  {
    title: "Home",
    href: "/employee-dashboard",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Nghỉ phép",
    href: "/employee-dashboard/leave",
    icon: "bi bi-envelope-paper",
  },
  {
    title: "Điểm danh", // Thay đổi tiêu đề thành "Departments"
    href: "/employee-dashboard/Attendence", // Cập nhật href
    icon: "bi bi-stopwatch", // Thay đổi icon thành icon phù hợp với attendence
  },
  {
    title: "Google Maps",
    href: "/employee-dashboard/googlemaps",
    icon: "bi bi-geo-alt-fill",
  },
  {
    title: "Công việc",
    href: "/employee-dashboard/task",
    icon: "bi bi-briefcase-fill",
  },
  {
    title: "Profile",
    href: "/employee-dashboard/profile",
    icon: "bi bi-people",
  },
];

const Sidebar = () => {
  const { user } = useAuth();
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
          <img
            src={`http://localhost:3000/${user.image}`}
            alt="user"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover", // Đảm bảo ảnh được cắt vừa khung
              borderRadius: "50%", // Tạo hiệu ứng tròn
              border: "2px solid white", // Viền trắng xung quanh
            }}
          />
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
                to={
                  navi.href + (navi.title === "Profile" ? `/${user._id}` : "")
                }
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
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
