import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../lib/api";

export default function LogModal({ open, onClose, profileId, initial }) {
    const [category, setCategory] = useState(initial?.category || "weight");
    const [value, setValue] = useState(initial?.value ?? "");
    const [notes, setNotes] = useState(initial?.notes || "");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setCategory(initial?.category || "weight");
        setValue(initial?.value ?? "");
        setNotes(initial?.notes || "");
    }, [open, initial]);

    const onSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (initial && initial._id) {
                await api.patch(`/logs/${initial._id}`, { category, value: value === "" ? undefined : Number(value), notes });
            } else {
                await api.post(`/logs`, { profileId, category, value: value === "" ? undefined : Number(value), notes });
            }
            onClose(true);
        } catch {
            onClose(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    const modal = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => onClose(false)} />
            <div className="relative z-[10000] w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h2 className="mb-4 text-lg font-semibold">{initial?._id ? "Edit Log" : "Quick Log"}</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        <button type="button" onClick={() => setCategory("weight")} className={`px-3 py-2 rounded-lg border ${category === "weight" ? "bg-gray-900 text-white" : "bg-white"}`}>Weight</button>
                        <button type="button" onClick={() => setCategory("water")} className={`px-3 py-2 rounded-lg border ${category === "water" ? "bg-gray-900 text-white" : "bg-white"}`}>Water</button>
                        <button type="button" onClick={() => setCategory("meal")} className={`px-3 py-2 rounded-lg border ${category === "meal" ? "bg-gray-900 text-white" : "bg-white"}`}>Meal</button>
                    </div>
                    {category !== "meal" && (
                        <div>
                            <label className="mb-1 block text-sm">Value</label>
                            <input type="number" step="any" value={value} onChange={e => setValue(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
                        </div>
                    )}
                    <div>
                        <label className="mb-1 block text-sm">Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-lg border px-3 py-2" rows={3} />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => onClose(false)} className="rounded-lg border px-4 py-2">Cancel</button>
                        <button disabled={submitting} className="rounded-lg bg-gray-900 px-4 py-2 text-white">{submitting ? "Saving..." : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
