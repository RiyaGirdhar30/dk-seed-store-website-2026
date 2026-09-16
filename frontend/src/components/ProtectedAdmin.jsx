import { Navigate } from "react-router-dom";

function ProtectedAdmin({ children }) {
  const user = JSON.parse(
    localStorage.getItem("dkUser")
  );

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedAdmin;