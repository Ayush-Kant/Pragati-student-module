import "./Offers.css";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiMoreVertical,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import { Eye, Pencil, Trash2, X, Download } from "lucide-react";

// ─── Static Data ─────────────────────────────────────────────────────────────

const initialOffersData = [
  {
    id: 1,
    initials: "RP",
    name: "Rahul Patil",
    role: "Senior Software Engineer",
    package: "₹18 LPA",
    status: "Accepted",
    joining: "Jul 1, 2026",
  },
  {
    id: 2,
    initials: "SR",
    name: "Sneha Reddy",
    role: "UI/UX Designer",
    package: "₹12 LPA",
    status: "Pending",
    joining: "Jul 15, 2026",
  },
  {
    id: 3,
    initials: "AK",
    name: "Amit Kumar",
    role: "Product Manager",
    package: "₹22 LPA",
    status: "Accepted",
    joining: "Jun 20, 2026",
  },
  {
    id: 4,
    initials: "PS",
    name: "Priya Sharma",
    role: "Data Analyst",
    package: "₹14 LPA",
    status: "Sent",
    joining: "Jul 10, 2026",
  },
  {
    id: 5,
    initials: "RV",
    name: "Ravi Verma",
    role: "DevOps Engineer",
    package: "₹16 LPA",
    status: "Accepted",
    joining: "Jul 5, 2026",
  },
  {
    id: 6,
    initials: "MI",
    name: "Meera Iyer",
    role: "Full Stack Developer",
    package: "₹15 LPA",
    status: "Declined",
    joining: "Jun 25, 2026",
  },
];

const OFFER_STATUSES = ["Accepted", "Pending", "Sent", "Declined"];

// ─── Row Action Menu ──────────────────────────────────────────────────────────

const OfferActionsMenu = ({ offer, onView, onEdit, onDownload, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleAction = (fn) => (e) => {
    e.stopPropagation();
    setIsOpen(false);
    fn(offer);
  };

  return (
    <div className="offer-actions-wrapper" ref={menuRef}>
      <button
        className="offer-menu-btn"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label="Open actions menu"
      >
        <FiMoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="offer-dropdown-menu">
          <button className="offer-dropdown-item" onClick={handleAction(onView)}>
            <Eye size={15} className="offer-dropdown-icon" />
            View Offer
          </button>
          <button className="offer-dropdown-item" onClick={handleAction(onEdit)}>
            <Pencil size={15} className="offer-dropdown-icon" />
            Edit Offer
          </button>
          <button className="offer-dropdown-item" onClick={handleAction(onDownload)}>
            <Download size={15} className="offer-dropdown-icon" />
            Download Offer
          </button>
          <div className="offer-dropdown-divider" />
          <button
            className="offer-dropdown-item offer-dropdown-item--danger"
            onClick={handleAction(onDelete)}
          >
            <Trash2 size={15} className="offer-dropdown-icon" />
            Delete Offer
          </button>
        </div>
      )}
    </div>
  );
};

// ─── View Offer Modal ─────────────────────────────────────────────────────────

const ViewOfferModal = ({ offer, onClose }) => (
  <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="responsive-modal-panel bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Offer Details</h3>
          <p className="text-sm text-gray-500 mt-1">Full offer information</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-8 space-y-6">
        {/* Candidate */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-sky-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {offer.initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
              Candidate Name
            </p>
            <p className="text-gray-900 font-semibold text-[16px]">{offer.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Role
            </p>
            <p className="text-gray-800 font-medium text-[15px]">{offer.role}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Package
            </p>
            <p className="text-gray-800 font-semibold text-[15px]">{offer.package}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Status
            </p>
            <span className={`status-badge ${offer.status.toLowerCase()}`}>
              {offer.status}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Joining Date
            </p>
            <div className="joining-date" style={{ marginTop: 2 }}>
              <FiCalendar />
              <span className="text-gray-800 font-medium text-[15px]">{offer.joining}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── Edit Offer Modal ─────────────────────────────────────────────────────────

const EditOfferModal = ({ offer, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: offer.name || "",
    role: offer.role || "",
    package: offer.package || "",
    status: offer.status || "",
    joining: offer.joining || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Candidate name is required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.package.trim()) newErrors.package = "Package is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!form.joining.trim()) newErrors.joining = "Joining date is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({
      ...offer,
      name: form.name.trim(),
      role: form.role.trim(),
      package: form.package.trim(),
      status: form.status,
      joining: form.joining.trim(),
      initials: form.name.trim().slice(0, 2).toUpperCase(),
    });
  };

  return (
    <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="responsive-modal-panel bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Edit Offer</h3>
            <p className="text-sm text-gray-500 mt-1">Update offer information</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition mt-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="p-8 space-y-5">
          {/* Candidate Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Candidate <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. Rahul Patil"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.role ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. Software Engineer"
            />
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Package <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.package}
              onChange={(e) => handleChange("package", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.package ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. ₹18 LPA"
            />
            {errors.package && (
              <p className="text-red-500 text-xs mt-1">{errors.package}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white ${
                errors.status ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select status</option>
              {OFFER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.joining}
              onChange={(e) => handleChange("joining", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.joining ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. Jul 1, 2026"
            />
            {errors.joining && (
              <p className="text-red-500 text-xs mt-1">{errors.joining}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Create Offer Modal ─────────────────────────────────────────────────────────

const CreateOfferModal = ({ offer, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    package: "",
    status: "Pending",
    joining: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Candidate name is required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.package.trim()) newErrors.package = "Package is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!form.joining.trim()) newErrors.joining = "Joining date is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({
      ...offer,
      name: form.name.trim(),
      role: form.role.trim(),
      package: form.package.trim(),
      status: form.status,
      joining: form.joining.trim(),
      initials: form.name.trim().slice(0, 2).toUpperCase(),
    });
  };

  return (
    <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="responsive-modal-panel bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Generate Offer</h3>
            <p className="text-sm text-gray-500 mt-1">Create a new offer</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition mt-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="p-8 space-y-5">
          {/* Candidate Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Candidate <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. Rahul Patil"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.role ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. Software Engineer"
            />
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Package */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Package <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.package}
              onChange={(e) => handleChange("package", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.package ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. ₹18 LPA"
            />
            {errors.package && (
              <p className="text-red-500 text-xs mt-1">{errors.package}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white ${
                errors.status ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select status</option>
              {OFFER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.joining}
              onChange={(e) => handleChange("joining", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                errors.joining ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
              placeholder="e.g. Jul 1, 2026"
            />
            {errors.joining && (
              <p className="text-red-500 text-xs mt-1">{errors.joining}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Generate Offer
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

const DeleteOfferModal = ({ offer, onClose, onDelete }) => (
  <div className="responsive-modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="responsive-modal-panel bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-8">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
          <Trash2 size={22} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Offer</h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the offer for{" "}
          <span className="font-semibold text-gray-700">{offer.name}</span>?
          This action cannot be undone.
        </p>
      </div>
      <div className="responsive-modal-footer px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Offers Component ────────────────────────────────────────────────────

const Offers = () => {
  const [offers, setOffers] = useState(initialOffersData);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    role: "",
  });

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Modal state: null | 'view' | 'edit' | 'delete' | 'create'
  const [activeModal, setActiveModal] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const statuses = OFFER_STATUSES;
  const roles = [...new Set(offers.map((o) => o.role))].sort();

  const filteredOffers = offers.filter((offer) => {
    const matchSearch =
      offer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      offer.role.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = !filters.status || offer.status === filters.status;
    const matchRole = !filters.role || offer.role === filters.role;
    return matchSearch && matchStatus && matchRole;
  });

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleStatusSelect = (status) => {
    setFilters((prev) => ({ ...prev, status }));
    setStatusDropdownOpen(false);
  };

  const handleRoleSelect = (role) => {
    setFilters((prev) => ({ ...prev, role }));
    setRoleDropdownOpen(false);
  };

  // ── Action handlers ──

  const handleView = (offer) => {
    setSelectedOffer(offer);
    setActiveModal("view");
  };

  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setActiveModal("edit");
  };

  const handleDownload = (offer) => {
    toast.success(`Offer for ${offer.name} downloaded successfully`);
  };

  const handleDeleteRequest = (offer) => {
    setSelectedOffer(offer);
    setActiveModal("delete");
  };

  const handleConfirmDelete = () => {
    setOffers((prev) => prev.filter((o) => o.id !== selectedOffer.id));
    toast.success("Offer deleted successfully");
    setActiveModal(null);
    setSelectedOffer(null);
  };

  const handleSaveEdit = (updatedOffer) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o))
    );
    toast.success("Offer updated successfully");
    setActiveModal(null);
    setSelectedOffer(null);
  };

  const handleCreateOffer = (newOffer) => {
    const offer = {
      ...newOffer,
      id: Date.now(),
      initials: newOffer.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
    }

    setOffers((prev) => [offer, ...prev])

    toast.success("Offer generated successfully");

    setActiveModal(null)
  }

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedOffer(null);
  };

  return (
    <div className="offers-page">

      <div className="offers-header">
        <div>
          <h1>Offer Management</h1>
          <p>Track and manage candidate offers</p>
        </div>
        <button onClick={() => setActiveModal("create")} className="generate-btn">
          <FiFileText />
          Generate Offer
        </button>
      </div>

      <div className="offers-stats grid grid-cols-4">
        <div className="stat-card">
          <h2 style={{ color: "#101828" }}>42</h2>
          <p>Total Offers</p>
        </div>
        <div className="stat-card">
          <h2 style={{ color: "#22c55e" }}>28</h2>
          <p>Accepted</p>
        </div>
        <div className="stat-card">
          <h2 style={{ color: "#f59e0b" }}>9</h2>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h2 style={{ color: "#ef4444" }}>5</h2>
          <p>Declined</p>
        </div>
      </div>

      <div className="offers-table-card">

        <div className="offers-filters">

          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search offers..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Status Filter */}
          <div className="filter-dropdown-wrapper">
            <button
              className="filter-btn"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              <FiFilter />
              {filters.status || "Status"}
            </button>
            {statusDropdownOpen && (
              <div className="filter-dropdown-menu">
                <button
                  className={`dropdown-item ${!filters.status ? "active" : ""}`}
                  onClick={() => handleStatusSelect("")}
                >
                  All Statuses
                </button>
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={`dropdown-item ${
                      filters.status === status ? "active" : ""
                    }`}
                    onClick={() => handleStatusSelect(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Filter */}
          <div className="filter-dropdown-wrapper role-filter-dropdown">
            <button
              className="filter-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            >
              <FiFilter />
              {filters.role || "Role"}
            </button>
            {roleDropdownOpen && (
              <div className="filter-dropdown-menu role-dropdown-menu">
                <button
                  className={`dropdown-item ${!filters.role ? "active" : ""}`}
                  onClick={() => handleRoleSelect("")}
                >
                  All Roles
                </button>
                {roles.map((role) => (
                  <button
                    key={role}
                    className={`dropdown-item ${
                      filters.role === role ? "active" : ""
                    }`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="table-wrapper">
          {filteredOffers.length === 0 ? (
            <div className="empty-state">
              <p>No offers found</p>
            </div>
          ) : (
            <table className="offers-table">

              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>ROLE</th>
                  <th>PACKAGE</th>
                  <th>STATUS</th>
                  <th>JOINING DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer.id}>

                    <td>
                      <div className="candidate-cell">
                        <div className="avatar">{offer.initials}</div>
                        <span>{offer.name}</span>
                      </div>
                    </td>

                    <td>{offer.role}</td>

                    <td className="package">{offer.package}</td>

                    <td>
                      <span className={`status-badge ${offer.status.toLowerCase()}`}>
                        {offer.status}
                      </span>
                    </td>

                    <td>
                      <div className="joining-date">
                        <FiCalendar />
                        {offer.joining}
                      </div>
                    </td>

                    <td>
                      <OfferActionsMenu
                        offer={offer}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDownload={handleDownload}
                        onDelete={handleDeleteRequest}
                      />
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>

      </div>

      {/* ── Modals ── */}

      {activeModal === "view" && selectedOffer && (
        <ViewOfferModal offer={selectedOffer} onClose={handleCloseModal} />
      )}

      {activeModal === "edit" && selectedOffer && (
        <EditOfferModal
          offer={selectedOffer}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
        />
      )}

      {activeModal === "delete" && selectedOffer && (
        <DeleteOfferModal
          offer={selectedOffer}
          onClose={handleCloseModal}
          onDelete={handleConfirmDelete}
        />
      )}

      {activeModal === 'create' && (
        <CreateOfferModal
          onClose={handleCloseModal}
          onSave={handleCreateOffer}
        />
      )}

    </div>
  );
};

export default Offers;
