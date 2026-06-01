import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../utils/api";

const THEME_DEFAULTS = [
	{
		bg: "#eef3f8",
		accent: "#1a3a5c",
		textColor: "#111111",
		subColor: "#666666",
	},
	{
		bg: "#f8f4ee",
		accent: "#5c3a1a",
		textColor: "#111111",
		subColor: "#666666",
	},
	{
		bg: "#f8eef0",
		accent: "#5c1a2e",
		textColor: "#111111",
		subColor: "#666666",
	},
];

const getCategoryName = (product) => {
	if (typeof product.category === "object" && product.category?.name) {
		return product.category.name;
	}

	return product.categoryName || product.category || "Fragrance";
};

export const normalizeProduct = (product, index = 0) => {
	const theme = THEME_DEFAULTS[index % THEME_DEFAULTS.length];
	const images = product.images?.length
		? product.images.map((image) => image.url || image).filter(Boolean)
		: product.image
			? [product.image]
			: ["/bottle.png"];

	return {
		...theme,
		...product,
		id: product.slug || product._id || product.id,
		backendId: product._id,
		name: product.title || product.name,
		category: getCategoryName(product),
		price: product.price,
		originalPrice: product.originalPrice,
		size: product.size || "50ml",
		description: product.description || "",
		notes: product.notes || {
			top: [],
			heart: [],
			base: [],
		},
		tags: product.tags || [],
		rating: product.ratingAverage || product.rating || 4.8,
		reviews: product.ratingCount || product.reviews || 0,
		image: images[0],
		images,
	};
};

export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/product?status=active&limit=100&sort=oldest`,
			);

			if (!response.ok) {
				throw new Error("Unable to fetch products");
			}

			const result = await response.json();
			return (result.data || []).map(normalizeProduct);
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const productsSlice = createSlice({
	name: "products",
	initialState: {
		items: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Unable to fetch products";
			});
	},
});

// ─── SELECTORS ────────────────────────────────────────────────────────────────
export const selectAllProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductById = (id) => (state) =>
	state.products.items.find((p) => String(p.id) === String(id));

export default productsSlice.reducer;
