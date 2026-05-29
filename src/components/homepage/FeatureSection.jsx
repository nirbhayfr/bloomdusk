import { useEffect, useRef } from "react";

const features = [
	{
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
				<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
			</svg>
		),
		title: "Instant Digital Downloads",
		description:
			"Access your digital product purchase immediately after checkout.",
	},
	{
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
				<path d="M12 2l2.8 6.4L22 9.3l-5 4.9 1.2 6.8L12 17.7l-6.2 3.3L7 14.2 2 9.3l7.2-.9L12 2z" />
			</svg>
		),
		title: "Premium Quality Materials",
		description:
			"Products crafted with only the finest materials for long-lasting quality.",
	},
	{
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
				<path d="M3 8l4-4 4 4M7 4v16M13 8l4-4 4 4M17 4v16" />
				<path d="M13 16l4 4 4-4" />
			</svg>
		),
		title: "Fast & Secure Shipping",
		description:
			"Fast and secure shipping with complete tracking on all physical product orders.",
	},
];

// Diamond icon for middle card
const DiamondIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
		<rect
			x="12"
			y="2"
			width="10"
			height="10"
			rx="1"
			transform="rotate(45 12 2)"
		/>
	</svg>
);

// Fast forward icon for last card
const FastForwardIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
		<path d="M13 6l7 6-7 6V6zM4 6l7 6-7 6V6z" />
	</svg>
);

// Lightning icon for first card
const LightningIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
		<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
	</svg>
);

const icons = [<LightningIcon />, <DiamondIcon />, <FastForwardIcon />];

export default function FeaturesSection() {
	const sectionRef = useRef(null);
	const headingRef = useRef(null);
	const subRef = useRef(null);
	const cardRefs = useRef([]);

	useEffect(() => {
		let ctx;

		const init = async () => {
			const { gsap } =
				await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
			const { ScrollTrigger } =
				await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");

			gsap.registerPlugin(ScrollTrigger);

			ctx = gsap.context(() => {
				// Heading animation
				gsap.from(headingRef.current, {
					y: 40,
					opacity: 0,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: headingRef.current,
						start: "top 85%",
					},
				});

				gsap.from(subRef.current, {
					y: 20,
					opacity: 0,
					duration: 0.7,
					delay: 0.15,
					ease: "power3.out",
					scrollTrigger: {
						trigger: subRef.current,
						start: "top 85%",
					},
				});

				// Cards staggered
				cardRefs.current.forEach((card, i) => {
					if (!card) return;

					gsap.from(card, {
						y: 60,
						opacity: 0,
						duration: 0.75,
						delay: i * 0.15,
						ease: "power3.out",
						scrollTrigger: {
							trigger: card,
							start: "top 88%",
						},
					});

					// Icon bounce on hover
					const icon = card.querySelector(".feature-icon");
					card.addEventListener("mouseenter", () => {
						gsap.to(icon, {
							scale: 1.15,
							duration: 0.25,
							ease: "back.out(2)",
						});
					});
					card.addEventListener("mouseleave", () => {
						gsap.to(icon, {
							scale: 1,
							duration: 0.25,
							ease: "power2.out",
						});
					});
				});
			}, sectionRef);
		};

		init();

		return () => ctx && ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="w-full bg-white py-16 px-4 sm:px-8 lg:px-16"
		>
			{/* Header */}
			<div className="text-center mb-14">
				<h2
					ref={headingRef}
					className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3"
				>
					Highlight what makes you stand out
				</h2>
				<p
					ref={subRef}
					className="text-gray-400 text-base sm:text-lg"
				>
					Use this section to show off the key features like
					these.
				</p>
			</div>

			{/* Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
				{[
					{
						icon: <LightningIcon />,
						title: "Instant Digital Downloads",
						description:
							"Access your digital product purchase immediately after checkout.",
					},
					{
						icon: <DiamondIcon />,
						title: "Premium Quality Materials",
						description:
							"Products crafted with only the finest materials for long-lasting quality.",
					},
					{
						icon: <FastForwardIcon />,
						title: "Fast & Secure Shipping",
						description:
							"Fast and secure shipping with complete tracking on all physical product orders.",
					},
				].map((feature, i) => (
					<div
						key={i}
						ref={(el) => (cardRefs.current[i] = el)}
						className="relative bg-[#f5f4fb] rounded-2xl p-6 pt-14 cursor-default"
					>
						{/* Floating icon badge */}
						<div className="feature-icon absolute -top-5 left-6 w-11 h-11 rounded-full bg-[#e8e5f8] flex items-center justify-center text-gray-900 shadow-sm">
							{feature.icon}
						</div>

						<h3 className="text-base font-bold text-gray-900 mb-2">
							{feature.title}
						</h3>
						<p className="text-sm text-gray-500 leading-relaxed">
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
