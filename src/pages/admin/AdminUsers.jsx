import { useEffect, useState } from "react";
import {
	Search,
	Trash2,
	Shield,
	User as UserIcon,
	ChevronLeft,
	ChevronRight,
	Lock,
	Unlock,
	Mail,
	Phone,
	Calendar,
} from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState("");

	// Delete Confirmation state
	const [deleteConfirmId, setDeleteConfirmId] = useState(null);
	const [updatingId, setUpdatingId] = useState(null);
	const [actionError, setActionError] = useState("");

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const res = await apiRequest("/user");
			setUsers(res.data || []);
		} catch (err) {
			setError(err.message || "Failed to fetch users");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateUser = async (id, updates) => {
		try {
			setUpdatingId(id);
			setActionError("");
			const res = await apiRequest(`/user/${id}`, {
				method: "PUT",
				body: JSON.stringify(updates),
			});
			if (res) {
				setUsers((prev) =>
					prev.map((u) => (u._id === id ? { ...u, ...updates } : u))
				);
			}
		} catch (err) {
			setActionError(err.message || "Update failed");
			setTimeout(() => setActionError(""), 4000);
		} finally {
			setUpdatingId(null);
		}
	};

	const handleDeleteUser = async (id) => {
		try {
			setUpdatingId(id);
			const res = await apiRequest(`/user/${id}`, {
				method: "DELETE",
			});
			if (res) {
				setUsers((prev) => prev.filter((u) => u._id !== id));
				setDeleteConfirmId(null);
			}
		} catch (err) {
			setActionError(err.message || "Delete failed");
			setTimeout(() => setActionError(""), 4000);
		} finally {
			setUpdatingId(null);
		}
	};

	const filteredUsers = users.filter((u) => {
		const searchMatch =
			!searchQuery ||
			`${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.email.toLowerCase().includes(searchQuery.toLowerCase());
		const roleMatch = !roleFilter || u.role === roleFilter;
		return searchMatch && roleMatch;
	});

	const totalAdmins = users.filter((u) => u.role === "admin").length;
	const totalBlocked = users.filter((u) => u.isBlocked).length;

	return (
		<div className="space-y-6">
			{/* STAT SUMMARY */}
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="rounded-2xl border border-[#9b6bff]/10 bg-white p-4 shadow-sm">
					<p className="text-[10px] font-bold uppercase tracking-wider text-black/45">Total Users</p>
					<p className="mt-1.5 text-2xl font-bold tracking-tight text-[#0f0f0f]">{users.length}</p>
				</div>
				<div className="rounded-2xl border border-[#9b6bff]/10 bg-white p-4 shadow-sm">
					<p className="text-[10px] font-bold uppercase tracking-wider text-black/45">Admins</p>
					<p className="mt-1.5 text-2xl font-bold tracking-tight text-[#9b6bff]">{totalAdmins}</p>
				</div>
				<div className="rounded-2xl border border-[#9b6bff]/10 bg-white p-4 shadow-sm">
					<p className="text-[10px] font-bold uppercase tracking-wider text-black/45">Blocked Accounts</p>
					<p className="mt-1.5 text-2xl font-bold tracking-tight text-rose-600">{totalBlocked}</p>
				</div>
			</div>

			{/* FILTERS */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 max-w-2xl">
					<div className="relative flex-1">
						<Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" />
						<input
							type="text"
							placeholder="Search by name or email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-11 w-full rounded-2xl border border-[#9b6bff]/15 bg-white pl-11 pr-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] focus:ring-4 focus:ring-[#9b6bff]/10"
						/>
					</div>

					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="h-11 rounded-2xl border border-[#9b6bff]/15 bg-white px-4 text-xs font-semibold outline-none focus:border-[#9b6bff] min-w-[130px]"
					>
						<option value="">All Roles</option>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>
			</div>

			{/* ACTION ERROR */}
			{actionError && (
				<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600 animate-slideDown">
					{actionError}
				</div>
			)}

			{/* USERS LIST */}
			{loading ? (
				<div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#9b6bff] border-t-transparent" />
					<p className="text-xs font-semibold text-black/55">Loading user accounts...</p>
				</div>
			) : error ? (
				<div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-xs font-bold text-red-600">
					{error}
				</div>
			) : filteredUsers.length === 0 ? (
				<div className="rounded-3xl border border-dashed border-[#9b6bff]/15 p-12 text-center">
					<p className="text-xs font-bold text-black/45">No users found matching your filters.</p>
				</div>
			) : (
				<div className="bg-white rounded-3xl border border-[#9b6bff]/10 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-black/5 text-xs font-bold uppercase tracking-wider text-black/45 bg-[#F9F6FE]/50">
									<th className="py-4 px-6">User</th>
									<th className="py-4 px-6">Contact</th>
									<th className="py-4 px-6">Role</th>
									<th className="py-4 px-6">Status</th>
									<th className="py-4 px-6">Joined</th>
									<th className="py-4 px-6 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-black/5">
								{filteredUsers.map((user) => {
									const isUpdating = updatingId === user._id;
									const joinDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
										day: "numeric",
										month: "short",
										year: "numeric",
									});

									return (
										<tr key={user._id} className={`group text-xs font-medium transition-all ${isUpdating ? "opacity-60 pointer-events-none" : ""}`}>
											{/* USER */}
											<td className="py-4 px-6">
												<div className="flex items-center gap-3">
													<div
														className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
															user.role === "admin"
																? "bg-[#9b6bff]/10 text-[#9b6bff]"
																: "bg-black/[0.04] text-black/45"
														}`}
													>
														{user.firstName?.[0]?.toUpperCase()}
														{user.lastName?.[0]?.toUpperCase()}
													</div>
													<div>
														<h4 className="font-bold text-[#0f0f0f]">
															{user.firstName} {user.lastName || ""}
														</h4>
														<p className="text-[10px] font-mono text-black/35">
															{user._id.substring(user._id.length - 8).toUpperCase()}
														</p>
													</div>
												</div>
											</td>

											{/* CONTACT */}
											<td className="py-4 px-6">
												<div className="flex items-center gap-1.5 text-black/65">
													<Mail size={11} className="text-black/35 flex-shrink-0" />
													{user.email}
												</div>
												{user.phone && (
													<div className="flex items-center gap-1.5 text-black/45 mt-0.5">
														<Phone size={11} className="text-black/25 flex-shrink-0" />
														{user.phone}
													</div>
												)}
											</td>

											{/* ROLE */}
											<td className="py-4 px-6">
												<div className="flex items-center gap-2">
													<span
														className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
															user.role === "admin"
																? "bg-[#9b6bff]/10 text-[#9b6bff]"
																: "bg-black/[0.05] text-black/55"
														}`}
													>
														<Shield size={9} />
														{user.role}
													</span>
													<button
														onClick={() =>
															handleUpdateUser(user._id, {
																role: user.role === "admin" ? "user" : "admin",
															})
														}
														className="rounded-lg border border-black/10 px-2 py-1 text-[9px] font-bold text-black/45 hover:border-[#9b6bff]/40 hover:text-[#9b6bff] transition"
														title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
													>
														{user.role === "admin" ? "Demote" : "Promote"}
													</button>
												</div>
											</td>

											{/* STATUS */}
											<td className="py-4 px-6">
												<button
													onClick={() =>
														handleUpdateUser(user._id, {
															isBlocked: !user.isBlocked,
														})
													}
													className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide transition ${
														user.isBlocked
															? "bg-rose-50 text-rose-600 hover:bg-rose-100"
															: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
													}`}
												>
													{user.isBlocked ? (
														<>
															<Lock size={10} />
															Blocked
														</>
													) : (
														<>
															<Unlock size={10} />
															Active
														</>
													)}
												</button>
											</td>

											{/* JOINED DATE */}
											<td className="py-4 px-6">
												<div className="flex items-center gap-1.5 text-black/45">
													<Calendar size={11} className="text-black/25" />
													{joinDate}
												</div>
											</td>

											{/* ACTIONS */}
											<td className="py-4 px-6 text-right">
												{deleteConfirmId === user._id ? (
													<div className="flex items-center justify-end gap-1.5 animate-fadeIn">
														<button
															onClick={() => handleDeleteUser(user._id)}
															className="rounded bg-rose-600 px-2.5 py-1.5 text-[9px] font-bold text-white hover:bg-rose-700"
														>
															Confirm
														</button>
														<button
															onClick={() => setDeleteConfirmId(null)}
															className="rounded border border-black/10 px-2.5 py-1.5 text-[9px] font-bold hover:bg-black/5"
														>
															Cancel
														</button>
													</div>
												) : (
													<button
														onClick={() => setDeleteConfirmId(user._id)}
														className="rounded-lg bg-black/[0.03] p-2 text-black/35 hover:bg-rose-50 hover:text-rose-600 transition"
														title="Delete User"
													>
														<Trash2 size={14} />
													</button>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<div className="flex items-center justify-between border-t border-black/5 px-6 py-4">
						<span className="text-xs font-semibold text-black/45">
							Showing {filteredUsers.length} of {users.length} users
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
