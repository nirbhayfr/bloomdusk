import { useEffect, useState } from "react";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Upload,
	Check,
	X,
	Package,
	ChevronLeft,
	ChevronRight,
	Image as ImageIcon,
} from "lucide-react";
import { apiRequest } from "../../utils/api";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Pagination & filters
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [stockFilter, setStockFilter] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 8;

	// Modal states
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [submitError, setSubmitError] = useState("");
	const [uploading, setUploading] = useState(false);

	// Form field states
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [originalPrice, setOriginalPrice] = useState("");
	const [stock, setStock] = useState("");
	const [sku, setSku] = useState("");
	const [category, setCategory] = useState("");
	const [images, setImages] = useState([]); // array of objects/strings
	const [size, setSize] = useState("");
	const [status, setStatus] = useState("active");

	// Notes states
	const [topNotes, setTopNotes] = useState("");
	const [heartNotes, setHeartNotes] = useState("");
	const [baseNotes, setBaseNotes] = useState("");

	// Tags & Colors
	const [tags, setTags] = useState("");
	const [bg, setBg] = useState("#F9F6FE");
	const [accent, setAccent] = useState("#9b6bff");
	const [textColor, setTextColor] = useState("#0f0f0f");
	const [subColor, setSubColor] = useState("#e7def8");

	// Delete Confirmation state
	const [deleteConfirmId, setDeleteConfirmId] = useState(null);

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [page, categoryFilter, searchQuery, statusFilter, stockFilter]);

	const fetchCategories = async () => {
		try {
			const res = await apiRequest("/category");
			setCategories(res.data || []);
		} catch (err) {
			console.error("Failed to load categories", err);
		}
	};

	const fetchProducts = async () => {
		try {
			setLoading(true);
			let url = `/product?page=${page}&limit=${limit}`;
			if (categoryFilter) url += `&category=${categoryFilter}`;
			if (searchQuery) url += `&search=${searchQuery}`;
			if (statusFilter) url += `&status=${statusFilter}`;
			if (stockFilter) url += `&stock=${stockFilter}`;

			const res = await apiRequest(url);
			setProducts(res.data || []);
			setTotalPages(res.totalPages || 1);
		} catch (err) {
			setError(err.message || "Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenCreate = () => {
		setEditingProduct(null);
		setTitle("");
		setDescription("");
		setPrice("");
		setOriginalPrice("");
		setStock("");
		setSku("");
		setCategory(categories[0]?._id || "");
		setImages([]);
		setSize("");
		setStatus("active");
		setTopNotes("");
		setHeartNotes("");
		setBaseNotes("");
		setTags("");
		setBg("#F9F6FE");
		setAccent("#9b6bff");
		setTextColor("#0f0f0f");
		setSubColor("#e7def8");
		setSubmitError("");
		setModalOpen(true);
	};

	const handleOpenEdit = (prod) => {
		setEditingProduct(prod);
		setTitle(prod.title || "");
		setDescription(prod.description || "");
		setPrice(prod.price || "");
		setOriginalPrice(prod.originalPrice || "");
		setStock(prod.stock || "");
		setSku(prod.sku || "");
		setCategory(prod.category?._id || prod.category || "");
		setImages(prod.images || []);
		setSize(prod.size || "");
		setStatus(prod.status || "active");
		setTopNotes(prod.notes?.top?.join(", ") || "");
		setHeartNotes(prod.notes?.heart?.join(", ") || "");
		setBaseNotes(prod.notes?.base?.join(", ") || "");
		setTags(prod.tags?.join(", ") || "");
		setBg(prod.bg || "#F9F6FE");
		setAccent(prod.accent || "#9b6bff");
		setTextColor(prod.textColor || "#0f0f0f");
		setSubColor(prod.subColor || "#e7def8");
		setSubmitError("");
		setModalOpen(true);
	};

	const handleImageUpload = async (e) => {
		const files = Array.from(e.target.files);
		if (files.length === 0) return;

		try {
			setUploading(true);
			setSubmitError("");
			const uploadedUrls = [];
			for (const file of files) {
				const uploaded = await uploadToCloudinary(file, "bloomdusk/products");
				uploadedUrls.push({ url: uploaded.url });
			}
			setImages([...images, ...uploadedUrls]);
		} catch (err) {
			setSubmitError("Failed to upload one or more images");
		} finally {
			setUploading(false);
		}
	};

	const handleRemoveImage = (index) => {
		setImages(images.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitError("");

		if (!title.trim()) return setSubmitError("Product title is required");
		if (!price || Number(price) < 0) return setSubmitError("Valid price is required");

		const productData = {
			title,
			description,
			price: Number(price),
			originalPrice: originalPrice ? Number(originalPrice) : undefined,
			stock: stock ? Number(stock) : 0,
			sku: sku || undefined,
			category: category || undefined,
			images: images.map(img => typeof img === "string" ? { url: img } : { url: img.url }),
			size: size || undefined,
			status,
			notes: {
				top: topNotes ? topNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
				heart: heartNotes ? heartNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
				base: baseNotes ? baseNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
			},
			tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
			bg,
			accent,
			textColor,
			subColor,
		};

		try {
			let res;
			if (editingProduct) {
				res = await apiRequest(`/product/${editingProduct._id}`, {
					method: "PUT",
					body: JSON.stringify(productData),
				});
			} else {
				res = await apiRequest("/product", {
					method: "POST",
					body: JSON.stringify(productData),
				});
			}

			if (res) {
				setModalOpen(false);
				fetchProducts();
			}
		} catch (err) {
			setSubmitError(err.message || "Failed to save product");
		}
	};

	const handleDelete = async (id) => {
		try {
			const res = await apiRequest(`/product/${id}`, {
				method: "DELETE",
			});
			if (res) {
				setDeleteConfirmId(null);
				fetchProducts();
			}
		} catch (err) {
			alert(err.message || "Failed to delete product");
		}
	};

	return (
		<div className="space-y-6">
			{/* CONTROL HEADER */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* Search & Category Filter */}
				<div className="flex flex-wrap gap-3 items-center flex-1 max-w-4xl">
					<div className="relative flex-1 min-w-[200px]">
						<Search
							size={16}
							className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
						/>
						<input
							type="text"
							placeholder="Search products..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setPage(1);
							}}
							className="h-11 w-full rounded-2xl border border-[#9b6bff]/15 bg-white pl-11 pr-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] focus:ring-4 focus:ring-[#9b6bff]/10"
						/>
					</div>

					<select
						value={categoryFilter}
						onChange={(e) => {
							setCategoryFilter(e.target.value);
							setPage(1);
						}}
						className="h-11 rounded-2xl border border-[#9b6bff]/15 bg-white px-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] min-w-[150px]"
					>
						<option value="">All Categories</option>
						{categories.map((cat) => (
							<option key={cat._id} value={cat._id}>
								{cat.name}
							</option>
						))}
					</select>

					<select
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setPage(1);
						}}
						className="h-11 rounded-2xl border border-[#9b6bff]/15 bg-white px-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] min-w-[130px]"
					>
						<option value="">All Statuses</option>
						<option value="active">Active</option>
						<option value="draft">Draft</option>
					</select>

					<select
						value={stockFilter}
						onChange={(e) => {
							setStockFilter(e.target.value);
							setPage(1);
						}}
						className="h-11 rounded-2xl border border-[#9b6bff]/15 bg-white px-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] min-w-[150px]"
					>
						<option value="">All Stock Levels</option>
						<option value="in">In Stock</option>
						<option value="low">Low Stock</option>
						<option value="out">Out of Stock</option>
					</select>
				</div>

				<button
					onClick={handleOpenCreate}
					className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0f0f0f] px-5 text-xs font-bold text-white transition hover:bg-[#9b6bff]"
				>
					<Plus size={15} />
					Add Product
				</button>
			</div>

			{/* LIST GRID */}
			{loading ? (
				<div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-3 border-[#9b6bff] border-t-transparent" />
					<p className="text-xs font-semibold text-black/55">Fetching catalog products...</p>
				</div>
			) : error ? (
				<div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-xs font-bold text-red-600">
					{error}
				</div>
			) : products.length === 0 ? (
				<div className="rounded-3xl border border-dashed border-[#9b6bff]/15 p-12 text-center">
					<p className="text-xs font-bold text-black/45 font-serif">No products found matching filters.</p>
				</div>
			) : (
				<div className="bg-white rounded-3xl border border-[#9b6bff]/10 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-black/5 text-xs font-bold uppercase tracking-wider text-black/45 bg-[#F9F6FE]/50">
									<th className="py-4 px-6">Product</th>
									<th className="py-4 px-6">SKU / Size</th>
									<th className="py-4 px-6">Category</th>
									<th className="py-4 px-6">Price</th>
									<th className="py-4 px-6">Stock</th>
									<th className="py-4 px-6">Status</th>
									<th className="py-4 px-6 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-black/5">
								{products.map((prod) => (
									<tr key={prod._id} className="group text-xs font-medium">
										{/* Details */}
										<td className="py-4 px-6">
											<div className="flex items-center gap-3">
												<div className="h-12 w-12 rounded-xl bg-black/[0.03] overflow-hidden flex items-center justify-center border border-black/5 flex-shrink-0">
													{prod.images?.[0]?.url ? (
														<img
															src={prod.images[0].url}
															alt={prod.title}
															className="h-10 w-10 object-contain drop-shadow"
														/>
													) : (
														<ImageIcon size={16} className="text-black/35" />
													)}
												</div>
												<div>
													<h4 className="font-bold text-[#0f0f0f] text-xs">
														{prod.title}
													</h4>
													<p className="text-[10px] text-black/45 font-mono line-clamp-1 max-w-[180px]">
														ID: {prod._id}
													</p>
												</div>
											</div>
										</td>

										{/* SKU/Size */}
										<td className="py-4 px-6">
											<div className="font-mono text-black/65">{prod.sku || "N/A"}</div>
											<div className="text-[10px] text-[#9b6bff] font-bold">{prod.size || "N/A"}</div>
										</td>

										{/* Category */}
										<td className="py-4 px-6">
											<span className="font-bold text-black/65">
												{prod.category?.name || prod.categoryName || "Uncategorized"}
											</span>
										</td>

										{/* Price */}
										<td className="py-4 px-6">
											<div className="font-bold text-[#0f0f0f]">₹{prod.price}</div>
											{prod.originalPrice && (
												<div className="text-[10px] text-black/35 line-through font-bold">
													₹{prod.originalPrice}
												</div>
											)}
										</td>

										{/* Stock */}
										<td className="py-4 px-6">
											<span
												className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
													prod.stock === 0
														? "bg-rose-50 text-rose-600"
														: prod.stock <= 5
															? "bg-amber-50 text-amber-600 animate-pulse"
															: "bg-[#9b6bff]/5 text-[#9b6bff]"
												}`}
											>
												<Package size={10} />
												{prod.stock === 0 ? "Out of Stock" : `${prod.stock} Units`}
											</span>
										</td>

										{/* Status */}
										<td className="py-4 px-6">
											<span
												className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
													prod.status === "active"
														? "bg-emerald-50 text-emerald-600"
														: "bg-black/[0.05] text-black/45"
												}`}
											>
												{prod.status}
											</span>
										</td>

										{/* Actions */}
										<td className="py-4 px-6 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => handleOpenEdit(prod)}
													className="rounded-lg bg-black/[0.03] p-2 text-black/55 hover:bg-[#9b6bff]/10 hover:text-[#9b6bff] transition"
												>
													<Edit size={13} />
												</button>

												{deleteConfirmId === prod._id ? (
													<div className="flex items-center gap-1.5 animate-fadeIn">
														<button
															onClick={() => handleDelete(prod._id)}
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
														onClick={() => setDeleteConfirmId(prod._id)}
														className="rounded bg-black/[0.03] p-2 text-black/35 hover:bg-rose-50 hover:text-rose-600 transition"
													>
														<Trash2 size={13} />
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* PAGINATION CONTROLS */}
					<div className="flex items-center justify-between border-t border-black/5 px-6 py-4">
						<span className="text-xs font-semibold text-black/45">
							Page {page} of {totalPages}
						</span>
						<div className="flex gap-2">
							<button
								onClick={() => setPage(p => Math.max(p - 1, 1))}
								disabled={page === 1}
								className="rounded-xl border border-black/10 p-2 text-black/55 hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent transition"
							>
								<ChevronLeft size={16} />
							</button>
							<button
								onClick={() => setPage(p => Math.min(p + 1, totalPages))}
								disabled={page === totalPages}
								className="rounded-xl border border-black/10 p-2 text-black/55 hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent transition"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* MODAL SLIDE DRAWER */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-end p-0">
					<div
						className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
						onClick={() => setModalOpen(false)}
					/>

					<div className="relative h-full w-full max-w-2xl bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
						<div>
							<div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
								<h3 className="text-base font-bold text-[#0f0f0f]">
									{editingProduct ? `Edit Product: ${editingProduct.title}` : "Add Product to Catalog"}
								</h3>
								<button
									onClick={() => setModalOpen(false)}
									className="rounded-lg p-1.5 hover:bg-black/5"
								>
									<X size={18} />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-5">
								{submitError && (
									<p className="rounded-xl bg-red-50 p-3.5 text-xs font-bold text-red-600">
										{submitError}
									</p>
								)}

								<div className="grid gap-4 sm:grid-cols-2">
									{/* TITLE */}
									<div className="sm:col-span-2">
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											Product Title
										</label>
										<input
											type="text"
											required
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											placeholder="e.g. Marine Noir EAU De Parfum"
											className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff]"
										/>
									</div>

									{/* DESCRIPTION */}
									<div className="sm:col-span-2">
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											Description
										</label>
										<textarea
											rows="3"
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											placeholder="Describe the aromatic story, notes, longevity..."
											className="w-full rounded-xl border border-black/10 p-4 text-xs font-semibold outline-none focus:border-[#9b6bff] resize-none"
										/>
									</div>

									{/* CATEGORY */}
									<div>
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											Category
										</label>
										<select
											value={category}
											onChange={(e) => setCategory(e.target.value)}
											className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff] bg-white"
										>
											{categories.map((cat) => (
												<option key={cat._id} value={cat._id}>
													{cat.name}
												</option>
											))}
										</select>
									</div>

									{/* SKU */}
									<div>
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											SKU / Code
										</label>
										<input
											type="text"
											value={sku}
											onChange={(e) => setSku(e.target.value.toUpperCase())}
											placeholder="e.g. BD-MN-100"
											className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff]"
										/>
									</div>

									{/* PRICE */}
									<div>
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											Price (₹)
										</label>
										<input
											type="number"
											required
											value={price}
											onChange={(e) => setPrice(e.target.value)}
											placeholder="e.g. 2499"
											className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff]"
										/>
									</div>

									{/* ORIGINAL PRICE */}
									<div>
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											Original Price (Optional)
										</label>
										<input
											type="number"
											value={originalPrice}
											onChange={(e) => setOriginalPrice(e.target.value)}
											placeholder="e.g. 3499"
											className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff]"
										/>
									</div>

									{/* STOCK */}
									<div>
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											Stock Level
										</label>
										<input
											type="number"
											value={stock}
											onChange={(e) => setStock(e.target.value)}
											placeholder="e.g. 50"
											className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff]"
										/>
									</div>

									{/* SIZE */}
									<div>
										<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
											Bottle Size (e.g. 50ml, 100ml)
										</label>
										<input
											type="text"
											value={size}
											onChange={(e) => setSize(e.target.value)}
											placeholder="e.g. 100ml"
											className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff]"
										/>
									</div>
								</div>

								{/* FRAGRANCE PYRAMID NOTES */}
								<div className="border-t border-black/5 pt-4">
									<h4 className="text-xs font-bold text-[#0f0f0f] mb-3">Fragrance Notes (Comma separated)</h4>
									<div className="grid gap-4 sm:grid-cols-3">
										<div>
											<label className="block text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
												Top Notes
											</label>
											<input
												type="text"
												value={topNotes}
												onChange={(e) => setTopNotes(e.target.value)}
												placeholder="Bergamot, Sea Salt"
												className="h-10 w-full rounded-xl border border-black/10 px-3 text-xs font-semibold outline-none focus:border-[#9b6bff]"
											/>
										</div>
										<div>
											<label className="block text-[10px] font-bold uppercase tracking-wider text-pink-600 mb-1">
												Heart Notes
											</label>
											<input
												type="text"
												value={heartNotes}
												onChange={(e) => setHeartNotes(e.target.value)}
												placeholder="Jasmine, Lavender"
												className="h-10 w-full rounded-xl border border-black/10 px-3 text-xs font-semibold outline-none focus:border-[#9b6bff]"
											/>
										</div>
										<div>
											<label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
												Base Notes
											</label>
											<input
												type="text"
												value={baseNotes}
												onChange={(e) => setBaseNotes(e.target.value)}
												placeholder="Wood, Musk, Amber"
												className="h-10 w-full rounded-xl border border-black/10 px-3 text-xs font-semibold outline-none focus:border-[#9b6bff]"
											/>
										</div>
									</div>
								</div>

								{/* IMAGES UPLOAD SECTION */}
								<div className="border-t border-black/5 pt-4">
									<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
										Product Images
									</label>
									<div className="flex flex-wrap gap-3 mb-3">
										{images.map((img, index) => (
											<div key={index} className="relative h-20 w-20 rounded-xl overflow-hidden border border-black/5 bg-black/[0.02] flex items-center justify-center">
												<img src={img.url || img} alt="uploaded" className="h-18 w-18 object-contain" />
												<button
													type="button"
													onClick={() => handleRemoveImage(index)}
													className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
												>
													<X size={10} />
												</button>
											</div>
										))}

										<label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#9b6bff]/40 bg-[#9b6bff]/5 text-[#9b6bff] hover:bg-[#9b6bff]/10 transition-colors">
											{uploading ? (
												<div className="h-5 w-5 animate-spin rounded-full border-2 border-[#9b6bff] border-t-transparent" />
											) : (
												<>
													<Upload size={16} />
													<span className="text-[9px] font-bold">Add Images</span>
												</>
											)}
											<input
												type="file"
												accept="image/*"
												multiple
												onChange={handleImageUpload}
												className="hidden"
												disabled={uploading}
											/>
										</label>
									</div>
								</div>

								{/* STYLING CONFIG (BG, Accent, etc.) & TAGS */}
								<div className="border-t border-black/5 pt-4">
									<h4 className="text-xs font-bold text-[#0f0f0f] mb-3">Styling & Tags</h4>
									<div className="grid gap-4 sm:grid-cols-2">
										{/* TAGS */}
										<div className="sm:col-span-2">
											<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
												Tags (Comma separated)
											</label>
											<input
												type="text"
												value={tags}
												onChange={(e) => setTags(e.target.value)}
												placeholder="e.g. Summer, New, Bestseller"
												className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none focus:border-[#9b6bff]"
											/>
										</div>

										{/* Theme Colors */}
										<div className="sm:col-span-2 grid grid-cols-4 gap-2">
											<div>
												<label className="block text-[9px] font-bold text-black/55 mb-1 text-center">Background</label>
												<div className="flex items-center gap-1.5 border border-black/10 rounded-xl px-2 h-10 bg-white">
													<input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-6 w-6 cursor-pointer rounded-md bg-transparent border-0" />
													<span className="text-[9px] font-mono font-semibold text-black/45">{bg}</span>
												</div>
											</div>
											<div>
												<label className="block text-[9px] font-bold text-black/55 mb-1 text-center">Accent</label>
												<div className="flex items-center gap-1.5 border border-black/10 rounded-xl px-2 h-10 bg-white">
													<input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-6 w-6 cursor-pointer rounded-md bg-transparent border-0" />
													<span className="text-[9px] font-mono font-semibold text-black/45">{accent}</span>
												</div>
											</div>
											<div>
												<label className="block text-[9px] font-bold text-black/55 mb-1 text-center">Text</label>
												<div className="flex items-center gap-1.5 border border-black/10 rounded-xl px-2 h-10 bg-white">
													<input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded-md bg-transparent border-0" />
													<span className="text-[9px] font-mono font-semibold text-black/45">{textColor}</span>
												</div>
											</div>
											<div>
												<label className="block text-[9px] font-bold text-black/55 mb-1 text-center">Subcolor</label>
												<div className="flex items-center gap-1.5 border border-black/10 rounded-xl px-2 h-10 bg-white">
													<input type="color" value={subColor} onChange={(e) => setSubColor(e.target.value)} className="h-6 w-6 cursor-pointer rounded-md bg-transparent border-0" />
													<span className="text-[9px] font-mono font-semibold text-black/45">{subColor}</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* STATUS */}
								<div className="flex items-center gap-2 border-t border-black/5 pt-4">
									<span className="text-xs font-semibold text-black/65">Status:</span>
									<button
										type="button"
										onClick={() => setStatus(status === "active" ? "draft" : "active")}
										className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
											status === "active" ? "bg-emerald-500" : "bg-black/25"
										}`}
									>
										<div
											className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
												status === "active" ? "translate-x-5" : "translate-x-0"
											}`}
										/>
									</button>
									<span className="text-xs font-bold text-[#0f0f0f] uppercase">
										{status}
									</span>
								</div>
							</form>
						</div>

						<div className="border-t border-black/5 pt-4 mt-6 flex gap-3">
							<button
								onClick={handleSubmit}
								className="flex-1 h-12 rounded-xl bg-[#0f0f0f] text-xs font-bold text-white hover:bg-[#9b6bff] transition-all duration-300 flex items-center justify-center gap-1"
							>
								<Check size={14} />
								{editingProduct ? "Save Changes" : "Publish Product"}
							</button>
							<button
								onClick={() => setModalOpen(false)}
								className="flex-1 h-12 rounded-xl border border-black/10 text-xs font-bold text-black/65 hover:bg-black/5"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
