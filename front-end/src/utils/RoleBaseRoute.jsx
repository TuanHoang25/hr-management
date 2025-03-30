import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const RoleBaseRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }
  if (requiredRole && !requiredRole.includes(user.role)) {
    return user.role === "admin" ? <Navigate to="/admin-dashboard" /> : <Navigate to="/unauthorized" />;
  }
  // console.log(requiredRole);
  return user ? children : <Navigate to="/login" />;
};

RoleBaseRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.array.isRequired,
};
export default RoleBaseRoute;
