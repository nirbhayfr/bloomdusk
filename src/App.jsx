import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Homepage from "./pages/Homepage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/Checkout";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route index element={<Homepage />} />
					<Route path="product/:id" element={<ProductPage />} />
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<RegisterPage />} />
					<Route path="checkout" element={<CheckoutPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
