import { useEffect, useState } from "react";
import api from "../lib/api";
import LogModal from "./LogModal";

export default function LogsList({ profileId, onChanged }) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [open, setOpen] = useState(false);
    const [initial, setInitial] = useState(null);

    const fetchPrimary = () =>
        api.get(`/logs/profiles/${profileId}/logs`, { params: { limit, page } });

    const fetchFallback = () =>
        api.get(`/profiles/${profileId}/logs`, { params: { limit, page } });

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            let res;
            try {
                res = await fetchPrimary();
            } catch (e) {
                if (e?.response?.status === 404) {
                    res = await fetchFallback();
                } else {
                    throw e;
                }
            }
            const data = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data?.logs)
                    ? res.data.logs
                    : Array.isArray(res.data)
                        ? res.data
                        : [];
            setItems(data);
        } catch {
            setErr("Failed to load logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!profileId) return;
        load();
    }, [profileId, page]);

    const onDelete = async (log) => {
        try {
            await api.delete(`/logs/${log._id}`);
            await load();
            onChanged?.();
        } catch { }
    };

    const onEdit = (log) => {
        setInitial(log);
        setOpen(true);
    };

    const onAdd = () => {
        setInitial(null);
        setOpen(true);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                <div className="rounded-2xl border border-violet-200 bg-white/90 p-3 text-sm text-slate-600">
                    Loading logs…
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                <button
                    onClick={onAdd}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
                >
                    + Quick Log
                </button>
            </div>

            {err ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {err}
                    <button
                        onClick={load}
                        className="ml-2 rounded-xl border border-violet-200 bg-white px-3 py-1 text-xs text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                    >
                        Retry
                    </button>
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-violet-200 bg-white/90 p-3 text-sm text-slate-600">
                    No logs yet. Add one with “+ Quick Log”.
                </div>
            ) : (
                items.map((it) => (
                    <div
                        key={it._id}
                        className="flex items-start justify-between rounded-2xl border border-violet-200 bg-white/90 p-3 shadow-sm"
                    >
                        <div className="min-w-0">
                            <div className="text-sm font-medium capitalize text-slate-800">
                                {it.category}
                            </div>
                            <div className="text-xs text-slate-500">
                                {it.value != null ? `Value: ${it.value} • ` : ""}
                                {it.date ? new Date(it.date).toLocaleString() : ""}
                            </div>
                            {it.notes ? <div className="mt-1 text-sm text-slate-700">{it.notes}</div> : null}
                        </div>
                        <div className="ml-3 flex shrink-0 gap-2">
                            <button
                                onClick={() => onEdit(it)}
                                className="rounded-xl border border-violet-200 bg-white px-3 py-1 text-xs text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(it)}
                                className="rounded-xl border border-violet-200 bg-rose-100 px-3 py-1 text-xs text-red-700 hover:bg-rose-200 hover:text-red-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-violet-200 bg-white px-3 py-1 text-xs text-violet-700 disabled:opacity-50 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    Prev
                </button>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl border border-violet-200 bg-white px-3 py-1 text-xs text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    Next
                </button>
            </div>

            <LogModal
                open={open}
                onClose={async (changed) => {
                    setOpen(false);
                    if (changed) {
                        await load();
                        onChanged?.();
                    }
                }}
                profileId={profileId}
                initial={initial}
            />
        </div>
    );
}