// Header.jsx — isolated header with Search & Cart popups
// Rendered once in AppLayout so it persists across all routes.

import {
	ArrowUpRight,
	Menu,
	X,
	Search,
	ShoppingBag,
	Trash2,
	Plus,
	Minus,
	ShoppingCart,
	User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useSelector, useDispatch } from "react-redux";
import {
	selectCartItems,
	selectCartTotal,
	adjustQty,
} from "../../store/cartSlice";

const NAV_LINKS = [
	{ label: "Shop", id: "shop" },
	{ label: "Featured", id: "featured" },
	{ label: "Reviews", id: "reviews" },
	{ label: "Social", id: "social" },
];

const scrollToSection = (id) => {
	const element = document.getElementById(id);

	if (element) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}
};

/* ─── SEARCH POPUP ──────────────────────────────────────────────────── */
export function SearchPopup({ open, onClose }) {
	const overlayRef = useRef(null);
	const panelRef = useRef(null);
	const inputRef = useRef(null);
	const [query, setQuery] = useState("");

	const suggestions = [
		"Marine Noir",
		"Ivory Oud",
		"Pink Veil",
		"Floral Collection",
		"Oud Intense",
		"Summer Bloom",
	];

	const filtered = query
		? suggestions.filter((s) =>
				s.toLowerCase().includes(query.toLowerCase()),
			)
		: suggestions;

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
			gsap.fromTo(
				overlayRef.current,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3, ease: "power2.out" },
			);
			gsap.fromTo(
				panelRef.current,
				{ y: -24, opacity: 0, scale: 0.97 },
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 0.45,
					ease: "power4.out",
				},
			);
			setTimeout(() => inputRef.current?.focus(), 100);
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const handleClose = () => {
		gsap.to(panelRef.current, {
			y: -16,
			opacity: 0,
			scale: 0.97,
			duration: 0.3,
			ease: "power3.in",
		});
		gsap.to(overlayRef.current, {
			opacity: 0,
			duration: 0.3,
			ease: "power2.in",
			onComplete: () => {
				setQuery("");
				onClose();
			},
		});
	};

	if (!open) return null;

	return (
		<div
			ref={overlayRef}
			onClick={handleClose}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 200,
				background: "rgba(15,15,15,0.45)",
				backdropFilter: "blur(12px)",
				WebkitBackdropFilter: "blur(12px)",
				display: "flex",
				alignItems: "flex-start",
				justifyContent: "center",
				paddingTop: "clamp(60px, 10vh, 120px)",
				paddingLeft: "16px",
				paddingRight: "16px",
			}}
		>
			<div
				ref={panelRef}
				onClick={(e) => e.stopPropagation()}
				style={{
					width: "100%",
					maxWidth: "580px",
					background: "#F9F6FE",
					borderRadius: "24px",
					boxShadow:
						"0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(155,107,255,0.15)",
					overflow: "hidden",
				}}
			>
				{/* Input row */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "12px",
						padding: "18px 20px",
						borderBottom: "1px solid rgba(155,107,255,0.12)",
					}}
				>
					<Search
						size={18}
						strokeWidth={2.3}
						style={{ color: "#9b6bff", flexShrink: 0 }}
					/>
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search fragrances, collections…"
						style={{
							flex: 1,
							background: "transparent",
							border: "none",
							outline: "none",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "15px",
							fontWeight: 500,
							color: "#0f0f0f",
							letterSpacing: "-0.01em",
						}}
					/>
					<button
						onClick={handleClose}
						style={{
							width: "32px",
							height: "32px",
							borderRadius: "10px",
							background: "rgba(0,0,0,0.06)",
							border: "1px solid rgba(0,0,0,0.08)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							flexShrink: 0,
						}}
					>
						<X size={14} strokeWidth={2.5} color="#0f0f0f" />
					</button>
				</div>

				{/* Results */}
				<div style={{ padding: "12px 0 8px" }}>
					<p
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "10px",
							fontWeight: 700,
							letterSpacing: "2px",
							textTransform: "uppercase",
							color: "rgba(155,107,255,0.7)",
							padding: "0 20px 8px",
							margin: 0,
						}}
					>
						{query ? "Results" : "Popular Searches"}
					</p>
					{filtered.length === 0 ? (
						<p
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: "14px",
								color: "rgba(15,15,15,0.4)",
								padding: "8px 20px 16px",
								margin: 0,
							}}
						>
							No results for &ldquo;{query}&rdquo;
						</p>
					) : (
						filtered.map((s, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
									padding: "10px 20px",
									cursor: "pointer",
									transition:
										"background 0.15s ease",
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.background =
										"rgba(155,107,255,0.07)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.background =
										"transparent")
								}
								onClick={() => setQuery(s)}
							>
								<Search
									size={13}
									strokeWidth={2}
									style={{
										color: "rgba(15,15,15,0.3)",
									}}
								/>
								<span
									style={{
										fontFamily:
											"'DM Sans', sans-serif",
										fontSize: "14px",
										fontWeight: 500,
										color: "#0f0f0f",
										flex: 1,
									}}
								>
									{s}
								</span>
								<ArrowUpRight
									size={13}
									strokeWidth={2}
									style={{
										color: "rgba(155,107,255,0.5)",
									}}
								/>
							</div>
						))
					)}
				</div>

				{/* Footer hint */}
				<div
					style={{
						borderTop: "1px solid rgba(155,107,255,0.1)",
						padding: "12px 20px",
						display: "flex",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<kbd
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "10px",
							fontWeight: 600,
							color: "rgba(15,15,15,0.4)",
							background: "rgba(0,0,0,0.05)",
							border: "1px solid rgba(0,0,0,0.1)",
							borderRadius: "5px",
							padding: "2px 6px",
						}}
					>
						ESC
					</kbd>
					<span
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "11px",
							color: "rgba(15,15,15,0.35)",
						}}
					>
						to close
					</span>
				</div>
			</div>
		</div>
	);
}

/* ─── CART POPUP ────────────────────────────────────────────────────── */
export function CartPopup({ open, onClose }) {
	const overlayRef = useRef(null);
	const drawerRef = useRef(null);
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const items = useSelector(selectCartItems);
	const total = useSelector(selectCartTotal);

	const adjust = (id, delta) => {
		dispatch(adjustQty({ id, delta }));
	};

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
			gsap.fromTo(
				overlayRef.current,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3, ease: "power2.out" },
			);
			gsap.fromTo(
				drawerRef.current,
				{ x: "100%" },
				{ x: "0%", duration: 0.5, ease: "power4.out" },
			);
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const handleClose = () => {
		gsap.to(drawerRef.current, {
			x: "100%",
			duration: 0.4,
			ease: "power3.in",
		});
		gsap.to(overlayRef.current, {
			opacity: 0,
			duration: 0.35,
			ease: "power2.in",
			onComplete: onClose,
		});
	};

	if (!open) return null;

	return (
		<div
			ref={overlayRef}
			onClick={handleClose}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 200,
				background: "rgba(15,15,15,0.4)",
				backdropFilter: "blur(10px)",
				WebkitBackdropFilter: "blur(10px)",
			}}
		>
			{/* Drawer */}
			<div
				ref={drawerRef}
				onClick={(e) => e.stopPropagation()}
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					width: "min(420px, 100vw)",
					background: "#F9F6FE",
					display: "flex",
					flexDirection: "column",
					boxShadow: "-24px 0 80px rgba(0,0,0,0.18)",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "24px 24px 20px",
						borderBottom: "1px solid rgba(155,107,255,0.12)",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "10px",
						}}
					>
						<ShoppingCart
							size={18}
							strokeWidth={2.3}
							style={{ color: "#9b6bff" }}
						/>
						<span
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: "16px",
								fontWeight: 800,
								color: "#0f0f0f",
								letterSpacing: "-0.03em",
							}}
						>
							Your Cart
						</span>
						<span
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: "11px",
								fontWeight: 700,
								color: "#9b6bff",
								background: "rgba(155,107,255,0.12)",
								borderRadius: "20px",
								padding: "2px 8px",
							}}
						>
							{items.reduce((s, i) => s + i.qty, 0)} items
						</span>
					</div>
					<button
						onClick={handleClose}
						style={{
							width: "34px",
							height: "34px",
							borderRadius: "11px",
							background: "rgba(0,0,0,0.06)",
							border: "1px solid rgba(0,0,0,0.08)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
						}}
					>
						<X size={15} strokeWidth={2.5} color="#0f0f0f" />
					</button>
				</div>

				{/* Items */}
				<div
					style={{
						flex: 1,
						overflowY: "auto",
						padding: "16px 24px",
						scrollbarWidth: "none",
					}}
				>
					{items.length === 0 ? (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								height: "100%",
								gap: "12px",
								opacity: 0.4,
							}}
						>
							<ShoppingBag
								size={40}
								strokeWidth={1.5}
								style={{ color: "#9b6bff" }}
							/>
							<p
								style={{
									fontFamily:
										"'DM Sans', sans-serif",
									fontSize: "14px",
									fontWeight: 500,
									color: "#0f0f0f",
									margin: 0,
								}}
							>
								Your cart is empty
							</p>
						</div>
					) : (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							}}
						>
							{items.map((item) => (
								<div
									key={item.id}
									style={{
										display: "flex",
										alignItems: "center",
										gap: "14px",
										background: "#fff",
										borderRadius: "16px",
										padding: "14px",
										border: "1px solid rgba(155,107,255,0.1)",
										boxShadow:
											"0 2px 12px rgba(0,0,0,0.04)",
									}}
								>
									{/* Image */}
									<div
										style={{
											width: "64px",
											height: "64px",
											borderRadius: "12px",
											background:
												"rgba(155,107,255,0.06)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
											overflow: "hidden",
										}}
									>
										<img
											src={item.image}
											alt={item.name}
											style={{
												width: "50px",
												height: "50px",
												objectFit:
													"contain",
												filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.10))",
											}}
										/>
									</div>

									{/* Info */}
									<div
										style={{
											flex: 1,
											minWidth: 0,
										}}
									>
										<p
											style={{
												fontFamily:
													"'DM Sans', sans-serif",
												fontSize: "10px",
												fontWeight: 700,
												letterSpacing:
													"1.5px",
												textTransform:
													"uppercase",
												color: "#9b6bff",
												margin: "0 0 2px",
											}}
										>
											{item.category}
										</p>
										<p
											style={{
												fontFamily:
													"'DM Sans', sans-serif",
												fontSize: "14px",
												fontWeight: 800,
												color: "#0f0f0f",
												margin: "0 0 8px",
												letterSpacing:
													"-0.02em",
												whiteSpace:
													"nowrap",
												overflow: "hidden",
												textOverflow:
													"ellipsis",
											}}
										>
											{item.name}
										</p>
										<div
											style={{
												display: "flex",
												alignItems:
													"center",
												justifyContent:
													"space-between",
											}}
										>
											{/* Qty controls */}
											<div
												style={{
													display: "flex",
													alignItems:
														"center",
													gap: "0",
													background:
														"rgba(155,107,255,0.08)",
													borderRadius:
														"20px",
													padding: "2px",
												}}
											>
												<button
													onClick={() =>
														adjust(
															item.id,
															-1,
														)
													}
													style={{
														width: "26px",
														height: "26px",
														borderRadius:
															"50%",
														background:
															item.qty ===
															1
																? "rgba(200,50,50,0.1)"
																: "transparent",
														border: "none",
														display: "flex",
														alignItems:
															"center",
														justifyContent:
															"center",
														cursor: "pointer",
														color:
															item.qty ===
															1
																? "#e05"
																: "#0f0f0f",
														transition:
															"all 0.2s ease",
													}}
												>
													{item.qty ===
													1 ? (
														<Trash2
															size={
																11
															}
															strokeWidth={
																2.3
															}
														/>
													) : (
														<Minus
															size={
																11
															}
															strokeWidth={
																2.5
															}
														/>
													)}
												</button>
												<span
													style={{
														fontFamily:
															"'DM Sans', sans-serif",
														fontSize:
															"12px",
														fontWeight: 700,
														color: "#0f0f0f",
														minWidth:
															"20px",
														textAlign:
															"center",
													}}
												>
													{item.qty}
												</span>
												<button
													onClick={() =>
														adjust(
															item.id,
															1,
														)
													}
													style={{
														width: "26px",
														height: "26px",
														borderRadius:
															"50%",
														background:
															"transparent",
														border: "none",
														display: "flex",
														alignItems:
															"center",
														justifyContent:
															"center",
														cursor: "pointer",
														color: "#0f0f0f",
													}}
												>
													<Plus
														size={11}
														strokeWidth={
															2.5
														}
													/>
												</button>
											</div>
											<span
												style={{
													fontFamily:
														"'DM Sans', sans-serif",
													fontSize:
														"14px",
													fontWeight: 800,
													color: "#0f0f0f",
													letterSpacing:
														"-0.02em",
												}}
											>
												₹
												{item.price *
													item.qty}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				{items.length > 0 && (
					<div
						style={{
							padding: "20px 24px 28px",
							borderTop:
								"1px solid rgba(155,107,255,0.12)",
						}}
					>
						{/* Subtotal */}
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "6px",
							}}
						>
							<span
								style={{
									fontFamily:
										"'DM Sans', sans-serif",
									fontSize: "12px",
									fontWeight: 500,
									color: "rgba(15,15,15,0.45)",
								}}
							>
								Subtotal
							</span>
							<span
								style={{
									fontFamily:
										"'DM Sans', sans-serif",
									fontSize: "12px",
									fontWeight: 600,
									color: "rgba(15,15,15,0.6)",
								}}
							>
								₹{total}
							</span>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "20px",
							}}
						>
							<span
								style={{
									fontFamily:
										"'DM Sans', sans-serif",
									fontSize: "15px",
									fontWeight: 800,
									color: "#0f0f0f",
									letterSpacing: "-0.03em",
								}}
							>
								Total
							</span>
							<span
								style={{
									fontFamily:
										"'DM Sans', sans-serif",
									fontSize: "20px",
									fontWeight: 900,
									color: "#9b6bff",
									letterSpacing: "-0.04em",
								}}
							>
								₹{total}
							</span>
						</div>

						{/* Checkout button */}
						<button
							style={{
								width: "100%",
								padding: "16px",
								borderRadius: "16px",
								background: "#0f0f0f",
								border: "none",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
								cursor: "pointer",
								fontFamily: "'DM Sans', sans-serif",
								fontSize: "14px",
								fontWeight: 800,
								color: "#fff",
								letterSpacing: "-0.01em",
								transition:
									"background 0.25s ease, transform 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background =
									"#9b6bff";
								e.currentTarget.style.transform =
									"translateY(-1px)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background =
									"#0f0f0f";
								e.currentTarget.style.transform =
									"translateY(0)";
							}}
							onClick={() => {
								navigate(`/checkout`);
								handleClose();
							}}
						>
							Checkout
							<ArrowUpRight size={16} strokeWidth={2.5} />
						</button>

						<p
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: "11px",
								color: "rgba(15,15,15,0.3)",
								textAlign: "center",
								marginTop: "12px",
								marginBottom: 0,
								letterSpacing: "0.2px",
							}}
						>
							Free shipping · Worldwide delivery
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

/* ─── USER POPUP ────────────────────────────────────────────────────── */
export function UserPopup({ open, onClose }) {
	const overlayRef = useRef(null);
	const panelRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
			gsap.fromTo(
				overlayRef.current,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3, ease: "power2.out" },
			);
			gsap.fromTo(
				panelRef.current,
				{ y: -20, opacity: 0, scale: 0.96 },
				{
					y: 0,
					opacity: 1,
					scale: 1,
					duration: 0.4,
					ease: "power4.out",
				},
			);
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const handleClose = (callback) => {
		gsap.to(panelRef.current, {
			y: -12,
			opacity: 0,
			scale: 0.96,
			duration: 0.25,
			ease: "power3.in",
		});
		gsap.to(overlayRef.current, {
			opacity: 0,
			duration: 0.25,
			ease: "power2.in",
			onComplete: () => {
				onClose();
				if (callback) callback();
			},
		});
	};

	if (!open) return null;

	return (
		<div
			ref={overlayRef}
			onClick={() => handleClose()}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 200,
				background: "rgba(15,15,15,0.45)",
				backdropFilter: "blur(12px)",
				WebkitBackdropFilter: "blur(12px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "16px",
			}}
		>
			<div
				ref={panelRef}
				onClick={(e) => e.stopPropagation()}
				style={{
					width: "100%",
					maxWidth: "380px",
					background: "#F9F6FE",
					borderRadius: "24px",
					boxShadow:
						"0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(155,107,255,0.15)",
					overflow: "hidden",
					padding: "32px 24px",
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "0",
				}}
			>
				{/* Decorative Icon */}
				<div
					style={{
						width: "56px",
						height: "56px",
						borderRadius: "50%",
						background: "rgba(15,15,15,0.05)",
						border: "1px solid rgba(155,107,255,0.15)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: "16px",
					}}
				>
					<User size={24} color="#9b6bff" strokeWidth={2.3} />
				</div>

				<h3
					style={{
						fontFamily: "'DM Sans', sans-serif",
						fontSize: "20px",
						fontWeight: 800,
						color: "#0f0f0f",
						letterSpacing: "-0.03em",
						margin: "0 0 6px",
					}}
				>
					Your BloomDusk Account
				</h3>
				<p
					style={{
						fontFamily: "'DM Sans', sans-serif",
						fontSize: "13px",
						color: "rgba(15,15,15,0.5)",
						lineHeight: 1.5,
						margin: "0 0 24px",
					}}
				>
					Sign in to access your bag, save favorites, and manage
					your custom story.
				</p>

				{/* Options */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						width: "100%",
					}}
				>
					<button
						onClick={() =>
							handleClose(() => navigate("/login"))
						}
						style={{
							width: "100%",
							height: "46px",
							background: "#0f0f0f",
							border: "none",
							borderRadius: "14px",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "13.5px",
							fontWeight: 800,
							color: "#fff",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = "#9b6bff";
							e.currentTarget.style.transform =
								"translateY(-1px)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = "#0f0f0f";
							e.currentTarget.style.transform =
								"translateY(0)";
						}}
					>
						Sign In
						<ArrowUpRight size={14} strokeWidth={2.5} />
					</button>

					<button
						onClick={() =>
							handleClose(() => navigate("/register"))
						}
						style={{
							width: "100%",
							height: "46px",
							background: "transparent",
							border: "1.5px solid rgba(155,107,255,0.35)",
							borderRadius: "14px",
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "13.5px",
							fontWeight: 700,
							color: "#9b6bff",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background =
								"rgba(155,107,255,0.07)";
							e.currentTarget.style.borderColor =
								"#9b6bff";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background =
								"transparent";
							e.currentTarget.style.borderColor =
								"rgba(155,107,255,0.35)";
						}}
					>
						Create Account
					</button>
				</div>

				{/* Close hint */}
				<button
					onClick={() => handleClose()}
					style={{
						background: "transparent",
						border: "none",
						fontFamily: "'DM Sans', sans-serif",
						fontSize: "12px",
						fontWeight: 600,
						color: "rgba(15,15,15,0.4)",
						marginTop: "16px",
						cursor: "pointer",
						transition: "color 0.2s ease",
					}}
					onMouseEnter={(e) =>
						(e.currentTarget.style.color = "#9b6bff")
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.color =
							"rgba(15,15,15,0.4)")
					}
				>
					Maybe later
				</button>
			</div>
		</div>
	);
}

/* ─── HEADER NAV ────────────────────────────────────────────────────── */
export default function Header({
	onSearchOpen,
	onCartOpen,
	onUserOpen,
	cartCount,
}) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<>
			<header className="fixed top-6 left-0 right-0 z-50 flex justify-center md:justify-start md:px-8 max-md:mx-8">
				<nav className="flex h-16 w-full md:w-auto items-center justify-between gap-4 rounded-2xl border border-white/40 bg-[#F9F6FE] px-4 md:px-5 shadow-sm backdrop-blur-xl">
					<img
						src="/logo.png"
						alt="logo"
						className="w-24 md:w-28 cursor-pointer"
						onClick={() => navigate("/")}
					/>

					<div className="hidden items-center gap-7 md:flex">
						{NAV_LINKS.map((link) => (
							<button
								key={link.id}
								onClick={() => scrollToSection(link.id)}
								className="text-sm font-medium text-black transition-opacity hover:opacity-55"
							>
								{link.label}
							</button>
						))}
					</div>

					<div className="ml-1 flex items-center gap-4">
						<button onClick={onSearchOpen}>
							<Search
								size={19}
								strokeWidth={2.3}
								className="text-black"
							/>
						</button>

						<button onClick={onCartOpen} className="relative">
							<ShoppingBag
								size={19}
								strokeWidth={2.3}
								className="text-black"
							/>
							<div className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e7def8] text-[9px] font-semibold text-black">
								{cartCount}
							</div>
						</button>

						<button onClick={onUserOpen}>
							<User
								size={19}
								strokeWidth={2.3}
								className="text-black"
							/>
						</button>

						<button
							onClick={() => setOpen(true)}
							className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-black/[0.07] md:hidden"
						>
							<Menu
								size={17}
								strokeWidth={2.5}
								className="text-black"
							/>
						</button>
					</div>
				</nav>
			</header>

			{/* Mobile overlay */}
			<div
				onClick={() => setOpen(false)}
				className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-md transition-all duration-300 ${
					open ? "visible opacity-100" : "invisible opacity-0"
				}`}
			/>

			{/* Mobile drawer */}
			<div
				className={`fixed top-0 right-0 bottom-0 z-[100] flex w-[min(320px,85vw)] flex-col bg-[#F9F6FE] px-7 py-8 shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
					open
						? "translate-x-0 opacity-100"
						: "translate-x-full opacity-0 pointer-events-none"
				}`}
			>
				<div className="mb-10 flex items-center justify-between">
					<img
						src="/logo.png"
						alt="logo"
						className="w-28 cursor-pointer"
						onClick={() => {
							navigate("/");
							setOpen(false);
						}}
					/>
					<button
						onClick={() => setOpen(false)}
						className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-black/[0.07]"
					>
						<X
							size={16}
							strokeWidth={2.5}
							className="text-[#0f0f0f]"
						/>
					</button>
				</div>

				<nav className="flex-1">
					{NAV_LINKS.map((link) => (
						<div
							key={link.id}
							onClick={() => {
								scrollToSection(link.id);
								setOpen(false);
							}}
							className="cursor-pointer border-b border-black/5 py-3 text-[28px] font-semibold tracking-[-0.04em] text-[#0f0f0f] transition-colors hover:text-[#9B6BFF] last:border-b-0"
						>
							{link.label}
						</div>
					))}
				</nav>

				<button
					onClick={() => {
						setOpen(false);
						onUserOpen();
					}}
					className="mb-3 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-[#e7def8]/20 py-4 text-sm font-bold text-black transition-colors hover:bg-[#9B6BFF] hover:text-white"
				>
					<User size={16} strokeWidth={2.5} />
					My Account
				</button>

				<button
					onClick={() => setOpen(false)}
					className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#0f0f0f] py-4 text-sm font-bold text-white transition-colors hover:bg-[#9B6BFF]"
				>
					Shop Now
					<ArrowUpRight size={16} strokeWidth={2.5} />
				</button>

				<p className="mt-3.5 text-center text-[11px] tracking-[0.3px] text-black/35">
					Free shipping · Worldwide delivery
				</p>
			</div>
		</>
	);
}
