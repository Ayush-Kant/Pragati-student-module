export default function LoadingSpinner({ label = "Loading…", size = "md" }) {
  const sizeClasses = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-2", lg: "h-12 w-12 border-[3px]" };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
      <span
        className={`${sizeClasses[size]} animate-spin rounded-full border-indigo-500 border-t-transparent`}
        role="status"
        aria-label={label}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
