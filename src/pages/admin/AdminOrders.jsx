import { useEffect, useState } from "react";
import {
	Search,
	Eye,
	Trash2,
	Check,
	Truck,
	Clock,
	X,
	DollarSign,
	ChevronLeft,
	ChevronRight,
	MapPin,
	User as UserIcon,
	CreditCard,
	Calendar,
	Package,
	Image as ImageIcon,
} from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminOrders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Filters & pagination
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [paymentFilter, setPaymentFilter] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 8;

	// Modal detail drawer states
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [updatingStatus, setUpdatingStatus] = useState(false);

	// Delete Confirmation state
	const [deleteConfirmId, setDeleteConfirmId] = useState(null);

	useEffect(() => {
		fetchOrders();
	}, [page, statusFilter, paymentFilter, searchQuery]);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			let url = `/order?page=${page}&limit=${limit}`;
			if (statusFilter) url += `&orderStatus=${statusFilter}`;
			if (paymentFilter) url += `&paymentStatus=${paymentFilter}`;
			if (searchQuery) url += `&search=${searchQuery}`;

			const res = await apiRequest(url);
			setOrders(res.data || []);
			setTotalPages(res.totalPages || 1);
		} catch (err) {
			setError(err.message || "Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenDrawer = (order) => {
		setSelectedOrder(order);
		setDrawerOpen(true);
	};

	const handleUpdateStatus = async (orderId, newStatus) => {
		try {
			setUpdatingStatus(true);
			const res = await apiRequest(`/order/${orderId}/status`, {
				method: "PUT",
				body: JSON.stringify({ orderStatus: newStatus }),
			});
			if (res) {
				fetchOrders();
				if (selectedOrder?._id === orderId) {
					setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
				}
			}
		} catch (err) {
			alert(err.message || "Failed to update order status");
		} finally {
			setUpdatingStatus(false);
		}
	};

	const handleMarkAsPaid = async (orderId) => {
		try {
			setUpdatingStatus(true);
			const res = await apiRequest(`/order/${orderId}/pay`, {
				method: "PUT",
			});
			if (res) {
				fetchOrders();
				if (selectedOrder?._id === orderId) {
					setSelectedOrder({ ...selectedOrder, paymentStatus: "paid", isPaid: true, orderStatus: "confirmed" });
				}
			}
		} catch (err) {
			alert(err.message || "Failed to mark order as paid");
		} finally {
			setUpdatingStatus(false);
		}
	};

	const handleDeleteOrder = async (id) => {
		try {
			const res = await apiRequest(`/order/${id}`, {
				method: "DELETE",
			});
			if (res) {
				setDeleteConfirmId(null);
				if (selectedOrder?._id === id) {
					setDrawerOpen(false);
				}
				fetchOrders();
			}
		} catch (err) {
			alert(err.message || "Failed to delete order");
		}
	};

	const getStatusBadgeClass = (status) => {
		switch (status) {
			case "delivered":
				return "bg-emerald-50 text-emerald-600";
			case "cancelled":
				return "bg-rose-50 text-rose-600";
			case "shipped":
				return "bg-sky-50 text-sky-600";
			case "processing":
				return "bg-indigo-50 text-indigo-600";
			case "confirmed":
				return "bg-violet-50 text-[#9b6bff]";
			case "pending":
			default:
				return "bg-amber-50 text-amber-600";
		}
	};

	return (
		<div className="space-y-6">
			{/* FILTERS */}
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				{/* Search & Filters Group */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 max-w-4xl">
					<div className="relative flex-1">
						<Search
							size={16}
							className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
						/>
						<input
							type="text"
							placeholder="Search by Order ID, Name, or Email..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setPage(1);
							}}
							className="h-11 w-full rounded-2xl border border-[#9b6bff]/15 bg-white pl-11 pr-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] focus:ring-4 focus:ring-[#9b6bff]/10"
						/>
					</div>

					<select
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setPage(1);
						}}
						className="h-11 rounded-2xl border border-[#9b6bff]/15 bg-white px-4 text-xs font-semibold outline-none focus:border-[#9b6bff] min-w-[140px]"
					>
						<option value="">All Statuses</option>
						<option value="pending">Pending</option>
						<option value="confirmed">Confirmed</option>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="delivered">Delivered</option>
						<option value="cancelled">Cancelled</option>
					</select>

					<select
						value={paymentFilter}
						onChange={(e) => {
							setPaymentFilter(e.target.value);
							setPage(1);
						}}
						className="h-11 rounded-2xl border border-[#9b6bff]/15 bg-white px-4 text-xs font-semibold outline-none focus:border-[#9b6bff] min-w-[140px]"
					>
						<option value="">All Payments</option>
						<option value="pending">Pending</option>
						<option value="paid">Paid</option>
						<option value="failed">Failed</option>
					</select>
				</div>
			</div>

			{/* ORDERS LIST */}
			{loading ? (
				<div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-3 border-[#9b6bff] border-t-transparent" />
					<p className="text-xs font-semibold text-black/55">Fetching customer orders...</p>
				</div>
			) : error ? (
				<div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-xs font-bold text-red-600">
					{error}
				</div>
			) : orders.length === 0 ? (
				<div className="rounded-3xl border border-dashed border-[#9b6bff]/15 p-12 text-center">
					<p className="text-xs font-bold text-black/45">No orders matched your filters.</p>
				</div>
			) : (
				<div className="bg-white rounded-3xl border border-[#9b6bff]/10 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-black/5 text-xs font-bold uppercase tracking-wider text-black/45 bg-[#F9F6FE]/50">
									<th className="py-4 px-6">Order ID</th>
									<th className="py-4 px-6">Customer</th>
									<th className="py-4 px-6">Date</th>
									<th className="py-4 px-6">Items</th>
									<th className="py-4 px-6">Total Amount</th>
									<th className="py-4 px-6">Payment</th>
									<th className="py-4 px-6">Order Status</th>
									<th className="py-4 px-6 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-black/5">
								{orders.map((order) => {
									const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
										day: "numeric",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									});
									const itemsCount = order.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;
									const isDelivered = order.orderStatus === "delivered";
									const isCancelled = order.orderStatus === "cancelled";

									return (
										<tr key={order._id} className="group text-xs font-medium">
											<td className="py-4 px-6 font-mono text-black/45">
												#{order._id.substring(order._id.length - 8).toUpperCase()}
											</td>
											<td className="py-4 px-6">
												<div className="font-bold text-[#0f0f0f]">
													{order.user?.firstName} {order.user?.lastName || ""}
												</div>
												<div className="text-[10px] text-black/45">
													{order.user?.email || "Guest"}
												</div>
											</td>
											<td className="py-4 px-6 text-black/55">{date}</td>
											<td className="py-4 px-6 font-semibold text-black/65">
												{itemsCount} {itemsCount === 1 ? "Item" : "Items"}
											</td>
											<td className="py-4 px-6 font-bold text-[#0f0f0f]">
												₹{order.totalAmount}
											</td>
											<td className="py-4 px-6">
												<div className="flex flex-col gap-0.5">
													<span className="font-bold text-black/65 capitalize">
														{order.paymentMethod}
													</span>
													<span
														className={`w-max rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
															order.paymentStatus === "paid"
																? "bg-emerald-100 text-emerald-800"
																: "bg-amber-100 text-amber-800"
														}`}
													>
														{order.paymentStatus}
													</span>
												</div>
											</td>
											<td className="py-4 px-6">
												<span
													className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${getStatusBadgeClass(
														order.orderStatus,
													)}`}
												>
													{order.orderStatus}
												</span>
											</td>
											<td className="py-4 px-6 text-right">
												<div className="flex items-center justify-end gap-2">
													{/* MARK AS DELIVERED SHORTCUT */}
													{!isDelivered && !isCancelled && (
														<button
															onClick={() => handleUpdateStatus(order._id, "delivered")}
															className="flex h-8 items-center gap-1 rounded-xl bg-emerald-50 px-2.5 text-[10px] font-bold text-emerald-600 hover:bg-emerald-100 transition"
															title="Mark as Delivered"
														>
															<Truck size={12} />
															Deliver
														</button>
													)}

													<button
														onClick={() => handleOpenDrawer(order)}
														className="rounded-lg bg-black/[0.03] p-2 text-black/55 hover:bg-[#9b6bff]/10 hover:text-[#9b6bff] transition"
														title="View Details"
													>
														<Eye size={13} />
													</button>

													{deleteConfirmId === order._id ? (
														<div className="flex items-center gap-1 animate-fadeIn">
															<button
																onClick={() => handleDeleteOrder(order._id)}
																className="rounded bg-rose-600 px-2 py-1 text-[9px] font-bold text-white hover:bg-rose-700"
															>
																Yes
															</button>
															<button
																onClick={() => setDeleteConfirmId(null)}
																className="rounded border border-black/10 px-2 py-1 text-[9px] font-bold hover:bg-black/5"
															>
																No
															</button>
														</div>
													) : (
														<button
															onClick={() => setDeleteConfirmId(order._id)}
															className="rounded bg-black/[0.03] p-2 text-black/35 hover:bg-rose-50 hover:text-rose-600 transition"
															title="Delete Entry"
														>
															<Trash2 size={13} />
														</button>
													)}
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* PAGE NAV */}
					<div className="flex items-center justify-between border-t border-black/5 px-6 py-4">
						<span className="text-xs font-semibold text-black/45">
							Page {page} of {totalPages}
						</span>
						<div className="flex gap-2">
							<button
								onClick={() => setPage((p) => Math.max(p - 1, 1))}
								disabled={page === 1}
								className="rounded-xl border border-black/10 p-2 text-black/55 hover:bg-black/5 disabled:opacity-40 transition"
							>
								<ChevronLeft size={16} />
							</button>
							<button
								onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
								disabled={page === totalPages}
								className="rounded-xl border border-black/10 p-2 text-black/55 hover:bg-black/5 disabled:opacity-40 transition"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* DETAILS DRAWER */}
			{drawerOpen && selectedOrder && (
				<div className="fixed inset-0 z-50 flex items-center justify-end p-0">
					<div
						className="absolute inset-0 bg-black/45 backdrop-blur-sm"
						onClick={() => setDrawerOpen(false)}
					/>

					<div className="relative h-full w-full max-w-xl bg-[#F9F6FE] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
						<div>
							<div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
								<div>
									<h3 className="text-base font-bold text-[#0f0f0f]">
										Order Details
									</h3>
									<p className="text-[10px] font-mono text-black/45">
										Order ID: #{selectedOrder._id}
									</p>
								</div>
								<button
									onClick={() => setDrawerOpen(false)}
									className="rounded-lg p-1.5 hover:bg-black/5"
								>
									<X size={18} />
								</button>
							</div>

							<div className="space-y-6">
								{/* SUMMARY BAR */}
								<div className="flex flex-wrap gap-4 items-center justify-between bg-white rounded-2xl border border-[#9b6bff]/5 p-4 shadow-sm">
									<div>
										<span className="block text-[9px] font-bold uppercase tracking-wider text-black/45">Fulfillment Status</span>
										<span
											className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
												selectedOrder.orderStatus,
											)}`}
										>
											{selectedOrder.orderStatus}
										</span>
									</div>

									<div>
										<span className="block text-[9px] font-bold uppercase tracking-wider text-black/45">Payment Status</span>
										<span
											className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
												selectedOrder.paymentStatus === "paid"
													? "bg-emerald-50 text-emerald-600"
													: "bg-amber-50 text-amber-600"
											}`}
										>
											{selectedOrder.paymentStatus}
										</span>
									</div>

									<div>
										<span className="block text-[9px] font-bold uppercase tracking-wider text-black/45">Grand Total</span>
										<span className="block mt-1 text-sm font-bold text-[#0f0f0f]">
											₹{selectedOrder.totalAmount}
										</span>
									</div>
								</div>

								{/* QUICK UPDATE STATUS */}
								<div className="bg-white rounded-2xl border border-[#9b6bff]/5 p-4 shadow-sm space-y-3">
									<h4 className="text-xs font-bold text-[#0f0f0f]">Manage Order Actions</h4>
									<div className="flex flex-wrap gap-2">
										{/* Delivered Shortcut */}
										{selectedOrder.orderStatus !== "delivered" && selectedOrder.orderStatus !== "cancelled" && (
											<button
												onClick={() => handleUpdateStatus(selectedOrder._id, "delivered")}
												disabled={updatingStatus}
												className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
											>
												<Check size={14} />
												Mark as Delivered
											</button>
										)}

										{/* Mark as Paid Shortcut */}
										{selectedOrder.paymentStatus !== "paid" && (
											<button
												onClick={() => handleMarkAsPaid(selectedOrder._id)}
												disabled={updatingStatus}
												className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
											>
												<DollarSign size={14} />
												Mark as Paid
											</button>
										)}

										{/* Status Dropdown */}
										<div className="flex items-center gap-1 bg-black/[0.03] border border-black/5 rounded-xl px-2 h-10 flex-1">
											<select
												value={selectedOrder.orderStatus}
												onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
												disabled={updatingStatus}
												className="bg-transparent border-0 text-xs font-semibold outline-none w-full"
											>
												<option value="pending">Pending</option>
												<option value="confirmed">Confirmed</option>
												<option value="processing">Processing</option>
												<option value="shipped">Shipped</option>
												<option value="delivered">Delivered</option>
												<option value="cancelled">Cancelled</option>
											</select>
										</div>
									</div>
								</div>

								{/* CUSTOMER INFORMATION */}
								<div className="bg-white rounded-2xl border border-[#9b6bff]/5 p-4 shadow-sm space-y-3">
									<h4 className="text-xs font-bold text-[#0f0f0f] flex items-center gap-1.5">
										<UserIcon size={14} className="text-[#9b6bff]" />
										Customer Profile
									</h4>
									<div className="text-xs space-y-1 text-black/65">
										<p><span className="font-bold text-[#0f0f0f]">Name:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName || ""}</p>
										<p><span className="font-bold text-[#0f0f0f]">Email:</span> {selectedOrder.user?.email || "Guest Purchase"}</p>
										<p><span className="font-bold text-[#0f0f0f]">Phone:</span> {selectedOrder.user?.phone || selectedOrder.shippingAddress?.phone || "N/A"}</p>
									</div>
								</div>

								{/* SHIPPING ADDRESS */}
								<div className="bg-white rounded-2xl border border-[#9b6bff]/5 p-4 shadow-sm space-y-3">
									<h4 className="text-xs font-bold text-[#0f0f0f] flex items-center gap-1.5">
										<MapPin size={14} className="text-[#9b6bff]" />
										Shipping Address
									</h4>
									<div className="text-xs text-black/65 leading-relaxed">
										<p className="font-bold text-[#0f0f0f]">{selectedOrder.shippingAddress?.name || "Recipient Name"}</p>
										<p>{selectedOrder.shippingAddress?.addressLine1 || selectedOrder.shippingAddress?.line1}</p>
										{selectedOrder.shippingAddress?.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
										<p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - <span className="font-mono font-bold text-[#0f0f0f]">{selectedOrder.shippingAddress?.pinCode || selectedOrder.shippingAddress?.pincode}</span></p>
										<p className="uppercase font-semibold text-black/45">{selectedOrder.shippingAddress?.country || "India"}</p>
									</div>
								</div>

								{/* BILLING AND PAYMENT METHOD */}
								<div className="bg-white rounded-2xl border border-[#9b6bff]/5 p-4 shadow-sm space-y-3">
									<h4 className="text-xs font-bold text-[#0f0f0f] flex items-center gap-1.5">
										<CreditCard size={14} className="text-[#9b6bff]" />
										Billing & Transactions
									</h4>
									<div className="text-xs text-black/65 space-y-1.5">
										<div className="flex justify-between">
											<span>Method:</span>
											<span className="font-bold uppercase text-[#0f0f0f]">{selectedOrder.paymentMethod}</span>
										</div>
										{selectedOrder.razorpayOrderId && (
											<div className="flex justify-between font-mono text-[10px]">
												<span>Razorpay ID:</span>
												<span>{selectedOrder.razorpayOrderId}</span>
											</div>
										)}
										<div className="flex justify-between border-t border-black/5 pt-1.5">
											<span>Subtotal:</span>
											<span>₹{selectedOrder.subTotal || selectedOrder.totalAmount}</span>
										</div>
										<div className="flex justify-between">
											<span>Shipping:</span>
											<span>₹{selectedOrder.shippingCharge || 0}</span>
										</div>
										<div className="flex justify-between font-bold text-sm text-[#0f0f0f] border-t border-[#9b6bff]/10 pt-1.5">
											<span>Total Amount Paid:</span>
											<span className="text-[#9b6bff]">₹{selectedOrder.totalAmount}</span>
										</div>
									</div>
								</div>

								{/* PRODUCT ITEMS */}
								<div className="bg-white rounded-2xl border border-[#9b6bff]/5 p-4 shadow-sm space-y-3">
									<h4 className="text-xs font-bold text-[#0f0f0f] flex items-center gap-1.5">
										<Package size={14} className="text-[#9b6bff]" />
										Ordered Items ({selectedOrder.items?.length || 0})
									</h4>
									<div className="divide-y divide-black/5">
										{selectedOrder.items?.map((item, index) => (
											<div key={index} className="py-3 flex items-center gap-3 justify-between">
												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded-lg bg-black/[0.02] border border-black/5 overflow-hidden flex items-center justify-center flex-shrink-0">
														{item.image ? (
															<img src={item.image} alt={item.title} className="h-8 w-8 object-contain" />
														) : (
															<ImageIcon size={14} className="text-black/35" />
														)}
													</div>
													<div>
														<h5 className="text-xs font-bold text-[#0f0f0f] line-clamp-1 max-w-[200px]">
															{item.title}
														</h5>
														<p className="text-[10px] text-black/45">
															Qty: {item.quantity} × ₹{item.price}
														</p>
													</div>
												</div>
												<div className="text-xs font-bold text-[#0f0f0f] text-right">
													₹{item.price * item.quantity}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="border-t border-black/5 pt-4 mt-6">
							<button
								onClick={() => setDrawerOpen(false)}
								className="w-full h-12 rounded-xl border border-black/10 text-xs font-bold text-black hover:bg-black/5 transition"
							>
								Close Detail View
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
