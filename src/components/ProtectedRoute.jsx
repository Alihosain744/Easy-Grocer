import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/signin" replace />;
  return children;
}

// this component protect the admin page against unauthorized access
function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/signin" replace />;

  if (currentUser.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export { ProtectedRoute, AdminRoute };
