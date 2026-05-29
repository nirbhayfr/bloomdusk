import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function VideoSection() {
	const videoRef = useRef(null);
	const [playing, setPlaying] = useState(true);

	const toggleVideo = () => {
		if (!videoRef.current) return;

		if (playing) {
			videoRef.current.pause();
		} else {
			videoRef.current.play();
		}

		setPlaying(!playing);
	};

	return (
		<section className="w-full bg-[#f3f1f4] px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
			<div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/7]">
				<video
					ref={videoRef}
					autoPlay
					muted
					loop
					playsInline
					className="absolute inset-0 h-full w-full scale-[1.08] object-cover sm:scale-[1.03] lg:scale-100"
					style={{
						objectPosition: "center center",
					}}
				>
					<source src="/video-2.mp4" type="video/mp4" />
				</video>

				<div className="absolute inset-0 backdrop-blur-[px]" />

				{/* CONTENT */}
				<div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
					<h2
						className="
							max-w-[1100px]
							text-white
							font-medium
							leading-[0.95]
							tracking-[-0.06em]
							text-[1.5rem]
							sm:text-3xl
							md:text-5xl
							lg:text-6xl
						"
						style={{
							fontFamily:
								'"Inter","Inter Placeholder",sans-serif',
						}}
					>
						Discover signature fragrances crafted to
						<br /> leave a lasting impression.
					</h2>
				</div>

				{/* TOP RIGHT CURVE CUTOUT */}
				<div className="absolute -top-8 -right-8 z-20 h-[92px] w-[92px] sm:h-[105px] sm:w-[105px]">
					<svg
						viewBox="0 0 100 100"
						className="absolute inset-0 h-full w-full"
						preserveAspectRatio="none"
					>
						<path
							d="
								M28 0
								Q0 0 0 28
								L0 68
								Q0 100 32 100
								L100 100
								L100 0
								Z
							"
							fill="#f3f1f4"
						/>
					</svg>
				</div>

				{/* BUTTON */}
				<div className="absolute -top-2 -right-2 z-30 flex h-[92px] w-[92px] items-start justify-end p-3 sm:h-[105px] sm:w-[105px] sm:p-4">
					<button
						onClick={toggleVideo}
						className="
							group
							flex
							h-12
							w-12
							sm:h-14
							sm:w-14
							items-center
							justify-center
							rounded-full
							bg-[#e5dcf7]
							transition-all
							duration-300
							hover:scale-105
							hover:bg-[#d7c8f5]
							active:scale-95
						"
						aria-label={
							playing ? "Pause video" : "Play video"
						}
					>
						{playing ? (
							<Pause
								size={20}
								strokeWidth={3}
								className="translate-x-[1px] text-black"
							/>
						) : (
							<Play
								size={20}
								fill="black"
								strokeWidth={2.8}
								className="translate-x-[1px] text-black"
							/>
						)}
					</button>
				</div>
			</div>
		</section>
	);
}
