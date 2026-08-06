import React, { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Building2,
  Search,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../../../../../services/api";

/**
 * CompanyDropdown
 *
 * Props:
 *  value       — currently selected company object { id, name, industry, logo_url } or null
 *  onChange    — (company | null) => void
 *  error       — error string from parent validation
 *  disabled    — boolean
 */
const CompanyDropdown = ({ value, onChange, error, disabled = false }) => {
  const { darkMode = false } = useOutletContext() || {};

  const [companies, setCompanies]   = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [search, setSearch]         = useState("");
  const [isOpen, setIsOpen]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(-1);

  const containerRef = useRef(null);
  const searchRef    = useRef(null);
  const listRef      = useRef(null);

  // ── Fetch companies once on mount ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/companies/list");
        if (!cancelled) {
          const list = res.data?.data || [];
          setCompanies(list);
          setFiltered(list);
        }
      } catch {
        if (!cancelled) setFetchError("Failed to load companies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Filter when search changes ─────────────────────────────────────────────
  useEffect(() => {
    const q = search.trim().toLowerCase();
    setFiltered(
      q
        ? companies.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              (c.industry || "").toLowerCase().includes(q)
          )
        : companies
    );
    setFocusedIdx(-1);
  }, [search, companies]);

  // ── Close on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Focus search input when dropdown opens ─────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ── Scroll focused item into view ──────────────────────────────────────────
  useEffect(() => {
    if (focusedIdx >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIdx];
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIdx]);

  const open  = () => { if (!disabled) setIsOpen(true); };
  const close = () => { setIsOpen(false); setSearch(""); };

  const select = (company) => {
    onChange(company);
    close();
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearch("");
  };

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          open();
        }
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIdx((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIdx((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIdx >= 0 && filtered[focusedIdx]) {
            select(filtered[focusedIdx]);
          }
          break;
        case "Escape":
          close();
          break;
        default:
          break;
      }
    },
    [isOpen, filtered, focusedIdx]
  );

  // ── Styles ─────────────────────────────────────────────────────────────────
  const triggerBase = `
    w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm
    transition-all duration-200 outline-none cursor-pointer
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${
      error
        ? "border-red-500"
        : isOpen
        ? darkMode
          ? "border-[#ff7a00] bg-[#1A1A1A]"
          : "border-[#ff7a00] bg-white"
        : darkMode
        ? "border-[#3D3D3D] bg-[#1A1A1A] hover:border-[#ff7a00]/50"
        : "border-slate-300 bg-white hover:border-[#ff7a00]/60"
    }
  `;

  const dropdownBase = `
    absolute left-0 right-0 top-full z-50 mt-1.5
    rounded-2xl border shadow-2xl overflow-hidden
    ${
      darkMode
        ? "bg-[#1E1E1E] border-[#3D3D3D] shadow-black/50"
        : "bg-white border-slate-200 shadow-slate-200/80"
    }
  `;

  const itemBase = (idx, isSelected) => `
    flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm
    ${
      isSelected
        ? darkMode
          ? "bg-[#ff6d34]/10 text-[#ff6d34]"
          : "bg-orange-50 text-[#ff7a00]"
        : focusedIdx === idx
        ? darkMode
          ? "bg-[#2D2D2D]"
          : "bg-slate-50"
        : darkMode
        ? "hover:bg-[#2D2D2D]"
        : "hover:bg-slate-50"
    }
  `;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger ─────────────────────────────────────────────────── */}
      <button
        type="button"
        className={triggerBase}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select company"
        disabled={disabled}
      >
        {/* Left icon / logo */}
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold
            ${
              value
                ? darkMode
                  ? "bg-[#ff6d34]/15 text-[#ff6d34]"
                  : "bg-orange-100 text-[#ff7a00]"
                : darkMode
                ? "bg-[#2D2D2D] text-slate-500"
                : "bg-slate-100 text-slate-400"
            }`}
        >
          {value ? (
            value.name.charAt(0).toUpperCase()
          ) : (
            <Building2 size={14} />
          )}
        </span>

        {/* Label */}
        <span className={`flex-1 truncate text-left ${!value ? (darkMode ? "text-slate-500" : "text-slate-400") : ""}`}>
          {value ? value.name : "Select a company…"}
        </span>

        {/* Industry badge */}
        {value?.industry && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold
              ${darkMode ? "bg-[#2D2D2D] text-slate-400" : "bg-slate-100 text-slate-500"}`}
          >
            {value.industry}
          </span>
        )}

        {/* Clear / chevron */}
        {value && !disabled ? (
          <span
            role="button"
            aria-label="Clear selection"
            tabIndex={0}
            onClick={clear}
            onKeyDown={(e) => e.key === "Enter" && clear(e)}
            className={`shrink-0 rounded-md p-0.5 transition cursor-pointer
              ${darkMode ? "hover:bg-[#3D3D3D] text-slate-400" : "hover:bg-slate-200 text-slate-500"}`}
          >
            <X size={14} />
          </span>
        ) : (
          <ChevronDown
            size={16}
            className={`shrink-0 transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
              ${darkMode ? "text-slate-500" : "text-slate-400"}`}
          />
        )}
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────── */}
      {isOpen && (
        <div className={dropdownBase} role="listbox">
          {/* Search box */}
          <div
            className={`flex items-center gap-2 border-b px-3 py-2.5
              ${darkMode ? "border-[#3D3D3D]" : "border-slate-100"}`}
          >
            <Search
              size={14}
              className={darkMode ? "text-slate-500" : "text-slate-400"}
            />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search companies…"
              className={`flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400
                ${darkMode ? "text-white" : "text-slate-800"}`}
              aria-label="Search companies"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`rounded p-0.5 cursor-pointer ${darkMode ? "hover:bg-[#3D3D3D] text-slate-400" : "hover:bg-slate-100 text-slate-400"}`}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* List body */}
          <div
            ref={listRef}
            className="max-h-56 overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#ff7a00]">
                <Loader2 size={16} className="animate-spin" />
                Loading companies…
              </div>
            )}

            {/* Fetch error */}
            {!loading && fetchError && (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-red-500">
                <AlertCircle size={15} />
                {fetchError}
              </div>
            )}

            {/* Empty result */}
            {!loading && !fetchError && filtered.length === 0 && (
              <div
                className={`py-6 text-center text-sm ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {search ? `No companies match "${search}"` : "No companies available"}
              </div>
            )}

            {/* Company rows */}
            {!loading &&
              !fetchError &&
              filtered.map((company, idx) => {
                const isSelected = value?.id === company.id;
                return (
                  <div
                    key={company.id}
                    role="option"
                    aria-selected={isSelected}
                    className={itemBase(idx, isSelected)}
                    onClick={() => select(company)}
                    onMouseEnter={() => setFocusedIdx(idx)}
                  >
                    {/* Initial avatar */}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold
                        ${
                          isSelected
                            ? darkMode
                              ? "bg-[#ff6d34]/20 text-[#ff6d34]"
                              : "bg-orange-100 text-[#ff7a00]"
                            : darkMode
                            ? "bg-[#2D2D2D] text-slate-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {company.name.charAt(0).toUpperCase()}
                    </span>

                    {/* Name + industry */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{company.name}</p>
                      {company.industry && (
                        <p
                          className={`truncate text-[11px] mt-0.5 ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {company.industry}
                        </p>
                      )}
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <CheckCircle2
                        size={15}
                        className={`shrink-0 ${darkMode ? "text-[#ff6d34]" : "text-[#ff7a00]"}`}
                      />
                    )}
                  </div>
                );
              })}
          </div>

          {/* Footer: count */}
          {!loading && !fetchError && filtered.length > 0 && (
            <div
              className={`border-t px-4 py-2 text-[11px] ${
                darkMode
                  ? "border-[#3D3D3D] text-slate-600"
                  : "border-slate-100 text-slate-400"
              }`}
            >
              {filtered.length} {filtered.length === 1 ? "company" : "companies"}
              {search && ` matching "${search}"`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyDropdown;