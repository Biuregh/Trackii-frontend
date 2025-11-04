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
        <div className="fixed inset-0 grid place-items-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded bg-white p-4">
                <div className="mb-3 text-lg font-semibold">{initial?._id ? "Edit Prescription" : "Add Prescription"}</div>
                <form onSubmit={onSubmit} className="grid gap-3">
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            placeholder="Dosage"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <input
                            placeholder="Frequency"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="border p-2 rounded"
                        />
                    </div>
                    <textarea
                        placeholder="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border p-2 rounded"
                        rows={3}
                    />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                        Active
                    </label>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => onClose(false)} className="px-3 py-2">Cancel</button>
                        <button disabled={submitting} className="rounded px-3 py-2 bg-blue-600 text-white">
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}