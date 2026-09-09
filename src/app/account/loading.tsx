export default function AccountLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay/40 font-label">
          Loading
        </span>
      </div>
    </div>
  );
}
