import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminProtectedRoute from "./components/layout/AdminProtectedRoute";
import Homepage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/Checkout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { fetchProducts } from "./store/productSlice";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				{/* Public storefront routes */}
				<Route path="/" element={<AppLayout />}>
					<Route index element={<Homepage />} />
					<Route path="product/:id" element={<ProductPage />} />
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<RegisterPage />} />
					<Route path="checkout" element={<CheckoutPage />} />
				</Route>

				{/* Protected admin routes */}
				<Route element={<AdminProtectedRoute />}>
					<Route path="/admin" element={<AdminLayout />}>
						<Route index element={<AdminDashboard />} />
						<Route path="categories" element={<AdminCategories />} />
						<Route path="products" element={<AdminProducts />} />
						<Route path="orders" element={<AdminOrders />} />
						<Route path="users" element={<AdminUsers />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
