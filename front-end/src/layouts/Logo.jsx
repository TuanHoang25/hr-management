import LogoDark from "../assets/images/logos/system.svg?react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/admin-dashboard">
      <LogoDark />
    </Link>
  );
};

export default Logo;
