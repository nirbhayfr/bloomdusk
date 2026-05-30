// RegisterPage.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	ArrowLeft,
	ArrowUpRight,
	User,
	Mail,
	Lock,
	Eye,
	EyeOff,
} from "lucide-react";
import gsap from "gsap";

export default function RegisterPage() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [showConfirmPass, setShowConfirmPass] = useState(false);
	const [loading, setLoading] = useState(false);

	const containerRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			containerRef.current,
			{
				y: 40,
				opacity: 0,
				scale: 0.96,
			},
			{
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 0.8,
				ease: "power4.out",
			},
		);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			navigate("/");
		}, 1500);
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-black">
			{/* Background Video */}
			<video
				autoPlay
				muted
				loop
				playsInline
				className="absolute inset-0 h-full w-full object-cover"
			>
				<source src="/vid.mp4" type="video/mp4" />
			</video>

			{/* Purple Glow */}
			<div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#9b6bff]/20 blur-[180px]" />
			<div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#9b6bff]/10 blur-[180px]" />

			<div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
				<div
					ref={containerRef}
					className="w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl"
				>
					<div className="grid lg:grid-cols-2">
						{/* LEFT SIDE */}
						<div className="relative flex flex-col p-8 text-white lg:p-12">
							<p className="mb-6 text-xs font-semibold uppercase tracking-[0.4em] text-[#c7a7ff]">
								BloomDusk
							</p>

							<h1 className="max-w-xl text-[72px] font-medium leading-[0.9] tracking-[-0.06em] text-[#0f0f0f]">
								Create Your
								<span className="block text-[#9b6bff]">
									Account.
								</span>
							</h1>

							<p className="mt-8 max-w-md text-lg leading-8 text-black/55">
								Join BloomDusk and unlock exclusive
								collections, order tracking,
								personalized recommendations, wishlists
								and seamless checkout.
							</p>

							<div className="mt-auto hidden grid-cols-3 gap-4 pt-16 lg:grid">
								<div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
									<p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
										Members
									</p>
									<h3 className="mt-3 text-2xl font-bold">
										50K+
									</h3>
								</div>

								<div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
									<p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
										Products
									</p>
									<h3 className="mt-3 text-2xl font-bold">
										200+
									</h3>
								</div>

								<div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
									<p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
										Support
									</p>
									<h3 className="mt-3 text-2xl font-bold">
										24/7
									</h3>
								</div>
							</div>
						</div>

						{/* RIGHT SIDE */}
						<div className="bg-white/90 p-8 backdrop-blur-xl lg:p-12">
							<div className="mx-auto max-w-md">
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9b6bff]">
									Account Registration
								</p>

								<img
									src="/logo.png"
									alt="logo"
									className="w-48 mt-4 -ml-1"
								/>

								<p className="mt-3 text-sm text-black/50">
									Create your account and start
									exploring exclusive products.
								</p>

								<form
									onSubmit={handleSubmit}
									className="mt-10 space-y-5"
								>
									{/* Name */}
									<div>
										<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6bff]">
											Full Name
										</label>

										<div className="flex h-14 items-center rounded-2xl border border-black/10 bg-white/60 px-4 transition focus-within:border-[#9b6bff]">
											<User
												size={18}
												className="text-[#9b6bff]"
											/>

											<input
												type="text"
												value={name}
												onChange={(e) =>
													setName(
														e.target
															.value,
													)
												}
												placeholder="John Doe"
												className="ml-3 w-full bg-transparent text-sm outline-none"
												required
											/>
										</div>
									</div>

									{/* Email */}
									<div>
										<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6bff]">
											Email Address
										</label>

										<div className="flex h-14 items-center rounded-2xl border border-black/10 bg-white/60 px-4 transition focus-within:border-[#9b6bff]">
											<Mail
												size={18}
												className="text-[#9b6bff]"
											/>

											<input
												type="email"
												value={email}
												onChange={(e) =>
													setEmail(
														e.target
															.value,
													)
												}
												placeholder="name@example.com"
												className="ml-3 w-full bg-transparent text-sm outline-none"
												required
											/>
										</div>
									</div>

									{/* Password */}
									<div>
										<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6bff]">
											Password
										</label>

										<div className="relative flex h-14 items-center rounded-2xl border border-black/10 bg-white/60 px-4 transition focus-within:border-[#9b6bff]">
											<Lock
												size={18}
												className="text-[#9b6bff]"
											/>

											<input
												type={
													showPass
														? "text"
														: "password"
												}
												value={password}
												onChange={(e) =>
													setPassword(
														e.target
															.value,
													)
												}
												placeholder="Create password"
												className="ml-3 w-full bg-transparent text-sm outline-none"
												required
											/>

											<button
												type="button"
												onClick={() =>
													setShowPass(
														!showPass,
													)
												}
											>
												{showPass ? (
													<EyeOff
														size={18}
													/>
												) : (
													<Eye
														size={18}
													/>
												)}
											</button>
										</div>
									</div>

									{/* Confirm Password */}
									<div>
										<label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9b6bff]">
											Confirm Password
										</label>

										<div className="relative flex h-14 items-center rounded-2xl border border-black/10 bg-white/60 px-4 transition focus-within:border-[#9b6bff]">
											<Lock
												size={18}
												className="text-[#9b6bff]"
											/>

											<input
												type={
													showConfirmPass
														? "text"
														: "password"
												}
												value={
													confirmPassword
												}
												onChange={(e) =>
													setConfirmPassword(
														e.target
															.value,
													)
												}
												placeholder="Confirm password"
												className="ml-3 w-full bg-transparent text-sm outline-none"
												required
											/>

											<button
												type="button"
												onClick={() =>
													setShowConfirmPass(
														!showConfirmPass,
													)
												}
											>
												{showConfirmPass ? (
													<EyeOff
														size={18}
													/>
												) : (
													<Eye
														size={18}
													/>
												)}
											</button>
										</div>
									</div>

									<button
										type="submit"
										disabled={loading}
										className="group mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#9b6bff] font-bold text-white transition-all hover:shadow-[0_15px_35px_rgba(155,107,255,0.35)]"
									>
										{loading ? (
											"Creating Account..."
										) : (
											<>
												Create Account
												<ArrowUpRight
													size={16}
													className="transition-transform group-hover:translate-x-1"
												/>
											</>
										)}
									</button>
								</form>

								<p className="mt-8 text-center text-sm text-black/50">
									Already have an account?{" "}
									<Link
										to="/login"
										className="font-bold text-[#9b6bff] transition hover:text-[#7e4eff]"
									>
										Sign In
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
