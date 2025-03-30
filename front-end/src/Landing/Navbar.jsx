import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import HrLogo from "../assets/HrText.svg";
import { GrLanguage } from "react-icons/gr";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WorkIcon from '@mui/icons-material/Work';
const menuOptions = [
  { text: "Trang Chủ", href: "/", icon: <HomeIcon /> },
  { text: "Về chúng tôi", href: "/about", icon: <InfoIcon /> },
  { text: "Nhân sự", href: "/hr", icon: <CommentRoundedIcon /> },
  { text: "Công việc", href: "/work", icon: <WorkIcon /> },
  { text: "Liên hệ", href: "/contact", icon: <PhoneRoundedIcon /> },
];
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav>
      {/* Logo */}
      <div className="nav-logo-container">
        <img src={HrLogo} alt="Logo" width={300} />
      </div>

      {/* Desktop Navigation Links */}
      <div className="navbar-links-container">
        {menuOptions.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`navbar-link ${
              location.pathname === item.href ? "active" : ""
            }`}
          >
            {item.text}
          </Link>
        ))}
        <GrLanguage
          className="navbar-cart-icon"
          size={20}
          onClick={() => navigate("/cart")}
        />

        <button className="primary-button" onClick={handleLoginClick}>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Đăng nhập
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={toggleMenu} />
      </div>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        open={openMenu}
        onClose={toggleMenu}
        anchor="right"
        sx={{ visibility: openMenu ? "visible" : "hidden" }}
        role="presentation"
        inert={openMenu ? undefined : "true"}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMenu}>
          <List>
            {menuOptions.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.href);
                    toggleMenu();
                  }}
                  selected={location.pathname === item.href}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <ListItemButton onClick={handleLoginClick}>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            <ListItemText primary="Đăng nhập" />
          </ListItemButton>
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
