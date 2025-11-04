// src/components/LogsList.jsx
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
                <div className="flex justify-end">
                    <button onClick={onAdd} className="rounded-lg bg-gray-900 px-4 py-2 text-white">+ Quick Log</button>
                </div>
                <div className="text-sm text-gray-500">Loading logs…</div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                <button onClick={onAdd} className="rounded-lg bg-gray-900 px-4 py-2 text-white">+ Quick Log</button>
            </div>

            {err ? (
                <div className="rounded border p-3 text-sm text-red-600">
                    {err} <button onClick={load} className="underline ml-2">Retry</button>
                </div>
            ) : items.length === 0 ? (
                <div className="rounded border p-3 text-sm text-gray-600">
                    No logs yet. Add one with “+ Quick Log”.
                </div>
            ) : (
                items.map((it) => (
                    <div key={it._id} className="flex items-start justify-between rounded border p-3">
                        <div>
                            <div className="text-sm font-medium capitalize">{it.category}</div>
                            <div className="text-xs text-gray-500">
                                {it.value != null ? `Value: ${it.value} • ` : ""}
                                {it.date ? new Date(it.date).toLocaleString() : ""}
                            </div>
                            {it.notes ? <div className="mt-1 text-sm">{it.notes}</div> : null}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEdit(it)} className="rounded border px-3 py-1 text-xs">Edit</button>
                            <button onClick={() => onDelete(it)} className="rounded bg-red-600 px-3 py-1 text-xs text-white">Delete</button>
                        </div>
                    </div>
                ))
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded border px-3 py-1 text-xs disabled:opacity-50"
                >
                    Prev
                </button>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded border px-3 py-1 text-xs"
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
