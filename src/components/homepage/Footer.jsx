import { useState } from "react";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [joined, setJoined] = useState(false);

	const handleJoin = () => {
		if (email.trim()) {
			setJoined(true);
			setEmail("");
		}
	};

	return (
		<footer className="relative mx-4 my-4 overflow-hidden rounded-[28px] bg-[#EDE4FC] px-6 py-10 font-sans sm:px-8 lg:px-10 font-inter mt-10">
			{/* Logo tab — notched top-left */}
			<div className="absolute -top-0 left-0 bg-white rounded-tl-2xl rounded-br-2xl px-4 py-2">
				<img src="/logo.png" alt="logo" className="w-24" />
			</div>

			<div className="flex flex-col md:flex-row justify-between gap-12 mt-6">
				{/* Left: Newsletter */}
				<div className="max-w-lg">
					<h2 className="text-lg md:text-[1.75rem] font-semibold text-gray-900 leading-snug mb-6">
						Join our newsletter and get 20%
						<br /> off your first purchase with us.
					</h2>

					{joined ? (
						<p className="text-gray-700 font-medium">
							Thanks for joining! Check your inbox.
						</p>
					) : (
						<div className="flex items-center bg-white rounded-md px-1 py-1 shadow-sm w-full max-w-xs">
							<input
								type="email"
								value={email}
								onChange={(e) =>
									setEmail(e.target.value)
								}
								onKeyDown={(e) =>
									e.key === "Enter" && handleJoin()
								}
								placeholder="Your Email Address"
								className="flex-1 bg-transparent outline-none text-sm text-gray-500 placeholder-gray-400 px-3"
							/>
							<button
								onClick={handleJoin}
								className="bg-[#6b3fd4] hover:bg-[#5a32b5] text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
							>
								Join
							</button>
						</div>
					)}
				</div>

				{/* Right: Links */}
				<div className="flex gap-16">
					<div>
						<p className="text-gray-900 font-semibold text-sm mb-4">
							Pages
						</p>
						<ul className="space-y-3 text-gray-500 text-sm">
							{["Home", "Shop", "Collections", "Blog"].map(
								(item) => (
									<li key={item}>
										<a
											href="#"
											className="hover:text-gray-800 transition-colors"
										>
											{item}
										</a>
									</li>
								),
							)}
						</ul>
					</div>
					<div>
						<p className="text-gray-900 font-semibold text-sm mb-4">
							Information
						</p>
						<ul className="space-y-3 text-gray-500 text-sm">
							{[
								"Terms & Conditions",
								"Privacy policy",
								"Support",
								"404",
							].map((item) => (
								<li key={item}>
									<a
										href="#"
										className="hover:text-gray-800 transition-colors"
									>
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className="mt-4 flex flex-col gap-4 border-t border-black/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-[13px] font-medium tracking-[0.02em] text-gray-500">
					© 2026 BloomDusk. All rights reserved.
				</p>

				<div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm w-fit">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="text-gray-700"
					>
						<path
							d="M5 3L19 12L5 21V3Z"
							fill="currentColor"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinejoin="round"
						/>
					</svg>

					<span className="text-[12px] font-medium text-gray-600n w-fit">
						Crafted with intention
					</span>
				</div>
			</div>
		</footer>
	);
}
