// CheckoutPage.jsx — Full-width layout
// Left: step form  |  Right: sticky order summary
// Matches ProductPage.jsx tokens exactly — DM Sans, #F9F6FE, #9b6bff, no glassmorphism

import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
	ArrowLeft,
	ArrowUpRight,
	Minus,
	Plus,
	ShoppingBag,
	CheckCircle2,
	MapPin,
	CreditCard,
	Truck,
	Package,
	Trash2,
	ShieldCheck,
	RotateCcw,
	ChevronRight,
	Lock,
	Tag,
} from "lucide-react";
import gsap from "gsap";
import {
	selectCartItems,
	selectCartTotal,
	adjustQty,
	removeFromCart,
	clearCart,
} from "../store/cartSlice"; // adjust path if needed
import {
	selectIsAuthenticated,
	selectUser,
	updateShippingAddress,
} from "../store/authSlice";
import { apiRequest } from "../utils/api";

const shippingAddressToForm = (saved) => {
	if (!saved) return {};

	return {
		line1: saved.addressLine1 || "",
		line2: saved.addressLine2 || "",
		city: saved.city || "",
		state: saved.state || "",
		pincode: saved.pinCode || "",
		country: saved.country || "India",
	};
};

const savedCheckoutToForm = (data) => {
	if (!data) return {};

	if (data.shippingAddress || data.phone) {
		return {
			...shippingAddressToForm(data.shippingAddress),
			...(data.phone ? { phone: data.phone } : {}),
		};
	}

	return shippingAddressToForm(data);
};

const formToShippingPayload = (address) => ({
	line1: address.line1,
	line2: address.line2,
	city: address.city,
	state: address.state,
	pincode: (address.pincode || "").replace(/\D/g, ""),
	country: address.country || "India",
	phone: address.phone,
});

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const loadRazorpayScript = () =>
	new Promise((resolve, reject) => {
		if (window.Razorpay) {
			resolve(true);
			return;
		}

		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => reject(new Error("Unable to load Razorpay"));
		document.body.appendChild(script);
	});

const buildOrderPayload = ({ items, address, paymentMethod }) => ({
	items: items.map((item) => ({
		id: item.id,
		name: item.name,
		category: item.category,
		price: item.price,
		image: item.image,
		qty: item.qty,
	})),
	shippingAddress: address,
	paymentMethod,
});

/* ─────────────────────────────────────────────
   STEP BAR
───────────────────────────────────────────── */
const STEPS = [
	{ id: 1, label: "Review", icon: ShoppingBag },
	{ id: 2, label: "Address", icon: MapPin },
	{ id: 3, label: "Payment", icon: CreditCard },
];

function StepBar({ current }) {
	return (
		<div className="flex items-start gap-0">
			{STEPS.map((step, idx) => {
				const Icon = step.icon;
				const done = current > step.id;
				const active = current === step.id;
				return (
					<div key={step.id} className="flex items-center">
						<div className="flex flex-col items-center gap-1.5">
							<div
								className={`
                flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500
                ${done ? "border-[#9b6bff] bg-[#9b6bff] text-white" : ""}
                ${active ? "border-[#9b6bff] bg-[rgba(155,107,255,0.08)] text-[#9b6bff]" : ""}
                ${!done && !active ? "border-black/10 bg-black/[0.03] text-black/25" : ""}
              `}
							>
								{done ? (
									<CheckCircle2 size={16} />
								) : (
									<Icon size={15} />
								)}
							</div>
							<span
								className={`
                text-[9px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 whitespace-nowrap
                ${active ? "text-[#9b6bff]" : ""}
                ${done ? "text-black/40" : ""}
                ${!done && !active ? "text-black/20" : ""}
              `}
							>
								{step.label}
							</span>
						</div>
						{idx < STEPS.length - 1 && (
							<div
								className={`mb-4 h-px w-12 mx-2.5 transition-all duration-500 ${current > step.id ? "bg-[#9b6bff]" : "bg-black/10"}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

/* ─────────────────────────────────────────────
   RIGHT PANEL — ORDER SUMMARY (sticky)
───────────────────────────────────────────── */
function OrderSummary({ items, total, dispatch, step }) {
	const shipping = 0;

	return (
		<div className="rounded-[22px] border border-[rgba(155,107,255,0.12)] bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
			{/* Header */}
			<div className="px-6 py-5 border-b border-[rgba(155,107,255,0.1)]">
				<p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#9b6bff]">
					Order Summary
				</p>
				<p className="text-[13px] font-bold text-black/40 mt-0.5">
					{items.reduce((s, i) => s + i.qty, 0)} item
					{items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
				</p>
			</div>

			{/* Items list */}
			<div className="px-6 py-4 space-y-4 max-h-[340px] overflow-y-auto">
				{items.map((item) => (
					<div key={item.id} className="flex items-center gap-3">
						{/* Thumbnail */}
						<div className="h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-[13px] bg-[#F0E8FE] flex items-center justify-center">
							{item.image ? (
								<img
									src={item.image}
									alt={item.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<Package
									size={18}
									className="text-[#9b6bff]"
								/>
							)}
						</div>

						{/* Name + price */}
						<div className="flex-1 min-w-0">
							<p className="truncate text-[12.5px] font-extrabold text-[#0f0f0f] tracking-[-0.01em]">
								{item.name}
							</p>
							<p className="text-[10px] font-bold uppercase tracking-[1.4px] text-black/30 mt-0.5">
								{item.category}
							</p>
						</div>

						{/* Qty + price */}
						<div className="flex flex-col items-end gap-1 flex-shrink-0">
							<p className="text-[12px] font-black text-[#9b6bff]">
								₹
								{(
									item.price * item.qty
								).toLocaleString()}
							</p>
							{/* Qty — editable only on step 1 */}
							{step === 1 ? (
								<div className="flex items-center bg-black/[0.04] border border-black/[0.07] rounded-[9px] p-0.5">
									<button
										onClick={() =>
											dispatch(
												adjustQty({
													id: item.id,
													delta: -1,
												}),
											)
										}
										className="w-5 h-5 flex items-center justify-center rounded-[7px] text-[#0f0f0f] hover:bg-black/[0.06] transition-colors cursor-pointer"
									>
										<Minus
											size={9}
											strokeWidth={2.5}
										/>
									</button>
									<span className="w-5 text-center text-[11px] font-extrabold text-[#0f0f0f]">
										{item.qty}
									</span>
									<button
										onClick={() =>
											dispatch(
												adjustQty({
													id: item.id,
													delta: 1,
												}),
											)
										}
										className="w-5 h-5 flex items-center justify-center rounded-[7px] text-[#0f0f0f] hover:bg-black/[0.06] transition-colors cursor-pointer"
									>
										<Plus
											size={9}
											strokeWidth={2.5}
										/>
									</button>
								</div>
							) : (
								<span className="text-[10px] text-black/30 font-medium">
									Qty: {item.qty}
								</span>
							)}
						</div>

						{/* Remove — step 1 only */}
						{step === 1 && (
							<button
								onClick={() =>
									dispatch(removeFromCart(item.id))
								}
								className="w-6 h-6 flex items-center justify-center rounded-[8px] border border-red-200 bg-red-50 text-red-400 hover:bg-red-100 transition-all cursor-pointer flex-shrink-0"
							>
								<Trash2 size={10} />
							</button>
						)}
					</div>
				))}
			</div>

			{/* Coupon */}
			<div className="px-6 py-4 border-t border-[rgba(155,107,255,0.08)]">
				<div className="flex h-10 items-center rounded-[12px] border border-dashed border-[rgba(155,107,255,0.3)] bg-[rgba(155,107,255,0.03)] px-3 gap-2">
					<Tag
						size={13}
						className="text-[#9b6bff] flex-shrink-0"
					/>
					<input
						type="text"
						placeholder="Coupon code"
						className="flex-1 bg-transparent text-[12px] font-medium text-[#0f0f0f] placeholder-black/25 outline-none"
					/>
					<button className="text-[11px] font-bold text-[#9b6bff] hover:text-[#7e4eff] transition-colors cursor-pointer">
						Apply
					</button>
				</div>
			</div>

			{/* Totals */}
			<div className="px-6 py-5 border-t border-[rgba(155,107,255,0.1)] space-y-2.5">
				<div className="flex justify-between text-[12.5px] text-black/45 font-medium">
					<span>Subtotal</span>
					<span className="font-bold text-[#0f0f0f]">
						₹{total.toLocaleString()}
					</span>
				</div>
				<div className="flex justify-between text-[12.5px] text-black/45 font-medium">
					<span>Shipping</span>
					<span className="font-bold text-green-600">Free</span>
				</div>
				<div className="flex justify-between text-[12.5px] text-black/45 font-medium">
					<span>Tax</span>
					<span className="font-bold text-[#0f0f0f]">Incl.</span>
				</div>
				<div className="h-px bg-[rgba(155,107,255,0.12)] my-1" />
				<div className="flex justify-between">
					<span className="text-[14px] font-black tracking-[-0.02em] text-[#0f0f0f]">
						Total
					</span>
					<span className="text-[18px] font-black tracking-[-0.04em] text-[#9b6bff]">
						₹{total.toLocaleString()}
					</span>
				</div>
			</div>

			{/* Trust badges */}
			<div className="px-6 pb-5 flex items-center gap-4">
				{[
					{ icon: ShieldCheck, text: "Secure" },
					{ icon: RotateCcw, text: "30-day returns" },
					{ icon: Truck, text: "Free shipping" },
				].map(({ icon: Icon, text }) => (
					<div key={text} className="flex items-center gap-1">
						<Icon
							size={11}
							className="text-[#9b6bff] flex-shrink-0"
						/>
						<span className="text-[10px] font-semibold text-black/35">
							{text}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   STEP 1 — REVIEW  (left panel form content)
───────────────────────────────────────────── */
function StepReview({ items, onNext }) {
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center">
				<ShoppingBag size={44} className="text-black/15 mb-4" />
				<p className="text-black/40 text-base font-semibold">
					Your cart is empty.
				</p>
				<Link
					to="/"
					className="mt-6 text-[#9b6bff] text-sm font-bold hover:underline flex items-center gap-1.5"
				>
					<ArrowLeft size={14} /> Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<p className="text-[12.5px] leading-relaxed text-black/50 font-medium">
				Review the items below, then continue to enter your shipping
				address.
			</p>

			{/* Delivery estimate banner */}
			<div className="flex items-center gap-3 rounded-[14px] border border-green-200 bg-green-50 px-4 py-3">
				<Truck size={15} className="text-green-600 flex-shrink-0" />
				<p className="text-[12px] font-semibold text-green-700">
					Estimated delivery:{" "}
					<span className="font-black">5–7 business days</span> ·
					Free shipping on this order
				</p>
			</div>

			<button
				onClick={onNext}
				className="group flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0f0f0f] text-white text-[13px] font-extrabold tracking-[-0.01em] transition-all duration-300 hover:bg-[#9b6bff] cursor-pointer border-none"
			>
				Continue to Address
				<ChevronRight
					size={15}
					className="transition-transform group-hover:translate-x-1"
				/>
			</button>
		</div>
	);
}

/* ─────────────────────────────────────────────
   STEP 2 — ADDRESS
───────────────────────────────────────────── */
function StepAddress({
	address,
	setAddress,
	onNext,
	onBack,
	saveAddress,
	setSaveAddress,
	isAuthenticated,
	savingAddress,
}) {
	const fields = [
		{
			key: "name",
			label: "Full Name",
			placeholder: "John Doe",
			type: "text",
			cols: 1,
		},
		{
			key: "phone",
			label: "Phone Number",
			placeholder: "+91 98765 43210",
			type: "tel",
			cols: 1,
		},
		{
			key: "email",
			label: "Email Address",
			placeholder: "name@example.com",
			type: "email",
			cols: 2,
		},
		{
			key: "line1",
			label: "Address Line 1",
			placeholder: "Flat / House / Building",
			type: "text",
			cols: 2,
		},
		{
			key: "line2",
			label: "Address Line 2",
			placeholder: "Street, Area (optional)",
			type: "text",
			cols: 2,
		},
		{
			key: "city",
			label: "City",
			placeholder: "Mumbai",
			type: "text",
			cols: 1,
		},
		{
			key: "state",
			label: "State",
			placeholder: "Maharashtra",
			type: "text",
			cols: 1,
		},
		{
			key: "pincode",
			label: "Pincode",
			placeholder: "400 001",
			type: "text",
			cols: 1,
		},
		{
			key: "country",
			label: "Country",
			placeholder: "India",
			type: "text",
			cols: 1,
		},
	];

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onNext();
			}}
			className="space-y-6"
		>
			<div className="grid grid-cols-2 gap-4">
				{fields.map(({ key, label, placeholder, type, cols }) => (
					<div
						key={key}
						className={
							cols === 2 ? "col-span-2" : "col-span-1"
						}
					>
						<label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b6bff]">
							{label}
						</label>
						<div className="flex h-12 items-center rounded-[14px] border border-black/[0.08] bg-white px-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all focus-within:border-[#9b6bff] focus-within:shadow-[0_0_0_3px_rgba(155,107,255,0.1)]">
							<input
								type={type}
								value={address[key] || ""}
								onChange={(e) =>
									setAddress((p) => ({
										...p,
										[key]: e.target.value,
									}))
								}
								placeholder={placeholder}
								className="w-full bg-transparent text-[13px] font-medium text-[#0f0f0f] placeholder-black/25 outline-none"
								required={key !== "line2"}
							/>
						</div>
					</div>
				))}
			</div>

			{isAuthenticated && (
				<label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-black/[0.07] bg-white px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
					<input
						type="checkbox"
						checked={saveAddress}
						onChange={(e) => setSaveAddress(e.target.checked)}
						className="h-4 w-4 rounded border-black/20 text-[#9b6bff] focus:ring-[#9b6bff]"
					/>
					<span className="text-[12.5px] font-semibold text-[#0f0f0f]">
						Save this address for future orders
					</span>
				</label>
			)}

			<div className="flex gap-3">
				<button
					type="button"
					onClick={onBack}
					disabled={savingAddress}
					className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[14px] border border-black/[0.08] bg-white text-black/40 hover:border-black/20 hover:text-[#0f0f0f] transition-all cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.04)] disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<ArrowLeft size={17} />
				</button>
				<button
					type="submit"
					disabled={savingAddress}
					className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-[#0f0f0f] text-white text-[13px] font-extrabold tracking-[-0.01em] transition-all duration-300 hover:bg-[#9b6bff] cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{savingAddress ? "Saving address…" : "Continue to Payment"}
					{!savingAddress && (
						<ChevronRight
							size={15}
							className="transition-transform group-hover:translate-x-1"
						/>
					)}
				</button>
			</div>
		</form>
	);
}

/* ─────────────────────────────────────────────
   STEP 3 — PAYMENT
───────────────────────────────────────────── */
function StepPayment({ total, address, onBack, onPlace, loading }) {
	const [method, setMethod] = useState("cod");

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onPlace(method);
			}}
			className="space-y-6"
		>
			{/* Delivery recap */}
			<div className="flex items-start gap-3 rounded-[16px] border border-black/[0.07] bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
				<div className="w-8 h-8 rounded-[10px] bg-[rgba(155,107,255,0.08)] border border-[rgba(155,107,255,0.15)] flex items-center justify-center flex-shrink-0">
					<MapPin
						size={14}
						strokeWidth={2}
						className="text-[#9b6bff]"
					/>
				</div>
				<div>
					<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9b6bff] mb-0.5">
						Delivering to
					</p>
					<p className="text-[13px] font-extrabold text-[#0f0f0f] tracking-[-0.01em]">
						{address.name}
					</p>
					<p className="text-[11.5px] text-black/45 mt-0.5 font-medium">
						{address.line1}
						{address.line2 ? `, ${address.line2}` : ""},{" "}
						{address.city}, {address.state} –{" "}
						{address.pincode}
					</p>
				</div>
			</div>

			{/* Method picker */}
			<div>
				<p className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-black/35">
					Choose Payment Method
				</p>
				<div className="grid grid-cols-2 gap-3">
					{[
						{
							id: "cod",
							Icon: Truck,
							title: "Cash on Delivery",
							sub: "Pay when it arrives",
						},
						{
							id: "online",
							Icon: CreditCard,
							title: "Pay Online",
							sub: "Card / UPI / Wallet",
						},
					].map(({ id, Icon, title, sub }) => (
						<button
							key={id}
							type="button"
							onClick={() => setMethod(id)}
							className={`relative flex flex-col items-start gap-2.5 rounded-[18px] border p-4 text-left transition-all duration-300 cursor-pointer ${
								method === id
									? "border-[#9b6bff] bg-[rgba(155,107,255,0.05)] shadow-[0_4px_16px_rgba(155,107,255,0.12)]"
									: "border-black/[0.08] bg-white hover:border-black/20"
							}`}
						>
							{method === id && (
								<span className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-[#9b6bff]" />
							)}
							<div className="w-9 h-9 rounded-[12px] bg-[rgba(155,107,255,0.08)] border border-[rgba(155,107,255,0.15)] flex items-center justify-center">
								<Icon
									size={16}
									strokeWidth={2}
									className="text-[#9b6bff]"
								/>
							</div>
							<div>
								<p className="text-[13px] font-extrabold text-[#0f0f0f] tracking-[-0.01em]">
									{title}
								</p>
								<p className="text-[11px] text-black/40 font-medium mt-0.5">
									{sub}
								</p>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Card fields */}
			{method === "online" && (
				<div className="rounded-[18px] border border-black/[0.07] bg-white p-5 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
					<p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9b6bff] flex items-center gap-1.5">
						<Lock size={9} /> Razorpay Secure Checkout
					</p>
					<div className="flex items-center gap-1.5 pt-0.5">
						<ShieldCheck
							size={12}
							className="text-green-500 flex-shrink-0"
						/>
						<p className="text-[10px] font-medium text-black/35">
							You will complete UPI, card, wallet, or net
							banking payment in Razorpay's secure checkout.
						</p>
					</div>
				</div>
			)}

			{/* Actions */}
			<div className="flex gap-3">
				<button
					type="button"
					onClick={onBack}
					className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[14px] border border-black/[0.08] bg-white text-black/40 hover:border-black/20 hover:text-[#0f0f0f] transition-all cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
				>
					<ArrowLeft size={17} />
				</button>
				<button
					type="submit"
					disabled={loading}
					className={`group flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] text-white text-[13px] font-extrabold tracking-[-0.01em] transition-all duration-300 cursor-pointer border-none ${
						loading
							? "bg-[#9b6bff]/60"
							: "bg-[#0f0f0f] hover:bg-[#9b6bff]"
					}`}
				>
					{loading ? (
						<span className="flex items-center gap-2">
							<svg
								className="h-4 w-4 animate-spin"
								viewBox="0 0 24 24"
								fill="none"
							>
								<circle
									className="opacity-20"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-80"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8H4z"
								/>
							</svg>
							Placing Order…
						</span>
					) : (
						<>
							{method === "cod"
								? "Place Order"
								: "Pay & Place Order"}
							<ArrowUpRight
								size={15}
								strokeWidth={2.5}
								className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
							/>
						</>
					)}
				</button>
			</div>
		</form>
	);
}

/* ─────────────────────────────────────────────
   SUCCESS SCREEN (full-width two-col)
───────────────────────────────────────────── */
function OrderSuccess({ navigate }) {
	const ref = useRef(null);
	useEffect(() => {
		gsap.fromTo(
			ref.current,
			{ scale: 0.85, opacity: 0, y: 24 },
			{
				scale: 1,
				opacity: 1,
				y: 0,
				duration: 0.65,
				ease: "back.out(1.6)",
			},
		);
	}, []);

	return (
		<div
			ref={ref}
			className="flex flex-col items-center justify-center py-20 text-center col-span-2"
		>
			<div className="mb-6 flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[rgba(155,107,255,0.1)] border-4 border-[rgba(155,107,255,0.2)]">
				<CheckCircle2 size={40} className="text-[#9b6bff]" />
			</div>
			<p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#9b6bff] mb-2">
				Order Confirmed
			</p>
			<h2 className="text-[32px] font-black tracking-[-0.04em] text-[#0f0f0f] mb-3">
				Thank you!
			</h2>
			<p className="text-[13.5px] leading-[1.75] text-black/50 max-w-sm italic">
				Your order has been placed. A confirmation will be sent to
				your email shortly.
			</p>
			<button
				onClick={() => navigate("/")}
				className="group mt-10 flex items-center gap-2 rounded-[14px] bg-[#0f0f0f] px-8 py-3.5 text-[13px] font-extrabold text-white tracking-[-0.01em] transition-all duration-300 hover:bg-[#9b6bff] cursor-pointer border-none"
			>
				Continue Shopping
				<ChevronRight
					size={15}
					className="transition-transform group-hover:translate-x-1"
				/>
			</button>
		</div>
	);
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function CheckoutPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const items = useSelector(selectCartItems);
	const total = useSelector(selectCartTotal);
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);

	const [step, setStep] = useState(1);
	const [address, setAddress] = useState({});
	const [saveAddress, setSaveAddress] = useState(true);
	const [savingAddress, setSavingAddress] = useState(false);
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [error, setError] = useState("");

	const pageRef = useRef(null);
	const contentRef = useRef(null);

	/* Entry animation */
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(".co-header", {
				y: -12,
				opacity: 0,
				duration: 0.5,
				delay: 0.05,
				ease: "power3.out",
			});
			gsap.from(".co-left", {
				x: -24,
				opacity: 0,
				duration: 0.7,
				delay: 0.12,
				ease: "power4.out",
			});
			gsap.from(".co-right", {
				x: 24,
				opacity: 0,
				duration: 0.7,
				delay: 0.2,
				ease: "power4.out",
			});
		}, pageRef);
		return () => ctx.revert();
	}, []);

	const goToStep = (next) => {
		gsap.to(contentRef.current, {
			x: -16,
			opacity: 0,
			duration: 0.18,
			ease: "power2.in",
			onComplete: () => {
				setStep(next);
				gsap.fromTo(
					contentRef.current,
					{ x: 16, opacity: 0 },
					{
						x: 0,
						opacity: 1,
						duration: 0.28,
						ease: "power3.out",
					},
				);
			},
		});
	};

	useEffect(() => {
		if (!user) return;

		setAddress((current) => ({
			...current,
			name:
				current.name ||
				[user.firstName, user.lastName].filter(Boolean).join(" "),
			phone: current.phone || user.phone || "",
			email: current.email || user.email || "",
		}));
	}, [user]);

	useEffect(() => {
		if (!isAuthenticated) return;

		let cancelled = false;

		const loadSavedAddress = async () => {
			try {
				const result = await apiRequest("/user/address");
				if (cancelled || !result.data) return;

				const savedFields = savedCheckoutToForm(result.data);
				if (!Object.keys(savedFields).length) return;

				setAddress((current) => ({
					...current,
					...savedFields,
				}));
			} catch {
				if (cancelled || (!user?.shippingAddress && !user?.phone)) return;

				setAddress((current) => ({
					...current,
					...savedCheckoutToForm({
						shippingAddress: user.shippingAddress,
						phone: user.phone,
					}),
				}));
			}
		};

		loadSavedAddress();

		return () => {
			cancelled = true;
		};
	}, [isAuthenticated, user?._id]);

	const handleAddressNext = async () => {
		if (saveAddress && isAuthenticated) {
			setSavingAddress(true);
			setError("");

			try {
				const result = await apiRequest("/user/address", {
					method: "PUT",
					body: JSON.stringify(formToShippingPayload(address)),
				});
				dispatch(updateShippingAddress(result.data));
			} catch (addressError) {
				setError(
					addressError.message || "Unable to save address",
				);
				setSavingAddress(false);
				return;
			}

			setSavingAddress(false);
		}

		goToStep(3);
	};

	const completeOrder = () => {
		dispatch(clearCart());
		setDone(true);
	};

	const handleCodOrder = async () => {
		await apiRequest("/order", {
			method: "POST",
			body: JSON.stringify(
				buildOrderPayload({
					items,
					address,
					paymentMethod: "cod",
				}),
			),
		});

		completeOrder();
	};

	const handleRazorpayOrder = async () => {
		if (!RAZORPAY_KEY_ID) {
			throw new Error("Missing VITE_RAZORPAY_KEY_ID in frontend env");
		}

		await loadRazorpayScript();

		const checkout = await apiRequest("/order/razorpay", {
			method: "POST",
			body: JSON.stringify(
				buildOrderPayload({
					items,
					address,
					paymentMethod: "razorpay",
				}),
			),
		});

		const razorpayOrder = checkout.razorpayOrder;
		const dbOrder = checkout.order;

		await new Promise((resolve, reject) => {
			const razorpay = new window.Razorpay({
				key: RAZORPAY_KEY_ID,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
				name: "BloomDusk",
				description: "BloomDusk order payment",
				order_id: razorpayOrder.id,
				prefill: {
					name: address.name,
					email: address.email,
					contact: address.phone,
				},
				notes: {
					orderId: dbOrder._id,
				},
				theme: {
					color: "#9b6bff",
				},
				handler: async (response) => {
					try {
						await apiRequest("/payment/verify", {
							method: "POST",
							body: JSON.stringify(response),
						});
						resolve();
					} catch (paymentError) {
						reject(paymentError);
					}
				},
				modal: {
					ondismiss: () =>
						reject(new Error("Payment was cancelled")),
				},
			});

			razorpay.open();
		});

		completeOrder();
	};

	const handlePlace = async (method) => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		if (!items.length) {
			setError("Your cart is empty.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			if (method === "cod") {
				await handleCodOrder();
			} else {
				await handleRazorpayOrder();
			}
		} catch (orderError) {
			setError(orderError.message || "Unable to place order");
		} finally {
			setLoading(false);
		}
	};

	const stepTitles = [
		"Review Your Order",
		"Shipping Address",
		"Payment Details",
	];

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

			<div ref={pageRef} className="min-h-screen bg-[#F9F6FE] pt-5">
				{/* ── HEADER BAR ── */}
				<div className="co-header flex items-center justify-end px-8 md:px-12 py-5 border-b border-black/[0.06] bg-[#F9F6FE]">
					{/* Breadcrumb */}
					<div className="hidden md:flex items-center gap-2">
						<span className="text-xs text-black/35">
							Cart
						</span>
						<span className="text-xs text-black/20">·</span>
						<span className="text-xs text-[#9b6bff] font-semibold">
							Checkout
						</span>
					</div>
				</div>

				{/* ── MAIN CONTENT ── */}
				{done ? (
					/* Success — full width */
					<div className="bg-[#F9F6FE] min-h-[calc(100vh-69px)] flex items-center justify-center px-8">
						<OrderSuccess navigate={navigate} />
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] min-h-[calc(100vh-69px)]">
						{/* ── LEFT — Form panel ── */}
						<div className="co-left bg-[#F9F6FE] px-8 md:px-14 xl:px-20 pt-16 pb-16 border-r border-[rgba(155,107,255,0.1)]">
							<div className="max-w-[600px]">
								{/* Step title */}
								<p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#9b6bff] mb-1">
									Step {step} of 3
								</p>
								<h1 className="text-[clamp(24px,2.5vw,32px)] font-black tracking-[-0.04em] text-[#0f0f0f] leading-none mb-8">
									{stepTitles[step - 1]}
								</h1>

								{/* Step bar */}
								<div className="mb-10">
									<StepBar current={step} />
								</div>

								{/* Animated form content */}
								<div ref={contentRef}>
									{error && (
										<p className="mb-5 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-600">
											{error}
										</p>
									)}
									{step === 1 && (
										<StepReview
											items={items}
											onNext={() =>
												goToStep(2)
											}
										/>
									)}
									{step === 2 && (
										<StepAddress
											address={address}
											setAddress={setAddress}
											onNext={handleAddressNext}
											onBack={() =>
												goToStep(1)
											}
											saveAddress={saveAddress}
											setSaveAddress={setSaveAddress}
											isAuthenticated={isAuthenticated}
											savingAddress={savingAddress}
										/>
									)}
									{step === 3 && (
										<StepPayment
											total={total}
											address={address}
											onBack={() =>
												goToStep(2)
											}
											onPlace={handlePlace}
											loading={loading}
										/>
									)}
								</div>
							</div>
						</div>

						{/* ── RIGHT — Sticky order summary ── */}
						<div className="co-right bg-[#f0ecf8] px-6 md:px-8 pt-16 pb-16">
							<div className="sticky top-8">
								<p className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/30 mb-5">
									Your Bag
								</p>
								<OrderSummary
									items={items}
									total={total}
									dispatch={dispatch}
									step={step}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
