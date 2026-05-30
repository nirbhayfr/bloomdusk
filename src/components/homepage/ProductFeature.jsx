export default function ProductFeature() {
	return (
		<div className="bg-white font-sans" id="featured">
			<div className="bg-[#EDE4FC] rounded-b-3xl px-6 pt-20 pb-32 text-center">
				{/* Badge */}
				<div className="inline-block bg-white rounded-full px-4 py-1 text-sm text-gray-700 font-medium mb-6 shadow-sm">
					Journal
				</div>

				<h1 className="mx-auto mb-5 max-w-4xl text-center text-[42px] font-normal leading-[1.05] tracking-[-0.06em] text-[#111] sm:text-[55px] lg:text-[72px]">
					Timeless scents for <br />
					every moment.
				</h1>
				<p className="text-[#7D7884] text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-semibold">
					Explore scent stories, ingredient guides, fragrance
					rituals, and styling tips thoughtfully curated for
					modern perfume lovers.
				</p>
			</div>

			{/* Featured Post Card */}
			<div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16">
				<div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
					{/* Must Read badge - floats above card */}
					<div className="absolute top-4 left-4 z-10 bg-white rounded-2xl px-4 py-1.5 text-sm font-semibold text-gray-800 shadow-sm">
						<img
							src="/logo.png"
							alt="logo"
							className="w-16"
						/>
					</div>

					<div className="flex flex-col lg:flex-row">
						{/* Left - Product Image */}
						<div className="lg:w-[52%] min-h-[320px] lg:min-h-[480px] bg-[#f0eaf8] relative overflow-hidden flex items-center justify-center">
							<img
								src="/bottle.png"
								alt="bottle"
								className=""
							/>
						</div>

						{/* Right - Content */}
						<div className="lg:w-[48%] bg-[#f9f8fe] p-8 lg:p-12 flex flex-col justify-between">
							{/* Top: Tags + Title + Description */}
							<div className="space-y-5">
								<div className="flex flex-wrap gap-2">
									<span className="bg-[#ede9f8] text-[#6b3fd4] text-xs font-semibold px-3 py-1 rounded-full">
										Gucci Flora
									</span>
									<span className="bg-[#f3f0fc] text-[#9b87d4] text-xs font-semibold px-3 py-1 rounded-full">
										50ml
									</span>
								</div>

								<h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-gray-900 leading-tight">
									Pink Veil
								</h2>

								<p className="text-[#b0a8c8] text-base leading-relaxed max-w-md">
									A delicate veil of florals and soft
									musks — Pink Veil wraps you in an
									airy, feminine signature that
									lingers like a whispered secret.
								</p>
							</div>

							{/* Middle: Scent Notes */}
							<div className="space-y-3">
								<p className="text-xs font-semibold uppercase tracking-widest text-[#c9c2e0]">
									Scent Profile
								</p>
								<div className="flex flex-col">
									{[
										{
											label: "Top Note",
											note: "Peony",
										},
										{
											label: "Heart Note",
											note: "Rose Musk",
										},
										{
											label: "Base Note",
											note: "Sandalwood",
										},
									].map((n) => (
										<div
											key={n.label}
											className="flex items-center justify-between py-3 border-b border-[#ede9f8] last:border-0"
										>
											<p className="text-xs text-[#b0a8c8]">
												{n.label}
											</p>
											<p className="text-sm font-semibold text-[#6b3fd4]">
												{n.note}
											</p>
										</div>
									))}
								</div>
							</div>

							{/* Bottom: Author + CTA */}
							<div className="flex items-center justify-between pt-6 border-t border-[#ede9f8]">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-[#e8e5f8] overflow-hidden flex items-center justify-center">
										<img
											src="/star.png"
											alt="star"
											className="size-4"
										/>
									</div>
									<div>
										<img
											src="/logo.png"
											alt="logo"
											className="w-16"
										/>
										<p className="text-xs text-[#b0a8c8]">
											Fragrance Curator
										</p>
									</div>
								</div>

								<button className="w-11 h-11 rounded-full bg-[#ede9f8] hover:bg-[#6b3fd4] text-[#6b3fd4] hover:text-white transition-colors flex items-center justify-center">
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
