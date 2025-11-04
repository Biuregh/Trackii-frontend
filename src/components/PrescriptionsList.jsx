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
            await load();
        } catch { }
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
                <button onClick={onAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-white">+ Add Rx</button>
            </div>

            {loading ? (
                <div className="text-sm text-gray-500">Loading prescriptions…</div>
            ) : err ? (
                <div className="rounded border p-3 text-sm text-red-600">
                    {err} <button onClick={load} className="underline ml-2">Retry</button>
                </div>
            ) : items.length === 0 ? (
                <div className="rounded border p-3 text-sm text-gray-600">
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
