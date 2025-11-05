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

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (initial && initial._id) {
                await api.patch(`/logs/${initial._id}`, {
                    category,
                    value: value === "" ? undefined : Number(value),
                    notes,
                });
            } else {
                await api.post(`/logs`, {
                    profileId,
                    category,
                    value: value === "" ? undefined : Number(value),
                    notes,
                });
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
        <div className="fixed inset-0 z-\[9999\] grid place-items-center">
            <div
                className="absolute inset-0 bg-violet-900/20 backdrop-blur-sm"
                onClick={() => onClose(false)}
            />
            <div className="relative z-\[10000\] w-full max-w-md rounded-2xl border border-violet-200 bg-white/90 p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                    {initial?._id ? "Edit Log" : "Quick Log"}
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        <CategoryButton
                            label="Weight"
                            active={category === "weight"}
                            onClick={() => setCategory("weight")}
                        />
                        <CategoryButton
                            label="Water"
                            active={category === "water"}
                            onClick={() => setCategory("water")}
                        />
                        <CategoryButton
                            label="Meal"
                            active={category === "meal"}
                            onClick={() => setCategory("meal")}
                        />
                    </div>
                    {category !== "meal" && (
                        <div>
                            <label className="mb-1 block text-sm text-slate-600">Value</label>
                            <input
                                type="number"
                                step="any"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2
                           text-slate-800 placeholder:text-slate-400 outline-none
                           focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                            />
                        </div>
                    )}
                    <div>
                        <label className="mb-1 block text-sm text-slate-600">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2
                         text-slate-800 placeholder:text-slate-400 outline-none
                         focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                        />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="rounded-xl border border-violet-200 bg-white px-4 py-2
                         text-violet-700 hover:bg-violet-50
                         focus:outline-none focus:ring-4 focus:ring-violet-200"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={submitting}
                            className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm
                         transition hover:bg-violet-700
                         focus:outline-none focus:ring-4 focus:ring-violet-300
                         disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

function CategoryButton({ label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-xl px-3 py-2 text-sm transition",
                active
                    ? "bg-violet-600 text-white shadow-sm"
                    : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50",
            ].join(" ")}
        >
            {label}
        </button>
    );
}
