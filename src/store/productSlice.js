import { createSlice } from "@reduxjs/toolkit";

// ─── PRODUCT CATALOG ──────────────────────────────────────────────────────────
// Single source of truth for ALL product data across the entire app.
// Hero slider, MostPopular grid, ProductPage, and cart all read from here.

export const PRODUCTS = [
	{
		id: 1,
		name: "Marine Noir",
		category: "Hawas",
		price: 779,
		originalPrice: 999,
		size: "50ml",
		description:
			"Fresh aquatic accords blended with deep amber and marine woods. An audacious scent for those who carry the ocean within them — cool on the surface, unfathomably deep beneath.",
		notes: {
			top: ["Sea Salt", "Bergamot"],
			heart: ["Amber", "Marine Accord"],
			base: ["Musk", "Driftwood", "Vetiver"],
		},
		tags: ["Aquatic", "Unisex", "Long-lasting"],
		rating: 4.8,
		reviews: 312,
		bg: "#eef3f8",
		accent: "#1a3a5c",
		pill: "#d0e4f5",
		textColor: "#111111",
		subColor: "#666666",
		image: "/p-1-1.png",
		images: ["/p-1-1.png", "/p-1-2.png", "/p-1-3.png"],
	},
	{
		id: 2,
		name: "Ivory Oud",
		category: "White Oud BV",
		price: 789,
		originalPrice: 1199,
		size: "50ml",
		description:
			"Elegant oud signature layered with creamy woods and saffron. A whisper of the ancient East rendered in the softest possible light — luminous, rare, and endlessly captivating.",
		notes: {
			top: ["Saffron", "Cardamom"],
			heart: ["Rose", "Oud"],
			base: ["Vanilla", "Sandalwood", "Amber"],
		},
		tags: ["Oriental", "Woody", "Unisex"],
		rating: 4.9,
		reviews: 208,
		bg: "#f8f4ee",
		accent: "#5c3a1a",
		pill: "#f0e4d0",
		textColor: "#111111",
		subColor: "#666666",
		image: "/p-2-3.png",
		images: ["/p-2-1.png", "/p-2-2.png", "/p-2-3.png"],
	},
	{
		id: 3,
		name: "Pink Veil",
		category: "Gucci Flora",
		price: 999,
		originalPrice: 1999,
		size: "50ml",
		description:
			"Soft floral bouquet wrapped in powdery rose and jasmine. Like the first light of dawn filtering through petals — delicate, luminous, and impossibly feminine.",
		notes: {
			top: ["Peach", "Mandarin"],
			heart: ["Rose", "Jasmine", "Peony"],
			base: ["White Musk", "Iris", "Cedarwood"],
		},
		tags: ["Floral", "Feminine", "Romantic"],
		rating: 4.7,
		reviews: 445,
		bg: "#f8eef0",
		accent: "#5c1a2e",
		pill: "#f5d0da",
		textColor: "#111111",
		subColor: "#666666",
		image: "/p-3-2.png",
		images: ["/p-3-1.png", "/p-3-2.png", "/p-3-3.png"],
	},
];

const productsSlice = createSlice({
	name: "products",
	initialState: {
		items: PRODUCTS,
	},
	reducers: {},
});

// ─── SELECTORS ────────────────────────────────────────────────────────────────
export const selectAllProducts = (state) => state.products.items;
export const selectProductById = (id) => (state) =>
	state.products.items.find((p) => p.id === id);

export default productsSlice.reducer;
