import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	apiRequest,
	clearStoredAuth,
	getStoredAuth,
	setStoredAuth,
} from "../utils/api";

const storedAuth = getStoredAuth();

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const result = await apiRequest("/user/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});

			setStoredAuth({ token: result.token, user: result.data });
			return { token: result.token, user: result.data };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

export const register = createAsyncThunk(
	"auth/register",
	async ({ name, email, password, confirmPassword }, { dispatch, rejectWithValue }) => {
		try {
			await apiRequest("/user/register", {
				method: "POST",
				body: JSON.stringify({ name, email, password, confirmPassword }),
			});

			return await dispatch(login({ email, password })).unwrap();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: storedAuth.user,
		token: storedAuth.token,
		loading: false,
		error: null,
	},
	reducers: {
		logout(state) {
			state.user = null;
			state.token = null;
			state.error = null;
			clearStoredAuth();
		},
		clearAuthError(state) {
			state.error = null;
		},
		updateShippingAddress(state, action) {
			if (!state.user) return;
			const { shippingAddress, phone } = action.payload;
			state.user = {
				...state.user,
				...(shippingAddress !== undefined && { shippingAddress }),
				...(phone !== undefined && { phone }),
			};
			setStoredAuth({ token: state.token, user: state.user });
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Login failed";
			})
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Registration failed";
			});
	},
});

export const { logout, clearAuthError, updateShippingAddress } =
	authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export default authSlice.reducer;
