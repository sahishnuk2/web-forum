import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Toolbar from "@mui/material/Toolbar";

function ProtectedRoute() {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Toolbar /> {/* spacer */}
      <Outlet />
    </>
  );
}

export default ProtectedRoute;
