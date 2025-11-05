import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

export default function ProfileCard({ profile, onChanged }) {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    const id = profile._id || profile.id;
    const isActive = profile.active ?? true;
    const lastWeight = profile.latestWeight ?? null;
    const activeRx = profile.activeRxCount ?? 0;
    const type = String(profile.type || "general");

    const initial = useMemo(() => (profile.name?.[0] || "?").toUpperCase(), [profile.name]);

    const toggleActive = async () => {
        if (!id || busy) return;
        setBusy(true);
        try {
            await api.patch(`/profiles/${id}`, { active: !isActive });
            onChanged?.();
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!id || busy) return;
        const ok = window.confirm("Delete this profile? This cannot be undone.");
        if (!ok) return;
        setBusy(true);
        try {
            await api.delete(`/profiles/${id}`);
            onChanged?.();
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="rounded-2xl border border-violet-200 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                        <span className="text-violet-700 font-semibold">{initial}</span>
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-slate-800">
                            {profile.name || "—"}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-violet-200 bg-white px-2 py-0.5 text-xs text-violet-700">
                                {type}
                            </span>
                            <span
                                className={[
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-slate-50 text-slate-600 border border-slate-200",
                                ].join(" ")}
                            >
                                {isActive ? "active" : "inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* quick view link for clarity */}
                <Link
                    to={`/profiles/${id}`}
                    className="rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    Open
                </Link>
            </div>

            {/* metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-violet-200 bg-white p-3">
                    <div className="text-slate-500">Last weight</div>
                    <div className="text-base font-medium text-slate-800">
                        {lastWeight ? `${lastWeight} kg` : "—"}
                    </div>
                </div>
                <div className="rounded-xl border border-violet-200 bg-white p-3">
                    <div className="text-slate-500">Active Rx</div>
                    <div className="text-base font-medium text-slate-800">{activeRx}</div>
                </div>
            </div>

            {/* actions */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => navigate(`/profiles/${id}`)}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-violet-300"
                    disabled={busy}
                >
                    View Dashboard
                </button>

                <button
                    onClick={toggleActive}
                    className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-violet-700 hover:bg-violet-50 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-violet-200"
                    disabled={busy}
                    title={isActive ? "Deactivate" : "Activate"}
                    aria-pressed={!isActive}
                >
                    {isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                    onClick={remove}
                    className="rounded-xl px-3 py-2 border border-violet-200
             bg-rose-100 text-red-700
             hover:bg-rose-200 hover:text-red-800
             focus:outline-none focus:ring-4 focus:ring-rose-300
             disabled:opacity-60"
                    disabled={busy}
                    title="Delete profile"
                >
                    {busy ? "…" : "Delete"}
                </button>
            </div>
        </section>
    );
}
