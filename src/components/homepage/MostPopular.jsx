import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";

const products = [
	{
		id: 1,
		name: "Marine Noir",
		category: "Hawas",
		price: "50ml",
		description:
			"Fresh aquatic accords blended with deep amber and marine woods.",
		notes: ["Amber", "Marine", "Musk"],
		bg: "#eef3f8",
		image: "/p-1.png",
	},

	{
		id: 2,
		name: "Ivory Oud",
		category: "White Oud BV",
		price: "50ml",
		description:
			"Elegant oud signature layered with creamy woods and saffron.",
		notes: ["Oud", "Saffron", "Vanilla"],
		bg: "#f8f4ee",
		image: "/p-2.png",
	},

	{
		id: 3,
		name: "Pink Veil",
		category: "Gucci Flora",
		price: "50ml",
		description:
			"Soft floral bouquet wrapped in powdery rose and jasmine.",
		notes: ["Rose", "Jasmine", "Peony"],
		bg: "#f8eef0",
		image: "/p-3.png",
	},
];

function ProductCard({ product, index }) {
	const cardRef = useRef(null);
	const arrowRef = useRef(null);
	const imageRef = useRef(null);
	const buttonRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			cardRef.current,
			{
				y: 50,
				opacity: 0,
				scale: 0.96,
			},
			{
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 1,
				delay: index * 0.12,
				ease: "expo.out",
				clearProps: "transform",
			},
		);
	}, [index]);

	const handleMouseMove = (e) => {
		const card = cardRef.current;

		if (!card) return;

		const rect = card.getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateY = ((x - centerX) / centerX) * 5;
		const rotateX = -((y - centerY) / centerY) * 5;

		// smooth card movement
		gsap.to(card, {
			rotateX,
			rotateY,
			transformPerspective: 1400,
			transformOrigin: "center",
			duration: 0.5,
			ease: "power2.out",
			overwrite: "auto",
		});

		// smooth arrow tilt
		gsap.to(arrowRef.current, {
			x: rotateY * 1.8,
			y: -rotateX * 1.8,
			rotate: rotateY * 2,
			scale: 1.05,
			duration: 0.45,
			ease: "power2.out",
			overwrite: "auto",
		});

		// image float
		gsap.to(imageRef.current, {
			y: -6,
			scale: 1.04,
			duration: 0.55,
			ease: "power2.out",
			overwrite: "auto",
		});

		// button lift
		gsap.to(buttonRef.current, {
			y: -2,
			scale: 1.02,
			duration: 0.4,
			ease: "power2.out",
			overwrite: "auto",
		});
	};

	const resetCard = () => {
		gsap.to(cardRef.current, {
			rotateX: 0,
			rotateY: 0,
			duration: 0.8,
			ease: "expo.out",
			overwrite: "auto",
		});

		gsap.to(arrowRef.current, {
			x: 0,
			y: 0,
			rotate: 0,
			scale: 1,
			duration: 0.7,
			ease: "expo.out",
			overwrite: "auto",
		});

		gsap.to(imageRef.current, {
			y: 0,
			scale: 1,
			duration: 0.8,
			ease: "expo.out",
			overwrite: "auto",
		});

		gsap.to(buttonRef.current, {
			y: 0,
			scale: 1,
			duration: 0.6,
			ease: "expo.out",
			overwrite: "auto",
		});
	};

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={resetCard}
			className="group relative flex min-h-[420px] cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] p-5 transition-shadow duration-500 will-change-transform"
			style={{
				background: "#F9F6FE",
				transformStyle: "preserve-3d",
				boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
			}}
		>
			{/* soft glow */}
			<div className="pointer-events-none absolute inset-[-30%] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_60%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

			{/* top */}
			<div className="relative z-10">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1.5 backdrop-blur-md shadow-2xl">
						<div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111]">
							<Sparkles
								size={10}
								strokeWidth={2}
								className="text-white"
							/>
						</div>

						<span className="text-[11px] text-[#111] uppercase tracking-wide">
							New Release
						</span>
					</div>

					<p className="text-[12px] font-medium tracking-[0.04em] text-[#666]">
						{product.price}
					</p>
				</div>

				{/* image */}
				<div className="relative flex h-[190px] items-center justify-center">
					<img
						ref={imageRef}
						src={product.image}
						alt={product.name}
						className="h-full w-[76%] object-contain will-change-transform drop-shadow-[0_18px_30px_rgba(0,0,0,0.12)]"
					/>
				</div>

				{/* content */}
				<div className="mt-5">
					<h3 className="text-[1.55rem] leading-none tracking-[-0.05em] text-[#111]">
						{product.name}
					</h3>

					<p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#666]">
						{product.category}
					</p>

					<p className="mt-3 max-w-[95%] text-[13px] leading-[1.7] text-[#666]">
						{product.description}
					</p>
				</div>
			</div>

			{/* bottom */}
			<div className="relative z-10 mt-6 flex items-center justify-between">
				{/* add to cart */}
				<button
					ref={buttonRef}
					className="group/button relative overflow-hidden rounded-full bg-[#111] px-3 py-2 text-[10px] tracking-[0.06em] text-white transition-all duration-300 hover:scale-[1.02] font-semibold"
				>
					<span className="relative z-10">ADD TO CART</span>

					<div className="absolute inset-0 origin-left scale-x-0 bg-[#2a2a2a] transition-transform duration-500 group-hover/button:scale-x-100" />
				</button>

				{/* arrow */}
				<div
					ref={arrowRef}
					className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl will-change-transform"
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#111"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M7 17L17 7M17 7H7M17 7v10" />
					</svg>
				</div>
			</div>
		</div>
	);
}

export default function MostPopular() {
	const titleRef = useRef(null);
	const textRef = useRef(null);
	const linkRef = useRef(null);

	useEffect(() => {
		const tl = gsap.timeline({
			defaults: {
				ease: "power3.out",
			},
		});

		tl.fromTo(
			titleRef.current,
			{
				y: 40,
				opacity: 0,
				filter: "blur(8px)",
			},
			{
				y: 0,
				opacity: 1,
				filter: "blur(0px)",
				duration: 1,
				force3D: true,
			},
		)
			.fromTo(
				textRef.current,
				{
					y: 24,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					force3D: true,
				},
				"-=0.55",
			)
			.fromTo(
				linkRef.current,
				{
					y: 18,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.7,
					force3D: true,
				},
				"-=0.45",
			);
	}, []);

	return (
		<section className="bg-white px-5 py-20 sm:px-8 lg:px-10">
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
			`}</style>

			<div className="mx-auto max-w-[1280px]">
				{/* Header */}
				<div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-[580px]">
						<h2
							ref={titleRef}
							className="
								text-[2.4rem]
								font-extrabold
								leading-[0.95]
								tracking-[-0.06em]
								text-[#111]
								sm:text-[3.2rem]
							"
							style={{
								fontFamily: "'DM Sans', sans-serif",
								willChange: "transform, opacity",
							}}
						>
							Most Popular
						</h2>

						<p
							ref={textRef}
							className="
								mt-4
								max-w-[500px]
								text-[15px]
								leading-[1.8]
								text-[#666]
								sm:text-[16px]
							"
							style={{
								fontFamily: "'DM Sans', sans-serif",
								willChange: "transform, opacity",
							}}
						>
							Luxury fragrances crafted with bold notes,
							modern elegance, and timeless depth.
						</p>
					</div>

					<a
						ref={linkRef}
						href="#"
						className="
							inline-flex
							items-center
							gap-2
							text-[14px]
							font-bold
							text-[#111]
							transition-all
							duration-300
							hover:translate-x-1
						"
						style={{
							fontFamily: "'DM Sans', sans-serif",
							willChange: "transform, opacity",
						}}
					>
						View Collection
					</a>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
					{products.map((p, i) => (
						<ProductCard key={p.id} product={p} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}
