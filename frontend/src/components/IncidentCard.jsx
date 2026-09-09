import { Badge } from "./ui/Badge.jsx";
import { SimilarityMeter } from "./ui/SimilarityMeter.jsx";
import { Expandable } from "./ui/Expandable.jsx";
import { NOT_DOCUMENTED } from "../lib/constants.js";

function Field({ label, value }) {
  const muted = !value || value === NOT_DOCUMENTED;
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6e7681]">{label}</p>
      <Expandable
        text={value}
        clampClass="line-clamp-5"
        className={`mt-0.5 text-xs ${muted ? "italic text-[#6e7681]" : "text-[#c9d1d9]"}`}
      />
    </div>
  );
}

export function IncidentCard({ incident, cited = false }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22] p-4 transition hover:border-[#6e7681]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-bold text-cyan-400">{incident.ticket_id}</span>
          {cited && <Badge color="indigo">Cited by AI</Badge>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs text-[#6e7681] sm:inline">similarity</span>
          <SimilarityMeter value={incident.similarity} />
        </div>
      </div>

      <Expandable
        text={incident.description}
        clampClass="line-clamp-3"
        className="mt-2 text-xs text-[#8b949e]"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Root Cause" value={incident.root_cause} />
        <Field label="Resolution" value={incident.resolution} />
      </div>
    </div>
  );
}
