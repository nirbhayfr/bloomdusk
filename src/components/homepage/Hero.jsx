// HeroSection.jsx
import {
	ArrowUpRight,
	ChevronLeft,
	ChevronRight,
	Menu,
	X,
	Search,
	ShoppingBag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ─── DATA ─────────────────────────────────────────────────────────── */
const products = [
	{
		id: 1,
		name: "Marine Noir",
		category: "Hawas",
		price: "50ml",
		bg: "#ffffff",
		accent: "#111111",
		textColor: "#111111",
		subColor: "#666666",
		image: "/p-1.png",
	},
	{
		id: 2,
		name: "Ivory Oud",
		category: "White Oud BV",
		price: "50ml",
		bg: "#ffffff",
		accent: "#111111",
		textColor: "#111111",
		subColor: "#666666",
		image: "/p-2.png",
	},
	{
		id: 3,
		name: "Pink Veil",
		category: "Gucci Flora",
		price: "50ml",
		bg: "#ffffff",
		accent: "#111111",
		textColor: "#111111",
		subColor: "#666666",
		image: "/p-3.png",
	},
];

const NAV_LINKS = ["Shop", "Collections", "Blog", "Support"];

/* ─── HEADER ────────────────────────────────────────────────────────── */
function Header() {
	const [open, setOpen] = useState(false);
	const [cartCount] = useState(0);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<>
			<style>{`
        @keyframes drawerIn  { from { transform:translateX(100%); opacity:0 } to { transform:translateX(0);   opacity:1 } }
        @keyframes drawerOut { from { transform:translateX(0);   opacity:1 } to { transform:translateX(100%); opacity:0 } }
        @keyframes overlayIn { from { opacity:0 } to { opacity:1 } }
        .drawer-link {
          font-family:'DM Sans',sans-serif;
          font-size:28px; font-weight:600;
          letter-spacing:-0.04em;
          color:#0f0f0f;
          text-decoration:none;
          display:block;
          padding:10px 0;
          transition:color 0.2s ease;
          cursor:pointer;
          border-bottom:1px solid rgba(0,0,0,0.06);
        }
        .drawer-link:last-child { border-bottom:none; }
        .drawer-link:hover { color:#9b6bff; }
        .hdr-link {
          font-size:14px; font-weight:500; color:#000;
          text-decoration:none; transition:opacity 0.2s;
        }
        .hdr-link:hover { opacity:0.55; }
      `}</style>

			{/* ── Pill navbar — fixed top-left ── */}
			<header className="fixed top-8 left-8 z-50">
				<nav className="flex items-center gap-5 rounded-2xl bg-[#F9F6FE] backdrop-blur-xl px-5 h-[64px] shadow-sm border border-white/40">
					{/* Logo */}
					<img src="/logo.png" alt="logo" className="w-28" />

					{/* Desktop nav links */}
					<div className="hidden md:flex items-center gap-7">
						{NAV_LINKS.map((l) => (
							<a key={l} href="#" className="hdr-link">
								{l}
							</a>
						))}
					</div>

					{/* Icons — always visible */}
					<div className="flex items-center gap-4 ml-1">
						<button className="flex items-center justify-center">
							<Search
								size={19}
								strokeWidth={2.3}
								className="text-black"
							/>
						</button>

						<div className="relative">
							<ShoppingBag
								size={19}
								strokeWidth={2.3}
								className="text-black"
							/>
							<div className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-[#e7def8] text-[9px] font-semibold text-black">
								{cartCount}
							</div>
						</div>

						{/* Mobile hamburger — only on small screens */}
						<button
							onClick={() => setOpen(true)}
							className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl bg-black/[0.07] border border-black/10"
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

			{/* ── Drawer overlay ── */}
			{open && (
				<div
					onClick={() => setOpen(false)}
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 90,
						background: "rgba(0,0,0,0.4)",
						backdropFilter: "blur(6px)",
						animation: "overlayIn 0.3s ease",
					}}
				/>
			)}

			{/* ── Drawer panel ── */}
			<div
				style={{
					position: "fixed",
					top: 0,
					right: 0,
					bottom: 0,
					width: "min(320px,85vw)",
					zIndex: 100,
					background: "#F9F6FE",
					padding: "32px 28px",
					display: "flex",
					flexDirection: "column",
					animation: open
						? "drawerIn 0.4s cubic-bezier(0.22,1,0.36,1)"
						: "drawerOut 0.35s ease forwards",
					pointerEvents: open ? "auto" : "none",
				}}
			>
				{/* Drawer header */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "40px",
					}}
				>
					<img src="/logo.png" alt="logo" className="w-28" />
					<button
						onClick={() => setOpen(false)}
						style={{
							width: "36px",
							height: "36px",
							borderRadius: "12px",
							background: "rgba(15,15,15,0.07)",
							border: "1px solid rgba(15,15,15,0.1)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
						}}
					>
						<X size={16} color="#0f0f0f" strokeWidth={2.5} />
					</button>
				</div>

				{/* Links */}
				<nav style={{ flex: 1 }}>
					{NAV_LINKS.map((l) => (
						<div
							key={l}
							className="drawer-link"
							onClick={() => setOpen(false)}
						>
							{l}
						</div>
					))}
				</nav>

				{/* Bottom CTA */}
				<button
					onClick={() => setOpen(false)}
					style={{
						width: "100%",
						padding: "16px",
						borderRadius: "16px",
						background: "#0f0f0f",
						color: "#fff",
						fontFamily: "'DM Sans',sans-serif",
						fontSize: "14px",
						fontWeight: 700,
						border: "none",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "10px",
					}}
				>
					Shop Now <ArrowUpRight size={16} strokeWidth={2.5} />
				</button>

				<p
					style={{
						fontFamily: "'DM Sans',sans-serif",
						fontSize: "11px",
						color: "rgba(15,15,15,0.35)",
						textAlign: "center",
						marginTop: "14px",
						letterSpacing: "0.3px",
					}}
				>
					Free shipping · Worldwide delivery
				</p>
			</div>
		</>
	);
}

/* ─── PRODUCT CARD ──────────────────────────────────────────────────── */
function ProductCard({ product }) {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				flex: "0 0 200px",
				borderRadius: "20px",
				overflow: "hidden",
				background: product.bg,
				border: `1px solid ${product.accent}28`,
				boxShadow: hovered
					? `0 20px 52px rgba(0,0,0,0.16), 0 0 0 1px ${product.accent}22`
					: "0 4px 20px rgba(0,0,0,0.08)",
				transform: hovered
					? "translateY(-8px) scale(1.02)"
					: "translateY(0) scale(1)",
				transition:
					"transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
				cursor: "pointer",
				userSelect: "none",
				position: "relative",
			}}
		>
			{/* Glow orb */}
			<div
				style={{
					position: "absolute",
					top: "15%",
					left: "50%",
					transform: "translateX(-50%)",
					width: "90px",
					height: "90px",
					borderRadius: "50%",
					background: product.accent,
					opacity: hovered ? 0.1 : 0.05,
					filter: "blur(28px)",
					transition: "opacity 0.4s ease",
					pointerEvents: "none",
				}}
			/>

			{/* Image */}
			<div
				style={{
					padding: "22px 18px 10px",
					display: "flex",
					justifyContent: "center",
					position: "relative",
				}}
			>
				<img
					src={product.image}
					alt={product.name}
					draggable={false}
					style={{
						width: "120px",
						height: "120px",
						objectFit: "contain",
						transform: hovered
							? "scale(1.08) translateY(-4px)"
							: "scale(1)",
						transition:
							"transform 0.4s cubic-bezier(0.22,1,0.36,1)",
						filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.12))",
					}}
				/>
			</div>

			{/* Info */}
			<div style={{ padding: "8px 16px 18px" }}>
				<p
					style={{
						fontFamily: "'DM Sans',sans-serif",
						fontSize: "10px",
						fontWeight: 700,
						letterSpacing: "2px",
						textTransform: "uppercase",
						color: product.accent,
						margin: "0 0 3px",
					}}
				>
					{product.category}
				</p>
				<p
					style={{
						fontFamily: "'DM Sans',sans-serif",
						fontSize: "16px",
						fontWeight: 800,
						color: product.textColor,
						margin: "0 0 12px",
						letterSpacing: "-0.02em",
					}}
				>
					{product.name}
				</p>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<span
						style={{
							fontFamily: "'DM Sans',sans-serif",
							fontSize: "11px",
							color: product.subColor,
							fontWeight: 500,
						}}
					>
						{product.price}
					</span>
					<button
						style={{
							width: "30px",
							height: "30px",
							borderRadius: "50%",
							background: hovered
								? product.accent
								: "rgba(0,0,0,0.06)",
							border: `1px solid ${hovered ? product.accent : "rgba(0,0,0,0.10)"}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							transition: "all 0.3s ease",
						}}
					>
						<ArrowUpRight
							size={13}
							color={hovered ? "#fff" : product.subColor}
							strokeWidth={2.5}
						/>
					</button>
				</div>
			</div>
		</div>
	);
}

/* ─── PRODUCT SLIDER ─────────────────────────────────────────────────── */
function ProductSlider() {
	const trackRef = useRef(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);
	const [activeIdx, setActiveIdx] = useState(0);

	const onPointerDown = (e) => {
		isDragging.current = true;
		startX.current = e.clientX - trackRef.current.offsetLeft;
		scrollLeft.current = trackRef.current.scrollLeft;
		trackRef.current.style.cursor = "grabbing";
		trackRef.current.setPointerCapture(e.pointerId);
	};
	const onPointerMove = (e) => {
		if (!isDragging.current) return;
		e.preventDefault();
		const x = e.clientX - trackRef.current.offsetLeft;
		const walk = (x - startX.current) * 1.2;
		trackRef.current.scrollLeft = scrollLeft.current - walk;
	};
	const stopDrag = () => {
		isDragging.current = false;
		if (trackRef.current) trackRef.current.style.cursor = "grab";
	};
	const scrollTo = (dir) => {
		trackRef.current.scrollBy({
			left: dir * (200 + 14),
			behavior: "smooth",
		});
	};
	const handleScroll = () => {
		const cardW = 200 + 14;
		setActiveIdx(Math.round(trackRef.current.scrollLeft / cardW));
	};

	return (
		<div style={{ position: "relative", width: "100%" }}>
			{/* Label row */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "14px",
					padding: "0 4px",
				}}
			>
				<div>
					<p
						style={{
							fontFamily: "'DM Sans',sans-serif",
							fontSize: "10px",
							fontWeight: 700,
							letterSpacing: "2.5px",
							textTransform: "uppercase",
							color: "rgba(255,255,255,0.45)",
							margin: "0 0 2px",
						}}
					>
						BloomDusk · Signature
					</p>
					<h3
						style={{
							fontFamily: "'DM Sans',sans-serif",
							fontSize: "17px",
							fontWeight: 800,
							color: "#fff",
							margin: 0,
							letterSpacing: "-0.02em",
						}}
					>
						Bestsellers
					</h3>
				</div>

				<div style={{ display: "flex", gap: "8px" }}>
					{[-1, 1].map((dir) => {
						const Icon =
							dir === -1 ? ChevronLeft : ChevronRight;
						return (
							<button
								key={dir}
								onClick={() => scrollTo(dir)}
								style={{
									width: "32px",
									height: "32px",
									borderRadius: "50%",
									background:
										"rgba(155,107,255,0.15)",
									border: "1px solid rgba(155,107,255,0.3)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
									color: "rgba(255,255,255,0.7)",
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background =
										"rgba(155,107,255,0.35)";
									e.currentTarget.style.color =
										"#fff";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background =
										"rgba(155,107,255,0.15)";
									e.currentTarget.style.color =
										"rgba(255,255,255,0.7)";
								}}
							>
								<Icon size={15} strokeWidth={2.5} />
							</button>
						);
					})}
				</div>
			</div>

			{/* Track */}
			<div
				ref={trackRef}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={stopDrag}
				onPointerCancel={stopDrag}
				onScroll={handleScroll}
				style={{
					display: "flex",
					gap: "14px",
					overflowX: "auto",
					scrollbarWidth: "none",
					msOverflowStyle: "none",
					cursor: "grab",
					paddingBottom: "4px",
					WebkitOverflowScrolling: "touch",
					touchAction: "pan-x",
				}}
			>
				{products.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
				<div style={{ flex: "0 0 8px" }} />
			</div>

			{/* Dots */}
			<div
				style={{
					display: "flex",
					gap: "6px",
					marginTop: "14px",
					justifyContent: "center",
				}}
			>
				{products.map((_, i) => (
					<div
						key={i}
						style={{
							width: i === activeIdx ? "20px" : "6px",
							height: "6px",
							borderRadius: "3px",
							background:
								i === activeIdx
									? "#9b6bff"
									: "rgba(255,255,255,0.35)",
							transition: "all 0.3s ease",
						}}
					/>
				))}
			</div>
		</div>
	);
}

/* ─── HERO SECTION ───────────────────────────────────────────────────── */
export default function HeroSection() {
	const heroRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(".hero-title", {
				y: 70,
				opacity: 0,
				duration: 1.2,
				delay: 0.1,
				ease: "power4.out",
			});
			gsap.from(".hero-text", {
				y: 40,
				opacity: 0,
				duration: 1,
				delay: 0.25,
				ease: "power3.out",
			});
			gsap.from(".hero-btn", {
				y: 30,
				opacity: 0,
				duration: 1,
				delay: 0.4,
				ease: "power3.out",
			});
			gsap.from(".slider-wrap", {
				y: 50,
				opacity: 0,
				duration: 1.1,
				delay: 0.55,
				ease: "power3.out",
			});
		}, heroRef);
		return () => ctx.revert();
	}, []);

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900&display=swap');

        *, *::before, *::after { box-sizing:border-box; }

        /* Hero layout */
        .hero-inner {
          display:flex;
          flex-direction:row;
          align-items:center;
          height:100%;
          padding:80px 40px 40px;
          gap:40px;
        }
        .hero-copy   { flex:1; display:flex; flex-direction:column; justify-content:center; }
        .slider-wrap { width:clamp(260px,38%,480px); flex-shrink:0; }

        @media(max-width:768px) {
          .hero-inner {
            flex-direction:column;
            justify-content:flex-start;
            padding:80px 20px 24px;
            gap:0;
            overflow-y:auto;
          }
          .hero-copy {
            width:100%;
            padding-bottom:0;
            align-items:center;
            text-align:center;
          }
          .hero-copy h1   { font-size:clamp(2.2rem,8vw,3rem) !important; margin-bottom:16px !important; }
          .hero-copy p    { font-size:14px !important; margin-bottom:28px !important; }
          .slider-wrap {
            width:100%;
            padding-top:32px;
            flex-shrink:0;
          }
        }

        /* Hide webkit scrollbar on slider */
        div::-webkit-scrollbar { display:none; }
      `}</style>

			<section
				ref={heroRef}
				style={{
					background: "#f3f1f4",
					padding: "8px",
					height: "100svh",
					overflow: "hidden",
				}}
				className="min-h-[800px]"
			>
				<div
					style={{
						position: "relative",
						height: "100%",
						width: "100%",
						overflow: "hidden",
						borderRadius: "28px",
					}}
				>
					{/* Background video */}
					<video
						autoPlay
						muted
						loop
						playsInline
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					>
						<source src="/vid.mp4" type="video/mp4" />
					</video>

					{/* Subtle overlay for readability */}
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(135deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.15) 55%,rgba(0,0,0,0.08) 100%)",
							pointerEvents: "none",
						}}
					/>

					{/* Header */}
					<Header />

					{/* Main layout */}
					<div
						className="hero-inner"
						style={{ position: "relative", zIndex: 10 }}
					>
						{/* LEFT / TOP — copy */}
						<div className="hero-copy">
							<h1
								className="hero-title"
								style={{
									fontFamily: "'DM Sans',sans-serif",
									fontSize:
										"clamp(2.6rem,4.5vw,4.2rem)",
									fontWeight: 500,
									lineHeight: 0.92,
									letterSpacing: "-0.05em",
									color: "#0f0f0f",
									margin: "0 0 20px",
									maxWidth: "480px",
								}}
							>
								The{" "}
								<span style={{ color: "#9b6bff" }}>
									beautiful
								</span>{" "}
								way to wear your story.
							</h1>

							<p
								className="hero-text"
								style={{
									fontFamily: "'DM Sans',sans-serif",
									fontSize: "15px",
									fontWeight: 500,
									color: "rgba(15,15,15,0.6)",
									maxWidth: "380px",
									lineHeight: 1.65,
									margin: "0 0 36px",
								}}
							>
								Luxury fragrances crafted for the ones
								who bloom in the dark. Discover scents
								that linger long after you've left the
								room.
							</p>

							{/* CTA */}
							<div className="hero-btn">
								<button
									style={{
										border: "none",
										cursor: "pointer",
										background: "white",
										borderRadius: "999px",
										padding: "1px",
										boxShadow:
											"0 2px 12px rgba(0,0,0,0.12)",
										transition:
											"box-shadow 0.3s ease, transform 0.3s ease",
										position: "relative",
										overflow: "hidden",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.boxShadow =
											"0 6px 24px rgba(0,0,0,0.18)";
										e.currentTarget.style.transform =
											"translateY(-1px)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.boxShadow =
											"0 2px 12px rgba(0,0,0,0.12)";
										e.currentTarget.style.transform =
											"translateY(0)";
									}}
								>
									<div
										style={{
											position: "absolute",
											inset: 0,
											borderRadius: "999px",
											background:
												"linear-gradient(to right,rgba(0,0,0,0.12),rgba(0,0,0,0.04),rgba(0,0,0,0.12))",
											opacity: 0.6,
										}}
									/>
									<div
										style={{
											position: "relative",
											zIndex: 1,
											display: "flex",
											alignItems: "center",
											borderRadius: "999px",
										}}
									>
										<span
											style={{
												paddingLeft: "22px",
												fontFamily:
													"'DM Sans',sans-serif",
												fontSize: "13px",
												fontWeight: 700,
												color: "#0f0f0f",
												letterSpacing:
													"0.2px",
											}}
										>
											Shop Fragrances
										</span>
										<div
											style={{
												marginLeft: "20px",
												width: "48px",
												height: "48px",
												borderRadius: "50%",
												background:
													"#0f0f0f",
												display: "flex",
												alignItems:
													"center",
												justifyContent:
													"center",
												boxShadow:
													"0 4px 20px rgba(0,0,0,0.2)",
											}}
										>
											<ArrowUpRight
												size={20}
												strokeWidth={2.3}
												color="#fff"
											/>
										</div>
									</div>
								</button>
							</div>
						</div>

						{/* RIGHT / BOTTOM — slider */}
						<div className="slider-wrap">
							<ProductSlider />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
