export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const getStoredAuth = () => {
	try {
		const token = localStorage.getItem("bloomdusk_token");
		const rawUser = localStorage.getItem("bloomdusk_user");

		return {
			token,
			user: rawUser ? JSON.parse(rawUser) : null,
		};
	} catch {
		return { token: null, user: null };
	}
};

export const setStoredAuth = ({ token, user }) => {
	localStorage.setItem("bloomdusk_token", token);
	localStorage.setItem("bloomdusk_user", JSON.stringify(user));
	if (user && user.role) {
		localStorage.setItem("bloomdusk_role", user.role);
	}
};

export const clearStoredAuth = () => {
	localStorage.removeItem("bloomdusk_token");
	localStorage.removeItem("bloomdusk_user");
	localStorage.removeItem("bloomdusk_role");
};


export const apiRequest = async (path, options = {}) => {
	const { token } = getStoredAuth();
	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data.message || data.error || "Request failed");
	}

	return data;
};
