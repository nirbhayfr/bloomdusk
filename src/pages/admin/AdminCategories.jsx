import { useEffect, useState } from "react";
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Upload,
	Check,
	X,
	AlertTriangle,
} from "lucide-react";
import { apiRequest } from "../../utils/api";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function AdminCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	// Form states
	const [modalOpen, setModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [parentCategory, setParentCategory] = useState("");
	const [isFeatured, setIsFeatured] = useState(false);
	const [status, setStatus] = useState("active");
	const [uploadingImage, setUploadingImage] = useState(false);
	const [submitError, setSubmitError] = useState("");

	// Delete Confirmation state
	const [deleteConfirmId, setDeleteConfirmId] = useState(null);
	const [deleteError, setDeleteError] = useState("");

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			const response = await apiRequest("/category");
			setCategories(response.data || []);
		} catch (err) {
			setError(err.message || "Failed to load categories");
		} finally {
			setLoading(false);
		}
	};

	// Auto-generate slug from name
	const handleNameChange = (e) => {
		const val = e.target.value;
		setName(val);
		if (!editingCategory) {
			setSlug(
				val
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, ""),
			);
		}
	};

	const handleOpenCreate = () => {
		setEditingCategory(null);
		setName("");
		setSlug("");
		setDescription("");
		setImage("");
		setParentCategory("");
		setIsFeatured(false);
		setStatus("active");
		setSubmitError("");
		setModalOpen(true);
	};

	const handleOpenEdit = (cat) => {
		setEditingCategory(cat);
		setName(cat.name);
		setSlug(cat.slug);
		setDescription(cat.description || "");
		setImage(cat.image || "");
		setParentCategory(cat.parentCategory?._id || cat.parentCategory || "");
		setIsFeatured(cat.isFeatured || false);
		setStatus(cat.status || "active");
		setSubmitError("");
		setModalOpen(true);
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			setUploadingImage(true);
			setSubmitError("");
			const uploaded = await uploadToCloudinary(file, "bloomdusk/categories");
			setImage(uploaded.url);
		} catch (err) {
			setSubmitError("Failed to upload image. Try again.");
		} finally {
			setUploadingImage(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitError("");

		if (!name.trim()) return setSubmitError("Name is required");
		if (!slug.trim()) return setSubmitError("Slug is required");

		const payload = {
			name,
			slug,
			description,
			image: image || undefined,
			parentCategory: parentCategory || undefined,
			isFeatured,
			status,
		};

		try {
			let result;
			if (editingCategory) {
				result = await apiRequest(`/category/${editingCategory._id}`, {
					method: "PUT",
					body: JSON.stringify(payload),
				});
			} else {
				result = await apiRequest("/category", {
					method: "POST",
					body: JSON.stringify(payload),
				});
			}

			if (result) {
				setModalOpen(false);
				fetchCategories();
			}
		} catch (err) {
			setSubmitError(err.message || "Operation failed");
		}
	};

	const handleDelete = async (id) => {
		setDeleteError("");
		try {
			const result = await apiRequest(`/category/${id}`, {
				method: "DELETE",
			});
			if (result) {
				setDeleteConfirmId(null);
				fetchCategories();
			}
		} catch (err) {
			setDeleteError(err.message || "Failed to delete category");
			setTimeout(() => setDeleteError(""), 4000);
		}
	};

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="space-y-6">
			{/* ACTIONS HEAD */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1 max-w-md">
					<Search
						size={16}
						className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
					/>
					<input
						type="text"
						placeholder="Search categories..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-11 w-full rounded-2xl border border-[#9b6bff]/15 bg-white pl-11 pr-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] focus:ring-4 focus:ring-[#9b6bff]/10"
					/>
				</div>

				<button
					onClick={handleOpenCreate}
					className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0f0f0f] px-5 text-xs font-bold text-white transition hover:bg-[#9b6bff]"
				>
					<Plus size={15} />
					Create Category
				</button>
			</div>

			{/* ERRORS */}
			{deleteError && (
				<div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600 animate-slideDown">
					<AlertTriangle size={15} />
					<span>{deleteError}</span>
				</div>
			)}

			{/* CATEGORIES GRID/TABLE */}
			{loading ? (
				<div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-3 border-[#9b6bff] border-t-transparent" />
					<p className="text-xs font-semibold text-black/55">Loading categories...</p>
				</div>
			) : error ? (
				<div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-xs font-bold text-red-600">
					{error}
				</div>
			) : filteredCategories.length === 0 ? (
				<div className="rounded-3xl border border-dashed border-[#9b6bff]/15 p-12 text-center">
					<p className="text-xs font-bold text-black/45">No categories found matching your query.</p>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredCategories.map((cat) => (
						<div
							key={cat._id}
							className="group overflow-hidden rounded-3xl border border-[#9b6bff]/10 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between"
						>
							{/* Category Visual */}
							<div className="relative h-36 bg-[#9b6bff]/5 overflow-hidden flex items-center justify-center">
								{cat.image ? (
									<img
										src={cat.image}
										alt={cat.name}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								) : (
									<div className="font-serif text-lg font-bold text-[#9b6bff]/45">
										{cat.name.substring(0, 2).toUpperCase()}
									</div>
								)}

								{/* BADGES */}
								<div className="absolute left-4 top-4 flex gap-1.5">
									{cat.isFeatured && (
										<span className="rounded-lg bg-[#9b6bff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
											Featured
										</span>
									)}
									<span
										className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
											cat.status === "active"
												? "bg-emerald-500 text-white"
												: "bg-black/35 text-white"
										}`}
									>
										{cat.status}
									</span>
								</div>
							</div>

							{/* Content */}
							<div className="p-5 flex-1 flex flex-col justify-between">
								<div>
									<h4 className="font-bold text-[#0f0f0f] text-sm group-hover:text-[#9b6bff] transition-colors">
										{cat.name}
									</h4>
									<p className="text-[10px] font-mono text-black/45 mt-1">
										slug: {cat.slug}
									</p>
									{cat.parentCategory && (
										<p className="text-[10px] font-semibold text-[#9b6bff] mt-1.5">
											Subcategory of: {cat.parentCategory.name || cat.parentCategory}
										</p>
									)}
									<p className="text-xs text-black/55 line-clamp-2 mt-3 leading-relaxed">
										{cat.description || "No description provided for this fragrance class."}
									</p>
								</div>

								{/* Card actions */}
								<div className="mt-5 flex items-center justify-between border-t border-[#9b6bff]/5 pt-4">
									<button
										onClick={() => handleOpenEdit(cat)}
										className="flex items-center gap-1 text-xs font-bold text-black/55 hover:text-[#9b6bff] transition"
									>
										<Edit size={13} />
										Edit
									</button>

									{deleteConfirmId === cat._id ? (
										<div className="flex items-center gap-2 animate-fadeIn">
											<button
												onClick={() => handleDelete(cat._id)}
												className="rounded bg-rose-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-rose-700"
											>
												Confirm
											</button>
											<button
												onClick={() => setDeleteConfirmId(null)}
												className="rounded border border-black/10 px-2 py-1 text-[10px] font-bold hover:bg-black/5"
											>
												Cancel
											</button>
										</div>
									) : (
										<button
											onClick={() => setDeleteConfirmId(cat._id)}
											className="flex items-center gap-1 text-xs font-bold text-black/35 hover:text-rose-600 transition"
										>
											<Trash2 size={13} />
											Delete
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* CREATE / EDIT MODAL DRAWER */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-end p-0">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
						onClick={() => setModalOpen(false)}
					/>

					<div className="relative h-full w-full max-w-lg bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
						<div>
							<div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
								<h3 className="text-base font-bold text-[#0f0f0f]">
									{editingCategory ? `Modify Category: ${editingCategory.name}` : "Create Category"}
								</h3>
								<button
									onClick={() => setModalOpen(false)}
									className="rounded-lg p-1.5 hover:bg-black/5"
								>
									<X size={18} />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-4">
								{submitError && (
									<p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600">
										{submitError}
									</p>
								)}

								{/* NAME */}
								<div>
									<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
										Category Name
									</label>
									<input
										type="text"
										required
										value={name}
										onChange={handleNameChange}
										placeholder="e.g. Floral, Oriental, Fresh"
										className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] focus:ring-4 focus:ring-[#9b6bff]/10"
									/>
								</div>

								{/* SLUG */}
								<div>
									<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
										Slug (URL path)
									</label>
									<input
										type="text"
										required
										value={slug}
										onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
										placeholder="e.g. oriental-fragrances"
										className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] focus:ring-4 focus:ring-[#9b6bff]/10"
									/>
								</div>

								{/* PARENT CATEGORY */}
								<div>
									<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
										Parent Category (Optional)
									</label>
									<select
										value={parentCategory}
										onChange={(e) => setParentCategory(e.target.value)}
										className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] bg-white"
									>
										<option value="">-- None (Core Class) --</option>
										{categories
											.filter((c) => c._id !== editingCategory?._id)
											.map((cat) => (
												<option key={cat._id} value={cat._id}>
													{cat.name}
												</option>
											))}
									</select>
								</div>

								{/* DESCRIPTION */}
								<div>
									<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
										Description
									</label>
									<textarea
										rows="3"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Describe the notes or profile of this category..."
										className="w-full rounded-xl border border-black/10 p-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff] focus:ring-4 focus:ring-[#9b6bff]/10 resize-none"
									/>
								</div>

								{/* IMAGE UPLOAD */}
								<div>
									<label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b6bff] mb-1.5">
										Banner Image
									</label>
									<div className="grid grid-cols-[1fr_80px] gap-3">
										<div className="relative">
											<input
												type="text"
												value={image}
												onChange={(e) => setImage(e.target.value)}
												placeholder="https://image-url.com or upload below..."
												className="h-11 w-full rounded-xl border border-black/10 px-4 text-xs font-semibold outline-none transition focus:border-[#9b6bff]"
											/>
										</div>
										<label className="flex h-11 cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-[#9b6bff]/40 bg-[#9b6bff]/5 text-[10px] font-bold text-[#9b6bff] hover:bg-[#9b6bff]/10 transition-colors">
											{uploadingImage ? (
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-[#9b6bff] border-t-transparent" />
											) : (
												<>
													<Upload size={12} />
													Upload
												</>
											)}
											<input
												type="file"
												accept="image/*"
												onChange={handleImageUpload}
												className="hidden"
												disabled={uploadingImage}
											/>
										</label>
									</div>
									{image && (
										<div className="mt-3 relative h-20 w-32 rounded-xl overflow-hidden border border-black/5">
											<img src={image} alt="preview" className="h-full w-full object-cover" />
											<button
												type="button"
												onClick={() => setImage("")}
												className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
											>
												<X size={10} />
											</button>
										</div>
									)}
								</div>

								{/* TOGGLES */}
								<div className="flex gap-6 pt-2">
									<label className="flex cursor-pointer items-center gap-2">
										<input
											type="checkbox"
											checked={isFeatured}
											onChange={(e) => setIsFeatured(e.target.checked)}
											className="h-4 w-4 rounded border-gray-300 accent-[#9b6bff]"
										/>
										<span className="text-xs font-semibold text-black/65">
											Featured Category
										</span>
									</label>

									<div className="flex items-center gap-2">
										<span className="text-xs font-semibold text-black/65">Status:</span>
										<button
											type="button"
											onClick={() => setStatus(status === "active" ? "inactive" : "active")}
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
								</div>
							</form>
						</div>

						<div className="border-t border-black/5 pt-4 mt-6 flex gap-3">
							<button
								onClick={handleSubmit}
								className="flex-1 h-12 rounded-xl bg-[#0f0f0f] text-xs font-bold text-white hover:bg-[#9b6bff] transition-all duration-300 flex items-center justify-center gap-1"
							>
								<Check size={14} />
								{editingCategory ? "Save Changes" : "Create Category"}
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
