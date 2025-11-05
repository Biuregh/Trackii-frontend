import { useEffect, useState } from "react";
import api from "../lib/api";
import PrescriptionModal from "./PrescriptionModal";
import PrescriptionRow from "./PrescriptionRow";

export default function PrescriptionsList({ profileId }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [open, setOpen] = useState(false);
    const [initial, setInitial] = useState(null);

    const fetchPrimary = () =>
        api.get(`/prescriptions/profiles/${profileId}`);

    const fetchFallback = () =>
        api.get(`/profiles/${profileId}/prescriptions`);

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
                : Array.isArray(res.data?.prescriptions)
                    ? res.data.prescriptions
                    : Array.isArray(res.data)
                        ? res.data
                        : [];
            setItems(data);
        } catch {
            setErr("Failed to load prescriptions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!profileId) return;
        load();
    }, [profileId]);

    const onToggle = async (item) => {
        try {
            await api.patch(`/prescriptions/${item._id}`, { active: !item.active });
            await load();
        } catch { }
    };

    const onDelete = async (item) => {
        try {
            await api.delete(`/prescriptions/${item._id}`);
        } finally {
            await load();
        }
    };

    const onEdit = (item) => {
        setInitial(item);
        setOpen(true);
    };

    const onAdd = () => {
        setInitial(null);
        setOpen(true);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                <button
                    onClick={onAdd}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
                >
                    + Add Rx
                </button>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-violet-200 bg-white/90 p-3 text-sm text-slate-600">
                    Loading prescriptions…
                </div>
            ) : err ? (
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
                    No prescriptions yet. Add one with “+ Add Rx”.
                </div>
            ) : (
                items.map((rx) => (
                    <PrescriptionRow
                        key={rx._id}
                        item={rx}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
            </div>

            <PrescriptionModal
                open={open}
                onClose={async (changed) => {
                    setOpen(false);
                    if (changed) await load();
                }}
                profileId={profileId}
                initial={initial}
            />
        </div>
    );
}
