import { useEffect } from "react";
import "../assets/css/Login.css";
import PropTypes from "prop-types";

const AuthLayout = ({ children }) => {
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  return <div>{children}</div>;
};
AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
  };
export default AuthLayout;
