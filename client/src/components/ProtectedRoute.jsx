import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page that needs login with this component.
// Usage: <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
// Leave "role" out if the page just needs ANY logged-in user (e.g. Profile).

function ProtectedRoute({ children, role }) {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Wrong role trying to open this page - send them to their own dashboard
        let ownDashboard = user.role === "admin" ? "/admin-dashboard" : "/dashboard";
        return <Navigate to={ownDashboard} replace />;
    }

    return children;
}

export default ProtectedRoute;
