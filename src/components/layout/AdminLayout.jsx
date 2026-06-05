import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	LayoutDashboard,
	Grid,
	Package,
	ShoppingCart,
	Users,
	ArrowLeft,
	Menu,
	X,
	LogOut,
	User as UserIcon,
} from "lucide-react";
import { logout, selectUser } from "../../store/authSlice";

export default function AdminLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	const menuItems = [
		{ path: "/admin", label: "Dashboard", icon: LayoutDashboard },
		{ path: "/admin/categories", label: "Categories", icon: Grid },
		{ path: "/admin/products", label: "Products", icon: Package },
		{ path: "/admin/orders", label: "Orders", icon: ShoppingCart },
		{ path: "/admin/users", label: "Users", icon: Users },
	];

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	const getPageTitle = () => {
		const currentItem = menuItems.find((item) => item.path === location.pathname);
		return currentItem ? currentItem.label : "Admin Control Panel";
	};

	return (
		<div className="flex min-h-screen bg-[#F9F6FE] text-[#0f0f0f] font-sans antialiased">
			{/* SIDEBAR FOR DESKTOP */}
			<aside className="hidden w-64 border-r border-[#9b6bff]/10 bg-[#0f0f0f] text-white md:flex md:flex-col">
				<div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-[#9b6bff] animate-pulse" />
						<span className="font-serif text-xl font-bold tracking-tight text-white">
							BloomDusk<span className="text-[#9b6bff]">.</span>
						</span>
					</div>
					<span className="rounded bg-[#9b6bff]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9b6bff]">
						Admin
					</span>
				</div>

				{/* NAVIGATION LINKS */}
				<nav className="flex-1 space-y-1.5 px-4 py-6">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
									isActive
										? "bg-[#9b6bff] text-white shadow-lg shadow-[#9b6bff]/20"
										: "text-white/60 hover:bg-white/5 hover:text-white"
								}`}
							>
								<Icon size={18} strokeWidth={2} />
								{item.label}
							</Link>
						);
					})}
				</nav>

				{/* FOOTER OF SIDEBAR */}
				<div className="border-t border-white/5 p-4 space-y-2">
					<Link
						to="/"
						className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-white/55 transition hover:bg-white/5 hover:text-white"
					>
						<ArrowLeft size={14} />
						Back to Storefront
					</Link>
					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
					>
						<LogOut size={14} />
						Logout
					</button>
				</div>
			</aside>

			{/* MOBILE DRAWER SIDEBAR */}
			<div
				className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
					sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => setSidebarOpen(false)}
			/>
			<aside
				className={`fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col bg-[#0f0f0f] text-white transition-transform duration-500 ease-in-out md:hidden ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
					<span className="font-serif text-xl font-bold tracking-tight text-white">
						BloomDusk<span className="text-[#9b6bff]">.</span>
					</span>
					<button
						onClick={() => setSidebarOpen(false)}
						className="rounded-lg p-1.5 hover:bg-white/5"
					>
						<X size={20} />
					</button>
				</div>
				<nav className="flex-1 space-y-1.5 px-4 py-6">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
									isActive
										? "bg-[#9b6bff] text-white shadow-lg"
										: "text-white/60 hover:bg-white/5 hover:text-white"
								}`}
							>
								<Icon size={18} />
								{item.label}
							</Link>
						);
					})}
				</nav>
				<div className="border-t border-white/5 p-4 space-y-2">
					<Link
						to="/"
						className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-white/55 transition hover:bg-white/5"
					>
						<ArrowLeft size={14} />
						Back to Storefront
					</Link>
					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
					>
						<LogOut size={14} />
						Logout
					</button>
				</div>
			</aside>

			{/* CONTENT WRAPPER */}
			<div className="flex flex-1 flex-col overflow-x-hidden">
				{/* TOP BAR */}
				<header className="flex h-20 items-center justify-between border-b border-[#9b6bff]/10 bg-white/70 px-6 backdrop-blur-md sticky top-0 z-30">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setSidebarOpen(true)}
							className="rounded-xl border border-black/5 bg-black/[0.03] p-2 hover:bg-black/[0.06] md:hidden"
						>
							<Menu size={18} />
						</button>
						<h1 className="text-xl font-bold tracking-tight text-[#0f0f0f] md:text-2xl">
							{getPageTitle()}
						</h1>
					</div>

					{/* Admin Details */}
					<div className="flex items-center gap-4">
						<div className="hidden text-right md:block">
							<p className="text-sm font-bold text-[#0f0f0f]">
								{user ? `${user.firstName} ${user.lastName || ""}` : "Administrator"}
							</p>
							<p className="text-xs font-medium text-black/45">
								{user?.email || "admin@bloomdusk.com"}
							</p>
						</div>
						<div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#9b6bff]/20 bg-[#9b6bff]/10">
							<UserIcon size={18} className="text-[#9b6bff]" />
						</div>
					</div>
				</header>

				{/* SUB PAGES OUTLET */}
				<main className="flex-1 p-6 md:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
