import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productsReducer from "./productSlice";

const store = configureStore({
	reducer: {
		cart: cartReducer,
		products: productsReducer,
	},
});

export default store;
