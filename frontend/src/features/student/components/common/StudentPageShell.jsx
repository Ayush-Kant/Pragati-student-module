export default function StudentPageShell({ children, className = '' }) {
  return (
    <div className={`min-w-0 px-4 py-6 sm:px-6 lg:px-8 ${className}`.trim()}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </div>
  );
}
