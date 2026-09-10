export function SimilarityMeter({ value, label }) {
  const isNA = value === null || value === undefined;
  const v = isNA ? 0 : Math.max(0, Math.min(1, Number(value) || 0));
  const pct = Math.round(v * 100);
  const color = v >= 0.6 ? "bg-emerald-500" : v >= 0.4 ? "bg-amber-500" : "bg-red-500";
  const textColor = v >= 0.6 ? "text-emerald-400" : v >= 0.4 ? "text-amber-400" : "text-red-400";

  return (
    <div className="flex items-center gap-2" title={`Similarity ${v.toFixed(4)}`}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#30363d]">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`tabular-nums text-xs font-medium ${textColor}`}>{v.toFixed(2)}</span>
  const color =
    isNA ? "bg-slate-300" : v >= 0.6 ? "bg-emerald-500" : v >= 0.4 ? "bg-amber-500" : "bg-slate-400";

  return (
    <div
      className="flex items-center gap-2"
      title={isNA ? "Not available (keyword-only match)" : `${label || "Similarity"} ${v.toFixed(4)}`}
    >
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
        {isNA ? (
          <div className="h-full w-full rounded-full bg-slate-200" />
        ) : (
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        )}
      </div>
      <span className="tabular-nums text-xs font-medium text-slate-500">
        {isNA ? "N/A" : v.toFixed(2)}
      </span>
    </div>
  );
}
