export default function PrescriptionRow({ item, onToggle, onEdit, onDelete }) {
    const it = item ?? {};
    const name = typeof it.name === "string" && it.name.trim() ? it.name : "Unnamed";
    const dosage = typeof it.dosage === "string" ? it.dosage : "";
    const frequency = typeof it.frequency === "string" ? it.frequency : "";
    const active = !!it.active;

    return (
        <div className="flex items-center justify-between rounded-xl border p-3">
            <div className="flex flex-col">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500">
                    {dosage}{dosage && frequency ? " • " : ""}{frequency}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onToggle?.(it)}
                    className={`rounded-lg px-3 py-1 text-sm ${active ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                    {active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => onEdit?.(it)} className="rounded-lg border px-3 py-1 text-sm">Edit</button>
                <button onClick={() => onDelete?.(it)} className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white">Delete</button>
            </div>
        </div>
    );
}
