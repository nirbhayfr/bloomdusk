// LoginPage.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();

		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			navigate("/");
		}, 1500);
	};

	return (
		<div className="min-h-screen bg-[#f3f1f4] p-2 md:p-3">
			<div className="relative min-h-[calc(100vh-16px)] overflow-hidden rounded-[32px] md:min-h-[calc(100vh-24px)]">
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

				{/* Overlay */}
				<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.18)_50%,rgba(0,0,0,0.08)_100%)]" />

				{/* Back Button */}
				<button
					onClick={() => navigate("/")}
					className="absolute left-6 top-6 z-30 flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#0f0f0f] backdrop-blur-xl transition hover:bg-white"
				>
					<ArrowLeft size={15} />
					Back
				</button>

				<div className="relative z-20 flex min-h-[calc(100vh-16px)] items-center justify-center px-5 py-24">
					<div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/40 bg-white/20 backdrop-blur-[30px] lg:grid-cols-[1fr_480px]">
						{/* LEFT SIDE */}
						<div className="hidden flex-col justify-between p-10 lg:flex xl:p-14">
							<div>
								<p className="mb-6 text-xs font-bold uppercase tracking-[4px] text-[#9B6BFF]">
									BloomDusk
								</p>

								<h1 className="max-w-xl text-[72px] font-medium leading-[0.9] tracking-[-0.06em] text-[#0f0f0f]">
									Luxury
									<br />
									Fragrance
									<br />
									<span className="text-[#9B6BFF]">
										Experience.
									</span>
								</h1>

								<p className="mt-8 max-w-md text-lg leading-8 text-black/55">
									Access your orders, wishlist,
									exclusive collections and
									personalized fragrance
									recommendations.
								</p>
							</div>

							{/* <div className="flex gap-4">
								<div className="rounded-3xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl">
									<p className="text-[10px] font-bold uppercase tracking-[2px] text-black/40">
										Quality
									</p>
									<h3 className="mt-3 text-3xl font-bold text-[#0f0f0f]">
										Premium
									</h3>
								</div>

								<div className="rounded-3xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl">
									<p className="text-[10px] font-bold uppercase tracking-[2px] text-black/40">
										Scents
									</p>
									<h3 className="mt-3 text-3xl font-bold text-[#0f0f0f]">
										50+
									</h3>
								</div>

								<div className="rounded-3xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl">
									<p className="text-[10px] font-bold uppercase tracking-[2px] text-black/40">
										Shipping
									</p>
									<h3 className="mt-3 text-3xl font-bold text-[#0f0f0f]">
										Global
									</h3>
								</div>
							</div> */}
						</div>

						{/* RIGHT SIDE */}
						<div className="flex items-center justify-center bg-[#F9F6FE]/90 p-6 backdrop-blur-xl md:p-10">
							<div className="w-full max-w-md">
								<p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#9B6BFF]">
									Account Login
								</p>

								<h2 className="text-4xl font-medium tracking-[-0.05em] text-[#0f0f0f] md:text-5xl">
									Welcome Back
								</h2>

								<p className="mt-3 text-sm leading-6 text-black/55">
									Sign in to continue your fragrance
									journey with BloomDusk.
								</p>

								<form
									onSubmit={handleSubmit}
									className="mt-10 space-y-5"
								>
									{/* EMAIL */}
									<div>
										<label className="mb-2 block text-[11px] font-bold uppercase tracking-[2px] text-[#9B6BFF]">
											Email Address
										</label>

										<div className="relative">
											<Mail
												size={17}
												className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B6BFF]/60"
											/>

											<input
												type="email"
												required
												value={email}
												onChange={(e) =>
													setEmail(
														e.target
															.value,
													)
												}
												placeholder="name@example.com"
												className="h-14 w-full rounded-2xl border border-[#9B6BFF]/15 bg-white px-12 text-sm font-medium outline-none transition-all focus:border-[#9B6BFF] focus:ring-4 focus:ring-[#9B6BFF]/10"
											/>
										</div>
									</div>

									{/* PASSWORD */}
									<div>
										<div className="mb-2 flex items-center justify-between">
											<label className="text-[11px] font-bold uppercase tracking-[2px] text-[#9B6BFF]">
												Password
											</label>

											<Link
												to="/forgot-password"
												className="text-xs font-semibold text-[#9B6BFF]"
											>
												Forgot?
											</Link>
										</div>

										<div className="relative">
											<Lock
												size={17}
												className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B6BFF]/60"
											/>

											<input
												type={
													showPass
														? "text"
														: "password"
												}
												required
												value={password}
												onChange={(e) =>
													setPassword(
														e.target
															.value,
													)
												}
												placeholder="••••••••"
												className="h-14 w-full rounded-2xl border border-[#9B6BFF]/15 bg-white px-12 pr-12 text-sm font-medium outline-none transition-all focus:border-[#9B6BFF] focus:ring-4 focus:ring-[#9B6BFF]/10"
											/>

											<button
												type="button"
												onClick={() =>
													setShowPass(
														!showPass,
													)
												}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
											>
												{showPass ? (
													<EyeOff
														size={17}
													/>
												) : (
													<Eye
														size={17}
													/>
												)}
											</button>
										</div>
									</div>

									{/* REMEMBER */}
									<label className="flex cursor-pointer items-center gap-3">
										<input
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 accent-[#9B6BFF]"
										/>
										<span className="text-sm text-black/65">
											Remember me
										</span>
									</label>

									{/* BUTTON */}
									<button
										type="submit"
										disabled={loading}
										className="group mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f0f0f] text-sm font-bold text-white transition-all duration-300 hover:bg-[#9B6BFF]"
									>
										{loading ? (
											"Signing In..."
										) : (
											<>
												Sign In
												<ArrowUpRight
													size={16}
												/>
											</>
										)}
									</button>
								</form>

								<div className="my-8 flex items-center gap-4">
									<div className="h-px flex-1 bg-black/10" />
									<span className="text-xs font-medium text-black/35">
										OR
									</span>
									<div className="h-px flex-1 bg-black/10" />
								</div>

								<p className="text-center text-sm text-black/55">
									Don't have an account?{" "}
									<Link
										to="/register"
										className="font-bold text-[#9B6BFF]"
									>
										Create Account
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* MOBILE BRANDING */}
				<div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 lg:hidden">
					<p className="text-xs font-bold uppercase tracking-[4px] text-white/70">
						BloomDusk
					</p>
				</div>
			</div>
		</div>
	);
}
