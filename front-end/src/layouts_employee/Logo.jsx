import LogoDark from "../assets/images/logos/system.svg?react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/employee-dashboard">
      <LogoDark />
    </Link>
  );
};

export default Logo;
