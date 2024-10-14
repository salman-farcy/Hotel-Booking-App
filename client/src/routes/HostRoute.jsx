import { Navigate } from "react-router-dom";
import Loader from "../components/Shared/Loader";
import useRole from "../hooks/useRole";
import PropTypes from "prop-types";

const HostRoute = ({children}) => {
  const [role, isLoading] = useRole();
  if (isLoading) return <Loader />;
  if (role === "host") return children;
  return <Navigate to="/dashboard" />;
};

export default HostRoute;

HostRoute.propTypes = {
  children: PropTypes.element,
};
