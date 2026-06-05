import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	TrendingUp,
	ShoppingBag,
	Users,
	DollarSign,
	Clock,
	CheckCircle,
	ArrowUpRight,
	Eye,
} from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminDashboard() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [stats, setStats] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const response = await apiRequest("/order/stats");
				if (response?.success) {
					setStats(response.data);
				} else {
					throw new Error("Failed to fetch dashboard data");
				}
			} catch (err) {
				setError(err.message || "Something went wrong while loading stats");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-[#9b6bff] border-t-transparent" />
				<p className="text-sm font-semibold text-black/55">Analyzing statistics...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
				<p className="text-sm font-bold text-red-600">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700"
				>
					Retry
				</button>
			</div>
		);
	}

	const {
		totalOrders = 0,
		totalProducts = 0,
		totalUsers = 0,
		totalRevenue = 0,
		statusCounts = {},
		recentOrders = [],
		salesTrend = [],
	} = stats || {};

	// Calculate delivered count and pending count
	const pendingCount = (statusCounts?.pending || 0) + (statusCounts?.confirmed || 0) + (statusCounts?.processing || 0);
	const completedCount = statusCounts?.delivered || 0;

	// Render an SVG Chart dynamically for Sales Trend
	const renderSalesChart = () => {
		if (!salesTrend?.length) {
			return (
				<div className="flex h-60 items-center justify-center text-xs text-black/35">
					No recent sales transactions recorded.
				</div>
			);
		}

		// Calculate coordinates for SVG
		const padding = 40;
		const width = 500;
		const height = 200;
		const chartWidth = width - padding * 2;
		const chartHeight = height - padding * 2;

		const maxSales = Math.max(...salesTrend.map((t) => t.sales), 100);
		const points = salesTrend
			.map((trend, index) => {
				const x = padding + (index / (salesTrend.length - 1 || 1)) * chartWidth;
				const y = padding + chartHeight - (trend.sales / maxSales) * chartHeight;
				return `${x},${y}`;
			})
			.join(" ");

		return (
			<div className="relative w-full overflow-hidden">
				<svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
					{/* Grid lines */}
					{[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
						const y = padding + ratio * chartHeight;
						const val = Math.round(maxSales * (1 - ratio));
						return (
							<g key={i}>
								<line
									x1={padding}
									y1={y}
									x2={width - padding}
									y2={y}
									className="stroke-black/5"
									strokeDasharray="4 4"
								/>
								<text
									x={padding - 8}
									y={y + 4}
									className="fill-black/30 font-semibold text-[9px] text-right"
									textAnchor="end"
								>
									₹{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
								</text>
							</g>
						);
					})}

					{/* Connection line */}
					<polyline
						fill="none"
						stroke="#9b6bff"
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						points={points}
						className="drop-shadow-[0_4px_8px_rgba(155,107,255,0.25)]"
					/>

					{/* Dots */}
					{salesTrend.map((trend, index) => {
						const x = padding + (index / (salesTrend.length - 1 || 1)) * chartWidth;
						const y = padding + chartHeight - (trend.sales / maxSales) * chartHeight;
						return (
							<g key={index} className="group/dot cursor-pointer">
								<circle
									cx={x}
									cy={y}
									r="4.5"
									className="fill-[#9b6bff] stroke-white stroke-[2px]"
								/>
								<circle
									cx={x}
									cy={y}
									r="9"
									className="fill-[#9b6bff]/20 opacity-0 group-hover/dot:opacity-100 transition-opacity"
								/>
								<title>
									{trend._id}: ₹{trend.sales} ({trend.count} orders)
								</title>
							</g>
						);
					})}

					{/* Date labels */}
					{salesTrend.map((trend, index) => {
						// Show labels for first, middle, last to avoid crowding
						if (index !== 0 && index !== salesTrend.length - 1 && salesTrend.length > 3 && index !== Math.floor(salesTrend.length / 2)) {
							return null;
						}
						const x = padding + (index / (salesTrend.length - 1 || 1)) * chartWidth;
						const dateParts = trend._id.split("-");
						const dateLabel = `${dateParts[2]}/${dateParts[1]}`;
						return (
							<text
								key={index}
								x={x}
								y={height - padding + 18}
								className="fill-black/40 font-bold text-[9px]"
								textAnchor="middle"
							>
								{dateLabel}
							</text>
						);
					})}
				</svg>
			</div>
		);
	};

	return (
		<div className="space-y-8 animate-fadeIn">
			{/* STATS OVERVIEW CARDS */}
			<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{/* REVENUE */}
				<div className="rounded-3xl border border-[#9b6bff]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-black/45">
							Total Revenue
						</span>
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
							<DollarSign size={18} />
						</div>
					</div>
					<div className="mt-4 flex items-baseline gap-1">
						<span className="text-3xl font-bold tracking-tight text-[#0f0f0f]">
							₹{totalRevenue.toLocaleString("en-IN")}
						</span>
					</div>
					<div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
						<TrendingUp size={12} />
						<span>Lifetime Gross Earnings</span>
					</div>
				</div>

				{/* ORDERS */}
				<div className="rounded-3xl border border-[#9b6bff]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-black/45">
							Total Orders
						</span>
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-[#9b6bff]">
							<ShoppingBag size={18} />
						</div>
					</div>
					<div className="mt-4">
						<span className="text-3xl font-bold tracking-tight text-[#0f0f0f]">
							{totalOrders}
						</span>
					</div>
					<div className="mt-2 text-xs font-medium text-black/45 flex gap-2">
						<span className="text-amber-600 font-bold">{pendingCount} Pending</span>
						<span>•</span>
						<span className="text-emerald-600 font-bold">{completedCount} Delivered</span>
					</div>
				</div>

				{/* PRODUCTS */}
				<div className="rounded-3xl border border-[#9b6bff]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-black/45">
							Catalog Size
						</span>
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
							<TrendingUp size={18} />
						</div>
					</div>
					<div className="mt-4">
						<span className="text-3xl font-bold tracking-tight text-[#0f0f0f]">
							{totalProducts}
						</span>
					</div>
					<div className="mt-2 text-xs font-bold text-sky-600">
						<Link to="/admin/products" className="hover:underline flex items-center gap-1">
							Manage Products
							<ArrowUpRight size={12} />
						</Link>
					</div>
				</div>

				{/* USERS */}
				<div className="rounded-3xl border border-[#9b6bff]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-black/45">
							Total Customers
						</span>
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
							<Users size={18} />
						</div>
					</div>
					<div className="mt-4">
						<span className="text-3xl font-bold tracking-tight text-[#0f0f0f]">
							{totalUsers}
						</span>
					</div>
					<div className="mt-2 text-xs font-bold text-pink-600">
						<Link to="/admin/users" className="hover:underline flex items-center gap-1">
							Manage Accounts
							<ArrowUpRight size={12} />
						</Link>
					</div>
				</div>
			</section>

			{/* CHARTS SECTION */}
			<section className="grid gap-6 lg:grid-cols-[1fr_360px]">
				{/* SALES TREND LINE CHART */}
				<div className="rounded-3xl border border-[#9b6bff]/10 bg-white p-6 shadow-sm">
					<h3 className="text-lg font-bold tracking-tight text-[#0f0f0f]">
						Sales Analytics (Last 7 Days)
					</h3>
					<p className="text-xs font-medium text-black/45 mb-6">
						Daily revenue trends in INR
					</p>
					{renderSalesChart()}
				</div>

				{/* ORDER STATUS DISTRIBUTION */}
				<div className="rounded-3xl border border-[#9b6bff]/10 bg-white p-6 shadow-sm flex flex-col justify-between">
					<div>
						<h3 className="text-lg font-bold tracking-tight text-[#0f0f0f]">
							Order Statuses
						</h3>
						<p className="text-xs font-medium text-black/45 mb-6">
							Breakdown of fulfillment cycles
						</p>

						<div className="space-y-4">
							{[
								{ label: "Pending", count: statusCounts.pending || 0, color: "bg-amber-400" },
								{ label: "Confirmed/Processing", count: (statusCounts.confirmed || 0) + (statusCounts.processing || 0), color: "bg-indigo-400" },
								{ label: "Shipped", count: statusCounts.shipped || 0, color: "bg-sky-400" },
								{ label: "Delivered", count: statusCounts.delivered || 0, color: "bg-emerald-400" },
								{ label: "Cancelled", count: statusCounts.cancelled || 0, color: "bg-rose-400" },
							].map((item, index) => {
								const percentage = totalOrders ? (item.count / totalOrders) * 100 : 0;
								return (
									<div key={index} className="space-y-1">
										<div className="flex items-center justify-between text-xs font-semibold">
											<span className="text-black/65">{item.label}</span>
											<span className="text-[#0f0f0f]">
												{item.count} ({Math.round(percentage)}%)
											</span>
										</div>
										<div className="h-2 w-full rounded-full bg-black/[0.04]">
											<div
												className={`h-full rounded-full ${item.color}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="mt-6 border-t border-[#9b6bff]/5 pt-4 text-center">
						<span className="text-xs text-black/35 font-medium">
							Total active orders: {totalOrders - (statusCounts.cancelled || 0)}
						</span>
					</div>
				</div>
			</section>

			{/* RECENT ORDERS TABLE */}
			<section className="rounded-3xl border border-[#9b6bff]/10 bg-white p-6 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-bold tracking-tight text-[#0f0f0f]">
							Recent Transactions
						</h3>
						<p className="text-xs font-medium text-black/45">
							Latest purchases made by customers
						</p>
					</div>
					<Link
						to="/admin/orders"
						className="rounded-xl border border-[#9b6bff]/25 px-4 py-2 text-xs font-bold text-[#9b6bff] transition hover:bg-[#9b6bff]/5"
					>
						View All Orders
					</Link>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-black/5 text-xs font-bold uppercase tracking-wider text-black/45">
								<th className="pb-3 pr-4">Order ID</th>
								<th className="pb-3 pr-4">Customer</th>
								<th className="pb-3 pr-4">Amount</th>
								<th className="pb-3 pr-4">Status</th>
								<th className="pb-3 pr-4">Date</th>
								<th className="pb-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-black/5">
							{recentOrders.length === 0 ? (
								<tr>
									<td colSpan="6" className="py-8 text-center text-sm text-black/35">
										No recent orders found.
									</td>
								</tr>
							) : (
								recentOrders.map((order) => {
									const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
										day: "numeric",
										month: "short",
										year: "2-digit",
									});
									return (
										<tr key={order._id} className="group/row text-xs font-medium">
											<td className="py-3.5 pr-4 font-mono text-black/45">
												#{order._id.substring(order._id.length - 8).toUpperCase()}
											</td>
											<td className="py-3.5 pr-4">
												<div className="font-bold text-[#0f0f0f]">
													{order.user?.firstName} {order.user?.lastName || ""}
												</div>
												<div className="text-[10px] text-black/45">
													{order.user?.email || "Guest User"}
												</div>
											</td>
											<td className="py-3.5 pr-4 font-bold text-[#0f0f0f]">
												₹{order.totalAmount}
											</td>
											<td className="py-3.5 pr-4">
												<span
													className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
														order.orderStatus === "delivered"
															? "bg-emerald-50 text-emerald-600"
															: order.orderStatus === "cancelled"
																? "bg-rose-50 text-rose-600"
																: "bg-amber-50 text-amber-600"
													}`}
												>
													{order.orderStatus === "delivered" ? (
														<CheckCircle size={10} />
													) : (
														<Clock size={10} />
													)}
													{order.orderStatus}
												</span>
											</td>
											<td className="py-3.5 pr-4 text-black/55">{formattedDate}</td>
											<td className="py-3.5 text-right">
												<button
													onClick={() => navigate(`/admin/orders`)}
													className="rounded-lg bg-black/[0.03] p-1.5 text-black/55 hover:bg-[#9b6bff]/10 hover:text-[#9b6bff] transition-colors"
													title="Inspect Order"
												>
													<Eye size={14} />
												</button>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
