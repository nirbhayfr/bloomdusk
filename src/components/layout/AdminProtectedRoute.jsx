import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectToken } from "../../store/authSlice";

export default function AdminProtectedRoute() {
	const user = useSelector(selectUser);
	const token = useSelector(selectToken);

	// Try reading role and token from localStorage as a fallback
	// in case of page refresh before Redux store re-hydrates completely.
	const localRole = localStorage.getItem("bloomdusk_role");
	const localToken = localStorage.getItem("bloomdusk_token");

	const isAuthenticated = !!token || !!localToken;
	const isAdmin = user?.role === "admin" || localRole === "admin";

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!isAdmin) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
