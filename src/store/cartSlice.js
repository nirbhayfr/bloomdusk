import { createSlice } from "@reduxjs/toolkit";

const LS_KEY = "bloomdusk_cart";

// ─── PERSIST HELPERS ─────────────────────────────────────────────────────────
export function loadCartFromStorage() {
	try {
		const raw = localStorage.getItem(LS_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

export function saveCartToStorage(items) {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(items));
	} catch {
		// storage might be unavailable — fail silently
	}
}

// ─── SLICE ────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
	name: "cart",
	initialState: {
		items: loadCartFromStorage(), // hydrate from localStorage on boot
	},
	reducers: {
		/** Add a product to cart (or increment qty if already present) */
		addToCart(state, action) {
			const payload = action.payload;
			// Supports both direct product object or { product, qty } structure
			const product = payload.product ? payload.product : payload;
			const qty = payload.qty ? payload.qty : 1;

			const existing = state.items.find((i) => i.id === product.id);
			const limit = product.stock !== undefined ? product.stock : 999;
			if (existing) {
				existing.qty = Math.min(existing.qty + qty, limit);
				if (product.stock !== undefined) {
					existing.stock = product.stock;
				}
			} else {
				state.items.push({
					id: product.id,
					name: product.name,
					category: product.category,
					price: product.price,
					image: product.image,
					qty: Math.min(qty, limit),
					stock: limit,
				});
			}
			saveCartToStorage(state.items);
		},

		/** Remove a product from cart entirely */
		removeFromCart(state, action) {
			const id = action.payload;
			state.items = state.items.filter((i) => i.id !== id);
			saveCartToStorage(state.items);
		},

		/** Adjust quantity by delta (+1 / -1). Removes item when qty reaches 0. */
		adjustQty(state, action) {
			const { id, delta } = action.payload;
			const item = state.items.find((i) => i.id === id);
			if (!item) return;
			const limit = item.stock !== undefined ? item.stock : 999;
			if (delta > 0 && item.qty >= limit) {
				return;
			}
			item.qty += delta;
			if (item.qty <= 0) {
				state.items = state.items.filter((i) => i.id !== id);
			}
			saveCartToStorage(state.items);
		},

		/** Clear cart entirely */
		clearCart(state) {
			state.items = [];
			saveCartToStorage(state.items);
		},
	},
});

export const { addToCart, removeFromCart, adjustQty, clearCart } =
	cartSlice.actions;

// ─── SELECTORS ────────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
	state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectCartTotal = (state) =>
	state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export default cartSlice.reducer;
