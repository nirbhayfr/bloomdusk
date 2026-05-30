import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header, { SearchPopup, CartPopup, UserPopup } from "../layout/Header";
import Footer from "../homepage/Footer";
import { selectCartCount } from "../../store/cartSlice";

function AppLayout() {
	const [searchOpen, setSearchOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [userOpen, setUserOpen] = useState(false);
	const cartCount = useSelector(selectCartCount);

	// Close popups on Escape
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") {
				if (searchOpen) setSearchOpen(false);
				if (cartOpen) setCartOpen(false);
				if (userOpen) setUserOpen(false);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [searchOpen, cartOpen, userOpen]);

	return (
		<>
			{/* Global popups — mounted once, visible across all routes */}
			<SearchPopup
				open={searchOpen}
				onClose={() => setSearchOpen(false)}
			/>
			<CartPopup
				open={cartOpen}
				onClose={() => setCartOpen(false)}
			/>
			<UserPopup
				open={userOpen}
				onClose={() => setUserOpen(false)}
			/>

			{/* Persistent header */}
			<Header
				onSearchOpen={() => setSearchOpen(true)}
				onCartOpen={() => setCartOpen(true)}
				onUserOpen={() => setUserOpen(true)}
				cartCount={cartCount}
			/>

			{/* Page content */}
			<Outlet />

			{/* Persistent footer */}
			<Footer />
		</>
	);
}

export default AppLayout;
