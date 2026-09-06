import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ allowedRoles, children }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="flex min-h-[500px] items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Checking account...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const isAllowed = allowedRoles.some(hasRole);

  if (!isAllowed) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default RoleRoute;
