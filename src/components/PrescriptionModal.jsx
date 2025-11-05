import { useEffect, useState } from "react";
import api from "../lib/api";

export default function PrescriptionModal({ open, onClose, profileId, initial }) {
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [active, setActive] = useState(true);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setName(initial?.name || "");
        setDosage(initial?.dosage || "");
        setFrequency(initial?.frequency || "");
        setActive(initial?.active ?? true);
        setNotes(initial?.notes || "");
    }, [open, initial]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (initial && initial._id) {
                await api.patch(`/prescriptions/${initial._id}`, { name, dosage, frequency, active, notes });
            } else {
                await api.post(`/prescriptions`, { profileId, name, dosage, frequency, active, notes });
            }
            onClose(true);
        } catch {
            onClose(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] grid place-items-center">
            <div className="absolute inset-0 bg-violet-900/20 backdrop-blur-sm" onClick={() => onClose(false)} />
            <div className="relative z-[10000] w-full max-w-md rounded-2xl border border-violet-200 bg-white/90 p-6 shadow-lg">
                <div className="mb-4 text-lg font-semibold text-slate-800">
                    {initial?._id ? "Edit Prescription" : "Add Prescription"}
                </div>
                <form onSubmit={onSubmit} className="space-y-3">
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            placeholder="Dosage"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                        />
                        <input
                            placeholder="Frequency"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                        />
                    </div>
                    <textarea
                        placeholder="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                    />
                    <label className="inline-flex items-center gap-2 text-slate-700">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="size-4 rounded border-violet-300 text-violet-600 focus:ring-violet-200"
                        />
                        Active
                    </label>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={submitting}
                            className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 disabled:opacity-60"
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}