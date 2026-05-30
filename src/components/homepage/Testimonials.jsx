import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState, useRef, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
	{
		quote: "Pink Veil is unlike anything I've worn before. It's soft, feminine, and stays with me all day.",
		name: "Sophia Renae",
		title: "Verified Buyer",
		avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwYXZhdGFyfGVufDB8fDB8fHwy",
	},
	{
		quote: "Bloomdusk has redefined what a niche fragrance can feel like. The sillage is incredible.",
		name: "Layla Osman",
		title: "Fragrance Collector",
		avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmVtYWxlJTIwYXZhdGFyfGVufDB8fDB8fHwy",
	},
	{
		quote: "I ordered on a whim and now I own three scents. Absolutely obsessed.",
		name: "Hannah",
		title: "Verified Buyer",
		avatar: "https://images.unsplash.com/photo-1616840420121-7ad8ed885f11?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
];

export default function TestimonialsSection() {
	const [current, setCurrent] = useState(0);

	const sectionRef = useRef(null);
	const avatarRef = useRef(null);
	const quoteRef = useRef(null);
	const metaRef = useRef(null);

	const getTargets = () => [
		avatarRef.current,
		quoteRef.current,
		metaRef.current,
	];

	// Set invisible immediately on mount, then animate in on scroll
	useEffect(() => {
		const targets = getTargets();

		// Hide before any paint so there's no flash
		gsap.set(targets, { opacity: 0, y: 60 });

		const ctx = gsap.context(() => {
			gsap.to(targets, {
				y: 0,
				opacity: 1,
				duration: 1,
				stagger: 0.15,
				ease: "power3.out",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 80%",
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	const animateTransition = (direction, newIndex) => {
		const xOut = direction === "next" ? -50 : 50;
		const xIn = direction === "next" ? 50 : -50;
		const targets = getTargets();

		gsap.to(targets, {
			x: xOut,
			opacity: 0,
			duration: 0.25,
			ease: "power2.in",
			onComplete: () => {
				setCurrent(newIndex);
				// Use a tiny timeout so React re-renders the new content before we animate in
				requestAnimationFrame(() => {
					gsap.fromTo(
						getTargets(),
						{ x: xIn, opacity: 0 },
						{
							x: 0,
							opacity: 1,
							duration: 0.45,
							ease: "power3.out",
							stagger: 0.08,
						},
					);
				});
			},
		});
	};

	const prev = () =>
		animateTransition(
			"prev",
			(current - 1 + testimonials.length) % testimonials.length,
		);
	const next = () =>
		animateTransition("next", (current + 1) % testimonials.length);
	const goTo = (i) =>
		i !== current && animateTransition(i > current ? "next" : "prev", i);

	const t = testimonials[current];

	return (
		<section
			ref={sectionRef}
			className="bg-[#f5f3fc] w-full px-6 py-24 relative overflow-hidden mt-20"
			id="reviews"
		>
			{/* Nav arrows */}
			<div className="absolute top-10 right-8 sm:right-12 flex gap-2">
				<button
					onClick={prev}
					className="w-11 h-11 rounded-full bg-[#e8e5f8] hover:bg-[#d4cef4] text-gray-700 flex items-center justify-center transition-colors"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-4 h-4"
					>
						<path d="M19 12H5M12 5l-7 7 7 7" />
					</svg>
				</button>
				<button
					onClick={next}
					className="w-11 h-11 rounded-full bg-[#e8e5f8] hover:bg-[#d4cef4] text-gray-700 flex items-center justify-center transition-colors"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-4 h-4"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			{/* Content */}
			<div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
				<div
					ref={avatarRef}
					className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-sm"
				>
					<img
						src={t.avatar}
						alt={t.name}
						className="w-full h-full object-cover"
					/>
				</div>

				<p
					ref={quoteRef}
					className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight tracking-tight"
				>
					{t.quote}
				</p>

				<div
					ref={metaRef}
					className="flex flex-col items-center gap-3"
				>
					<div className="flex items-center gap-1 text-gray-900">
						{Array.from({ length: 5 }).map((_, i) => (
							<svg
								key={i}
								viewBox="0 0 24 24"
								fill="#6b3fd4"
								className="w-5 h-5"
							>
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
							</svg>
						))}
					</div>
					<p className="text-[#b0a8c8] text-base">
						{t.name} · {t.title}
					</p>
					<div className="flex gap-2 mt-1">
						{testimonials.map((_, i) => (
							<button
								key={i}
								onClick={() => goTo(i)}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									i === current
										? "w-6 bg-[#6b3fd4]"
										: "w-1.5 bg-[#d4cef4]"
								}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
