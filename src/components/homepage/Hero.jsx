// HeroSection.jsx — clean hero section with bestsellers slider
// Headers and popups are now managed at the layout level.

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { PRODUCTS } from "../../store/productSlice";

/* ─── DATA ─────────────────────────────────────────────────────────── */
const products = PRODUCTS;

/* ─── PRODUCT CARD ──────────────────────────────────────────────────── */
function ProductCard({ product, onClick }) {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={onClick}
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
					className="mix-blend-multiply"
				/>
			</div>
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
						{product.size}
					</span>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onClick();
						}}
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
	const navigate = useNavigate();

	const startXPos = useRef(0);
	const startYPos = useRef(0);
	const hasDragged = useRef(false);

	const onPointerDown = (e) => {
		if (e.button !== 0) return; // only left click
		isDragging.current = true;
		startX.current = e.clientX - trackRef.current.offsetLeft;
		scrollLeft.current = trackRef.current.scrollLeft;

		startXPos.current = e.clientX;
		startYPos.current = e.clientY;
		hasDragged.current = false;

		trackRef.current.style.cursor = "grabbing";
	};

	useEffect(() => {
		const handlePointerMove = (e) => {
			if (!isDragging.current) return;
			const dx = Math.abs(e.clientX - startXPos.current);
			const dy = Math.abs(e.clientY - startYPos.current);

			// If moved more than 5px, it's a drag (so suppress click action)
			if (dx > 5 || dy > 5) {
				hasDragged.current = true;
			}

			const x = e.clientX - trackRef.current.offsetLeft;
			trackRef.current.scrollLeft =
				scrollLeft.current - (x - startX.current) * 1.2;
		};

		const handlePointerUp = () => {
			if (!isDragging.current) return;
			isDragging.current = false;
			if (trackRef.current) trackRef.current.style.cursor = "grab";
		};

		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);

		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
		};
	}, []);

	const scrollTo = (dir) => {
		trackRef.current.scrollBy({
			left: dir * (200 + 14),
			behavior: "smooth",
		});
	};

	const handleScroll = () => {
		if (trackRef.current) {
			setActiveIdx(
				Math.round(trackRef.current.scrollLeft / (200 + 14)),
			);
		}
	};

	return (
		<div style={{ position: "relative", width: "100%" }}>
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

			<div
				ref={trackRef}
				onPointerDown={onPointerDown}
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
					<ProductCard
						key={p.id}
						product={p}
						onClick={() => {
							if (!hasDragged.current) {
								navigate(`/product/${p.id}`);
							}
						}}
					/>
				))}
				<div style={{ flex: "0 0 8px" }} />
			</div>

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
	const navigate = useNavigate();

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
        .hero-inner { display:flex; flex-direction:row; align-items:center; height:100%; padding:100px 40px 40px; gap:40px; }
        .hero-copy   { flex:1; display:flex; flex-direction:column; justify-content:center; }
        .slider-wrap { width:clamp(260px,38%,480px); flex-shrink:0; }
        @media(max-width:768px) {
          .hero-inner { flex-direction:column; justify-content:flex-start; padding:100px 20px 24px; gap:0; overflow-y:auto; }
          .hero-copy { width:100%; padding-bottom:0; align-items:center; text-align:center; }
          .hero-copy h1 { font-size:clamp(2.2rem,8vw,3rem) !important; margin-bottom:16px !important; }
          .hero-copy p { font-size:14px !important; margin-bottom:28px !important; }
          .slider-wrap { width:100%; padding-top:32px; flex-shrink:0; }
        }
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

					{/* Overlay */}
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(135deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.15) 55%,rgba(0,0,0,0.08) 100%)",
							pointerEvents: "none",
						}}
					/>

					<div
						className="hero-inner"
						style={{ position: "relative", zIndex: 10 }}
					>
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

							<button
								onClick={() => navigate("/product/1")}
								className="group relative overflow-hidden rounded-full bg-white p-[1px] shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] w-fit"
							>
								<div className="absolute right-0 top-0 h-full w-0 rounded-full bg-[#9B6BFF] transition-all duration-500 ease-out group-hover:left-0 group-hover:w-full" />
								<div className="relative z-10 flex items-center rounded-full bg-white group-hover:bg-transparent transition-colors duration-500">
									<span className="pl-[22px] font-semibold text-sm tracking-[0.2px] text-[#0f0f0f] transition-colors duration-500 group-hover:text-white">
										Shop Fragrances
									</span>
									<div className="ml-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#9B6BFF] shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors duration-500 group-hover:bg-white">
										<ArrowUpRight
											size={20}
											strokeWidth={2.3}
											className="text-white transition-colors duration-500 group-hover:text-[#9B6BFF]"
										/>
									</div>
								</div>
							</button>
						</div>

						<div className="slider-wrap">
							<ProductSlider />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
