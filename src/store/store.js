import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productsReducer from "./productSlice";
import authReducer from "./authSlice";

const store = configureStore({
	reducer: {
		cart: cartReducer,
		products: productsReducer,
		auth: authReducer,
	},
});

export default store;
