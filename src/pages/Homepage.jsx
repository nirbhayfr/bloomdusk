import FeaturesSection from "../components/homepage/FeatureSection";
import HeroSection from "../components/homepage/Hero";
import InstagramSection from "../components/homepage/Instagram";
import MostPopular from "../components/homepage/MostPopular";
import ProductFeature from "../components/homepage/ProductFeature";
import TestimonialsSection from "../components/homepage/Testimonials";
import VideoSection from "../components/homepage/VideoSection";

function Homepage() {
	return (
		<main className="font-inter">
			<HeroSection />
			<MostPopular />
			<FeaturesSection />
			<ProductFeature />
			<TestimonialsSection />
			<InstagramSection />
			<VideoSection />
		</main>
	);
}

export default Homepage;
