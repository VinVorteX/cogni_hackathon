import { useState } from "react";
import { Badge } from "./ui/Badge.jsx";
import { SimilarityMeter } from "./ui/SimilarityMeter.jsx";
import { Expandable } from "./ui/Expandable.jsx";
import { NOT_DOCUMENTED } from "../lib/constants.js";

/* ── Match-type badge colours ─────────────────────────────────────────────── */
const MATCH_COLORS = {
  semantic: "indigo",
  keyword: "amber",
  "semantic+keyword": "emerald",
};

const MATCH_LABELS = {
  semantic: "Semantic",
  keyword: "Keyword",
  "semantic+keyword": "Semantic + Keyword",
};

/* ── Small helpers ────────────────────────────────────────────────────────── */
function Field({ label, value }) {
  const muted = !value || value === NOT_DOCUMENTED;
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <Expandable
        text={value}
        clampClass="line-clamp-5"
        className={`mt-0.5 text-sm ${muted ? "italic text-slate-400" : "text-slate-700"}`}
      />
    </div>
  );
}

function MetricRow({ label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-slate-500">{label}</span>
      <span
        className={`font-mono text-xs ${muted ? "italic text-slate-400" : "font-medium text-slate-700"}`}
      >
        {value}
      </span>
    </div>
  );
}

function fmt(v, decimals = 4) {
  if (v === null || v === undefined) return null;
  return Number(v).toFixed(decimals);
}

/* ── Retrieval Details (expandable) ───────────────────────────────────────── */
function RetrievalDetails({ incident }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 border-t border-slate-100 pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-700"
      >
        <svg
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        Retrieval Details
      </button>

      {open && (
        <div className="mt-2 rounded-md border border-slate-100 bg-slate-50/50 px-3 py-2 divide-y divide-slate-100">
          {/* Source scores */}
          <div className="pb-1.5">
            <MetricRow
              label="FAISS Cosine Similarity"
              value={fmt(incident.similarity) ?? "N/A"}
              muted={incident.similarity == null}
            />
            <MetricRow
              label="BM25 Score"
              value={fmt(incident.bm25_score) ?? "N/A"}
              muted={incident.bm25_score == null}
            />
            <MetricRow
              label="RRF Score"
              value={fmt(incident.rrf_score, 6) ?? "N/A"}
              muted={incident.rrf_score == null}
            />
          </div>

          {/* Source ranks */}
          <div className="pt-1.5">
            <MetricRow
              label="FAISS Rank"
              value={incident.faiss_rank != null ? `#${incident.faiss_rank}` : "N/A"}
              muted={incident.faiss_rank == null}
            />
            <MetricRow
              label="BM25 Rank"
              value={incident.bm25_rank != null ? `#${incident.bm25_rank}` : "N/A"}
              muted={incident.bm25_rank == null}
            />
            <MetricRow
              label="Final Rank (Hybrid)"
              value={incident.hybrid_rank ? `#${incident.hybrid_rank}` : "—"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main card ────────────────────────────────────────────────────────────── */
export function IncidentCard({ incident, cited = false }) {
  const matchType = incident.match_type || "semantic";
  const matchColor = MATCH_COLORS[matchType] || "slate";
  const matchLabel = MATCH_LABELS[matchType] || matchType;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 p-4 transition hover:border-slate-300">
      {/* ── Header row: ticket ID + badges ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-mono text-sm font-semibold text-slate-900">
            {incident.ticket_id}
          </span>
          {cited && (
            <Badge color="indigo" className="shrink-0">
              Cited by AI
            </Badge>
          )}
          <Badge color={matchColor} className="shrink-0">
            {matchLabel}
          </Badge>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Hybrid rank */}
          {incident.hybrid_rank > 0 && (
            <span
              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200"
              title="Hybrid rank (RRF fusion of FAISS + BM25)"
            >
              #{incident.hybrid_rank}
            </span>
          )}

          {/* Semantic similarity */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-400 sm:inline">
              Semantic Similarity
            </span>
            <SimilarityMeter
              value={incident.similarity}
              label="Semantic Similarity"
            />
          </div>
        </div>
      </div>

      {/* ── Description ─────────────────────────────────────────────────── */}
      <Expandable
        text={incident.description}
        clampClass="line-clamp-3"
        className="mt-2 text-sm text-slate-600"
      />

      {/* ── Root cause + Resolution ─────────────────────────────────────── */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Root cause" value={incident.root_cause} />
        <Field label="Resolution" value={incident.resolution} />
      </div>

      {/* ── Expandable retrieval details ─────────────────────────────────── */}
      <RetrievalDetails incident={incident} />
    </div>
  );
}
