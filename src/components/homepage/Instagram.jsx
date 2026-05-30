import { useState } from "react";

const images = [
	"/ig-1.png",
	"/ig-2.png",
	"/ig-3.png",
	"/ig-4.png",
	"/ig-1.png",
];

const InstagramCard = ({ index }) => {
	const [hovered, setHovered] = useState(false);
	return (
		<div
			className="relative w-full h-full overflow-hidden rounded-2xl cursor-pointer"
			style={{
				transition: "transform 0.5s ease, box-shadow 0.5s ease",
				transform: hovered ? "scale(1.03)" : "scale(1)",
				boxShadow: hovered
					? "0 20px 40px rgba(107,63,212,0.18)"
					: "0 2px 12px rgba(107,63,212,0.07)",
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Image */}
			<img
				src={images[index]}
				alt={`Instagram post ${index + 1}`}
				className="absolute inset-0 w-full h-full object-cover"
			/>

			{/* Hover overlay */}
			<div
				className="absolute inset-0 flex items-center justify-center"
				style={{
					transition: "opacity 0.3s ease",
					backgroundColor: "rgba(107,63,212,0.28)",
					backdropFilter: "blur(1px)",
					opacity: hovered ? 1 : 0,
				}}
			>
				<div className="flex flex-col items-center gap-1.5">
					<svg
						className="w-6 h-6"
						fill="white"
						viewBox="0 0 24 24"
					>
						<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
					</svg>
					<span className="text-white text-[11px] font-semibold tracking-widest">
						VIEW POST
					</span>
				</div>
			</div>
		</div>
	);
};

export default function InstagramSection() {
	const [btnHovered, setBtnHovered] = useState(false);

	return (
		<section
			className="w-full relative overflow-hidden mt-20"
			style={{
				backgroundColor: "#FAF8FF",
				paddingTop: "72px",
				paddingBottom: "72px",
			}}
			id="social"
		>
			{/* Background blobs */}
			<div
				className="absolute rounded-full pointer-events-none"
				style={{
					width: 480,
					height: 480,
					top: -160,
					left: -160,
					background:
						"radial-gradient(circle, rgba(237,228,252,0.6) 0%, transparent 70%)",
				}}
			/>
			<div
				className="absolute rounded-full pointer-events-none"
				style={{
					width: 400,
					height: 400,
					bottom: -140,
					right: -100,
					background:
						"radial-gradient(circle, rgba(107,63,212,0.07) 0%, transparent 70%)",
				}}
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
				{/* ── MOBILE ── */}
				<div className="flex flex-col items-center gap-10 lg:hidden">
					<div className="text-center">
						<p
							className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3"
							style={{ color: "#6B3FD4" }}
						>
							Follow Us
						</p>
						<h2
							className="text-4xl sm:text-5xl leading-tight mb-7"
							style={{
								fontFamily:
									"Georgia, 'Times New Roman', serif",
								color: "#1a0a3c",
							}}
						>
							We're BloomDusk
							<br />
							on instagram
						</h2>
						<a
							href="https://instagram.com/bloomdusk"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-widest"
							style={{
								transition: "all 0.3s ease",
								padding: "12px 28px",
								borderRadius: 999,
								border: "1.5px solid #6B3FD4",
								color: "#6B3FD4",
								backgroundColor: "transparent",
							}}
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
							</svg>
							@BLOOMDUSK
						</a>
					</div>

					{/* Mobile grid */}
					<div className="grid grid-cols-2 gap-3 w-full max-w-sm">
						<div className="col-span-2 h-48">
							<InstagramCard index={0} />
						</div>
						<div className="h-36">
							<InstagramCard index={1} />
						</div>
						<div className="h-36">
							<InstagramCard index={2} />
						</div>
						<div className="h-36">
							<InstagramCard index={3} />
						</div>
						<div className="h-36">
							<InstagramCard index={4} />
						</div>
					</div>
				</div>

				{/* ── DESKTOP ── */}
				<div className="hidden lg:grid lg:grid-cols-[1fr_280px_1fr] xl:grid-cols-[1fr_320px_1fr] items-center gap-6 xl:gap-10">
					{/* LEFT cluster */}
					<div className="relative" style={{ height: 500 }}>
						<div
							className="absolute"
							style={{
								left: "12%",
								top: 0,
								width: "58%",
								height: "52%",
							}}
						>
							<InstagramCard index={0} />
						</div>
						<div
							className="absolute"
							style={{
								left: 0,
								top: "32%",
								width: "40%",
								height: "36%",
							}}
						>
							<InstagramCard index={1} />
						</div>
						<div
							className="absolute"
							style={{
								left: "26%",
								top: "54%",
								width: "48%",
								height: "44%",
							}}
						>
							<InstagramCard index={2} />
						</div>
					</div>

					{/* CENTER */}
					<div className="flex flex-col items-center text-center gap-5">
						<p
							className="text-[11px] font-bold tracking-[0.32em] uppercase"
							style={{ color: "#6B3FD4" }}
						>
							Follow Us
						</p>
						<h2
							className="text-4xl xl:text-[2.6rem] leading-[1.18]"
							style={{
								fontFamily:
									"Georgia, 'Times New Roman', serif",
								color: "#1a0a3c",
							}}
						>
							We're BloomDusk
							<br />
							on instagram
						</h2>

						<a
							href="https://instagram.com/bloomdusk"
							target="_blank"
							rel="noopener noreferrer"
							onMouseEnter={() => setBtnHovered(true)}
							onMouseLeave={() => setBtnHovered(false)}
							className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-widest mt-1"
							style={{
								transition: "all 0.3s ease",
								padding: "13px 30px",
								borderRadius: 999,
								border: "1.5px solid #6B3FD4",
								color: btnHovered
									? "#ffffff"
									: "#6B3FD4",
								backgroundColor: btnHovered
									? "#6B3FD4"
									: "transparent",
								boxShadow: btnHovered
									? "0 8px 24px rgba(107,63,212,0.28)"
									: "none",
								transform: btnHovered
									? "scale(1.04)"
									: "scale(1)",
							}}
						>
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
							</svg>
							@BLOOMDUSK
						</a>

						{/* Dot accent */}
						<div className="flex items-center gap-1.5 mt-1">
							<span
								className="w-1.5 h-1.5 rounded-full"
								style={{ backgroundColor: "#EDE4FC" }}
							/>
							<span
								className="w-5 h-1.5 rounded-full"
								style={{ backgroundColor: "#6B3FD4" }}
							/>
							<span
								className="w-1.5 h-1.5 rounded-full"
								style={{ backgroundColor: "#EDE4FC" }}
							/>
						</div>
					</div>

					{/* RIGHT cluster */}
					<div className="relative" style={{ height: 500 }}>
						<div
							className="absolute"
							style={{
								right: 0,
								top: "2%",
								width: "82%",
								height: "52%",
							}}
						>
							<InstagramCard index={3} />
						</div>
						<div
							className="absolute"
							style={{
								right: "6%",
								top: "50%",
								width: "62%",
								height: "44%",
							}}
						>
							<InstagramCard index={4} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
