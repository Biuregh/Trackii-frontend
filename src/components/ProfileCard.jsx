import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

export default function ProfileCard({ profile, onChanged }) {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    const id = profile._id || profile.id;
    const isActive = profile.active ?? true;
    const lastWeight = profile.latestWeight ?? null;
    const activeRx = profile.activeRxCount ?? 0;

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
        <div id="main" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-800">
                    {profile.type}
                </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
                    <div className="text-gray-500">Last weight</div>
                    <div className="text-base font-medium">{lastWeight ? `${lastWeight} kg` : "—"}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
                    <div className="text-gray-500">Active Rx</div>
                    <div className="text-base font-medium">{activeRx}</div>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => navigate(`/profiles/${id}`)}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                    disabled={busy}
                >
                    View Dashboard
                </button>
                <button
                    onClick={toggleActive}
                    className="rounded-xl px-3 py-2 border border-gray-300 dark:border-gray-700 disabled:opacity-60"
                    disabled={busy}
                    title={isActive ? "Deactivate" : "Activate"}
                >
                    {isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                    onClick={remove}
                    className="rounded-xl px-3 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    disabled={busy}
                    title="Delete profile"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
