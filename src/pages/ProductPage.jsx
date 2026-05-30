// ProductPage.jsx — Tailwind CSS version with background video
// Uses React Router & Redux. Requires: gsap, lucide-react, tailwindcss

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
	ArrowLeft,
	ArrowUpRight,
	Minus,
	Plus,
	ShoppingBag,
	Heart,
	Share2,
	Star,
	ChevronDown,
	Truck,
	RotateCcw,
	ShieldCheck,
} from "lucide-react";
import gsap from "gsap";
import { selectProductById, selectAllProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";

/* ─── STARS ─────────────────────────────────────────────────────────── */
function Stars({ rating }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((s) => (
				<Star
					key={s}
					size={13}
					strokeWidth={0}
					fill={
						s <= Math.round(rating)
							? "#9b6bff"
							: "rgba(155,107,255,0.2)"
					}
				/>
			))}
		</div>
	);
}

/* ─── ACCORDION ─────────────────────────────────────────────────────── */
function Accordion({ label, children, defaultOpen = false }) {
	const [open, setOpen] = useState(defaultOpen);
	const bodyRef = useRef(null);

	useEffect(() => {
		const el = bodyRef.current;
		if (open) {
			gsap.fromTo(
				el,
				{ height: 0, opacity: 0 },
				{
					height: "auto",
					opacity: 1,
					duration: 0.35,
					ease: "power3.out",
				},
			);
		} else {
			gsap.to(el, {
				height: 0,
				opacity: 0,
				duration: 0.28,
				ease: "power3.in",
			});
		}
	}, [open]);

	return (
		<div className="border-b border-black/[0.07]">
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full flex items-center justify-between py-4 bg-transparent border-none cursor-pointer text-left"
			>
				<span className="font-bold text-sm text-[#0f0f0f] tracking-[-0.01em]">
					{label}
				</span>
				<ChevronDown
					size={16}
					strokeWidth={2.3}
					className="text-[#9b6bff] flex-shrink-0 transition-transform duration-300"
					style={{
						transform: open
							? "rotate(180deg)"
							: "rotate(0deg)",
					}}
				/>
			</button>
			<div
				ref={bodyRef}
				className="overflow-hidden"
				style={{ height: 0, opacity: 0 }}
			>
				<div className="pb-4">{children}</div>
			</div>
		</div>
	);
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function ProductPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const product =
		useSelector(selectProductById(Number(id))) ||
		useSelector(selectAllProducts)[0];

	const [activeImg, setActiveImg] = useState(0);
	const [qty, setQty] = useState(1);
	const [wished, setWished] = useState(false);
	const [addedToCart, setAddedToCart] = useState(false);

	const pageRef = useRef(null);
	const imgRef = useRef(null);

	useEffect(() => {
		setActiveImg(0);
		setQty(1);
	}, [id]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(".pdp-breadcrumb", {
				y: -10,
				opacity: 0,
				duration: 0.5,
				delay: 0.05,
				ease: "power3.out",
			});
			gsap.from(".pdp-gallery", {
				x: -30,
				opacity: 0,
				duration: 0.8,
				delay: 0.1,
				ease: "power4.out",
			});
			gsap.from(".pdp-info", {
				x: 30,
				opacity: 0,
				duration: 0.8,
				delay: 0.2,
				ease: "power4.out",
			});
		}, pageRef);
		return () => ctx.revert();
	}, [id]);

	if (!product) return null;

	const switchImage = (idx) => {
		if (idx === activeImg) return;
		gsap.to(imgRef.current, {
			scale: 0.93,
			opacity: 0,
			duration: 0.18,
			ease: "power2.in",
			onComplete: () => {
				setActiveImg(idx);
				gsap.to(imgRef.current, {
					scale: 1,
					opacity: 1,
					duration: 0.3,
					ease: "power3.out",
				});
			},
		});
	};

	const handleAddToCart = () => {
		dispatch(addToCart({ product, qty }));
		setAddedToCart(true);
		setTimeout(() => setAddedToCart(false), 2200);
	};

	const handleBack = () => {
		window.history.length > 1 ? navigate(-1) : navigate("/");
	};

	const discountPct = product.originalPrice
		? Math.round((1 - product.price / product.originalPrice) * 100)
		: null;

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
				* { font-family: 'DM Sans', sans-serif; }
			`}</style>

			{/* ── PAGE SHELL with background video ── */}
			<div
				ref={pageRef}
				className="relative min-h-screen bg-[#f3f1f4] overflow-hidden pt-[100px] pb-10 px-5 md:px-8"
			>
				{/* Background video */}
				<video
					autoPlay
					muted
					loop
					playsInline
					className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
				>
					<source src="/vid.mp4" type="video/mp4" />
				</video>

				{/* ── CARD ── */}
				<div className="relative z-10 mx-auto bg-[#F9F6FE] rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] mt-6">
					{/* BREADCRUMB */}
					<div className="pdp-breadcrumb flex flex-wrap items-center gap-2 px-6 md:px-8 pt-6">
						<button
							onClick={handleBack}
							className="flex items-center gap-1.5 bg-[rgba(155,107,255,0.08)] border border-[rgba(155,107,255,0.18)] rounded-full py-1 pl-2 pr-3 text-[#9b6bff] text-xs font-semibold mr-1 hover:bg-[rgba(155,107,255,0.14)] transition-colors cursor-pointer"
						>
							<ArrowLeft size={13} strokeWidth={2.5} />
							Back
						</button>
						<span className="text-xs text-black/35">
							Shop
						</span>
						<span className="text-xs text-black/25">·</span>
						<span className="text-xs text-black/35">
							{product.category}
						</span>
						<span className="text-xs text-black/25">·</span>
						<span className="text-xs text-[#9b6bff] font-semibold">
							{product.name}
						</span>
					</div>

					{/* MAIN GRID */}
					<div className="grid grid-cols-1 md:grid-cols-2 min-h-[540px]">
						{/* ── LEFT: Gallery ── */}
						<div className="pdp-gallery flex gap-3.5 p-5 md:p-7 flex-col-reverse md:flex-row">
							{/* Thumbnails */}
							<div className="flex flex-row md:flex-col gap-2.5">
								{product.images.map((src, i) => (
									<button
										key={i}
										onClick={() => switchImage(i)}
										className={[
											"w-[60px] h-[60px] rounded-[14px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer",
											i === activeImg
												? "border-[#9b6bff] scale-[1.04] shadow-[0_4px_16px_rgba(155,107,255,0.18)]"
												: "border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white",
										].join(" ")}
										style={{
											background:
												i === activeImg
													? product.bg
													: "#fff",
										}}
									>
										<img
											src={src}
											alt={`view-${i}`}
											className="w-[46px] h-[46px] object-contain drop-shadow-sm"
										/>
									</button>
								))}
							</div>

							{/* Main image */}
							<div
								className="flex-1 rounded-[20px] overflow-hidden flex items-center justify-center relative min-h-[260px] md:min-h-[380px]"
								style={{ background: product.bg }}
							>
								<div className="absolute w-[200px] h-[200px] rounded-full bg-[#9b6bff] opacity-[0.07] blur-[60px] pointer-events-none" />
								<img
									ref={imgRef}
									src={product.images[activeImg]}
									alt={product.name}
									draggable={false}
									className="w-4/5 max-w-[280px] object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.14)] relative z-10 mix-blend-multiply"
								/>
								<span className="absolute top-4 right-4 bg-[#9b6bff] text-white text-[10px] font-extrabold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full">
									{product.size}
								</span>
							</div>
						</div>

						{/* ── RIGHT: Info ── */}
						<div className="pdp-info flex flex-col px-6 md:px-8 py-7 md:py-8 overflow-y-auto">
							{/* Category + actions */}
							<div className="flex items-center justify-between mb-2">
								<span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#9b6bff]">
									{product.category}
								</span>
								<div className="flex gap-2">
									{[
										{
											icon: Share2,
											label: "share",
											active: false,
											onClick: () => {},
										},
										{
											icon: Heart,
											label: "wish",
											active: wished,
											onClick: () =>
												setWished(
													(w) => !w,
												),
										},
									].map(
										({
											icon: Icon,
											label,
											active,
											onClick,
										}) => (
											<button
												key={label}
												onClick={onClick}
												className={[
													"w-[34px] h-[34px] rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer",
													active
														? "bg-[rgba(155,107,255,0.12)] border-[rgba(155,107,255,0.3)]"
														: "bg-black/5 border-black/[0.08]",
												].join(" ")}
											>
												<Icon
													size={14}
													strokeWidth={2}
													fill={
														active
															? "#9b6bff"
															: "none"
													}
													color={
														active
															? "#9b6bff"
															: "#666"
													}
												/>
											</button>
										),
									)}
								</div>
							</div>

							{/* Name */}
							<h1 className="text-[clamp(26px,3vw,36px)] font-black tracking-[-0.04em] text-[#0f0f0f] leading-none mb-2.5">
								{product.name}
							</h1>

							{/* Rating */}
							<div className="flex items-center gap-2 mb-4">
								<Stars rating={product.rating} />
								<span className="text-[13px] font-bold text-[#0f0f0f]">
									{product.rating}
								</span>
								<span className="text-xs text-black/40">
									({product.reviews} reviews)
								</span>
							</div>

							{/* Price */}
							<div className="flex items-baseline gap-2.5 mb-3.5">
								<span className="text-[28px] font-black tracking-[-0.04em] text-[#0f0f0f]">
									₹{product.price}
								</span>
								{product.originalPrice && (
									<span className="text-[15px] font-medium text-black/35 line-through">
										₹{product.originalPrice}
									</span>
								)}
								{discountPct && (
									<span className="text-[11px] font-bold text-[#9b6bff] bg-[rgba(155,107,255,0.1)] border border-[rgba(155,107,255,0.2)] rounded-full px-2 py-0.5">
										{discountPct}% OFF
									</span>
								)}
							</div>

							{/* Description */}
							<p className="text-[13.5px] leading-[1.7] text-black/60 mb-4 italic">
								{product.description}
							</p>

							{/* Tags */}
							<div className="flex flex-wrap gap-1.5 mb-5">
								{product.tags.map((tag) => (
									<span
										key={tag}
										className="text-[11px] font-semibold text-black/55 bg-black/5 border border-black/[0.08] rounded-full px-2.5 py-1 tracking-[0.2px]"
									>
										{tag}
									</span>
								))}
							</div>

							{/* Qty + Add to Cart */}
							<div className="flex gap-2.5 items-center mb-2.5">
								<div className="flex items-center bg-black/[0.04] border border-black/[0.08] rounded-[14px] p-1 flex-shrink-0">
									<button
										onClick={() =>
											setQty((q) =>
												Math.max(1, q - 1),
											)
										}
										className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-none cursor-pointer text-[#0f0f0f] hover:bg-black/[0.06] transition-colors"
									>
										<Minus
											size={13}
											strokeWidth={2.5}
										/>
									</button>
									<span className="text-sm font-extrabold text-[#0f0f0f] min-w-[28px] text-center">
										{qty}
									</span>
									<button
										onClick={() =>
											setQty((q) => q + 1)
										}
										className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-transparent border-none cursor-pointer text-[#0f0f0f] hover:bg-black/[0.06] transition-colors"
									>
										<Plus
											size={13}
											strokeWidth={2.5}
										/>
									</button>
								</div>

								<button
									onClick={handleAddToCart}
									className={[
										"flex-1 h-11 rounded-[14px] flex items-center justify-center gap-2 text-white text-[13px] font-extrabold tracking-[-0.01em] cursor-pointer border-none transition-all duration-300",
										addedToCart
											? "bg-[#22c55e]"
											: "bg-[#0f0f0f] hover:bg-[#9b6bff]",
									].join(" ")}
								>
									{addedToCart ? (
										<>&#10003; Added to Cart</>
									) : (
										<>
											<ShoppingBag
												size={15}
												strokeWidth={2.3}
											/>{" "}
											Add to Cart
										</>
									)}
								</button>
							</div>

							{/* Buy Now */}
							<button
								onClick={() => {
									dispatch(
										addToCart({ product, qty }),
									);
									navigate("/");
								}}
								className="w-full h-11 rounded-[14px] bg-transparent border-[1.5px] border-[rgba(155,107,255,0.35)] text-[#9b6bff] text-[13px] font-bold tracking-[-0.01em] flex items-center justify-center gap-2 cursor-pointer mb-5 transition-all duration-200 hover:bg-[rgba(155,107,255,0.07)] hover:border-[#9b6bff]"
							>
								Buy Now
								<ArrowUpRight
									size={14}
									strokeWidth={2.5}
								/>
							</button>

							{/* Accordions */}
							<div>
								<Accordion
									label="Fragrance Notes"
									defaultOpen
								>
									<div className="flex flex-col gap-3">
										{Object.entries(
											product.notes,
										).map(([tier, noteList]) => (
											<div
												key={tier}
												className="flex items-start gap-3"
											>
												<span className="text-[10px] font-bold tracking-[1.5px] uppercase text-black/35 pt-[3px] min-w-[38px]">
													{tier}
												</span>
												<div className="flex flex-wrap gap-1.5">
													{noteList.map(
														(
															note,
														) => (
															<span
																key={
																	note
																}
																className="text-xs font-semibold text-[#0f0f0f] rounded-full px-2.5 py-1"
																style={{
																	background:
																		"#F0E8FE",
																}}
															>
																{
																	note
																}
															</span>
														),
													)}
												</div>
											</div>
										))}
									</div>
								</Accordion>

								<Accordion label="Shipping & Returns">
									<p className="text-[13px] leading-[1.75] text-black/55 m-0">
										Free worldwide shipping on
										orders over $60. Standard
										delivery in 5–7 business days.
										Express available at checkout.
										Returns accepted within 30
										days of delivery — unused and
										in original packaging.
									</p>
								</Accordion>

								<Accordion label="How to Wear">
									<p className="text-[13px] leading-[1.75] text-black/55 m-0">
										Apply to pulse points —
										wrists, neck, and behind the
										ears. Layer on moisturised
										skin for longevity. For a
										subtler effect, spray into the
										air and walk through the mist.
									</p>
								</Accordion>
							</div>
						</div>
					</div>

					{/* FEATURE STRIP */}
					<div className="grid grid-cols-2 md:grid-cols-3 border-t border-[rgba(155,107,255,0.12)]">
						{[
							{
								icon: RotateCcw,
								label: "30-Day Returns",
								sub: "Hassle-free returns",
							},
							{
								icon: Truck,
								label: "Free Shipping",
								sub: "On orders over  ₹999",
							},
							{
								icon: ShieldCheck,
								label: "Authentic",
								sub: "100% genuine product",
							},
						].map(({ icon: Icon, label, sub }, i) => (
							<div
								key={label}
								className={[
									"flex flex-col items-center gap-2 py-5 px-4 text-center",
									i === 0
										? "border-r border-[rgba(155,107,255,0.12)]"
										: "",
									i === 1
										? "md:border-r border-[rgba(155,107,255,0.12)]"
										: "",
									i === 2
										? "col-span-2 md:col-span-1 border-t md:border-t-0"
										: "",
								].join(" ")}
							>
								<div className="w-[38px] h-[38px] rounded-[12px] bg-[rgba(155,107,255,0.08)] border border-[rgba(155,107,255,0.15)] flex items-center justify-center">
									<Icon
										size={16}
										strokeWidth={2}
										className="text-[#9b6bff]"
									/>
								</div>
								<div>
									<p className="text-xs font-extrabold text-[#0f0f0f] m-0 tracking-[-0.01em]">
										{label}
									</p>
									<p className="text-[11px] text-black/40 mt-0.5 m-0 font-medium">
										{sub}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
