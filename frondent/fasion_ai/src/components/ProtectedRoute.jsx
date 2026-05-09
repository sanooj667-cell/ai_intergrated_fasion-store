import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-28">
        <Loader label="Checking your session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
