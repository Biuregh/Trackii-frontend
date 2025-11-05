export default function PrescriptionRow({ item, onToggle, onEdit, onDelete }) {
    const it = item ?? {};
    const name = typeof it.name === "string" && it.name.trim() ? it.name : "Unnamed";
    const dosage = typeof it.dosage === "string" ? it.dosage : "";
    const frequency = typeof it.frequency === "string" ? it.frequency : "";
    const active = !!it.active;

    return (
        <div className="flex items-center justify-between rounded-2xl border border-violet-200 bg-white/90 p-3 shadow-sm">
            <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-800">{name}</div>
                <div className="text-xs text-slate-500">
                    {dosage}
                    {dosage && frequency ? " • " : ""}
                    {frequency}
                </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-2">
                <button
                    onClick={() => onToggle?.(it)}
                    className={[
                        "rounded-xl px-3 py-1 text-sm transition focus:outline-none focus:ring-4",
                        active
                            ? "bg-violet-600 text-white shadow-sm hover:bg-violet-700 focus:ring-violet-300"
                            : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 focus:ring-violet-200",
                    ].join(" ")}
                >
                    {active ? "Active" : "Inactive"}
                </button>

                <button
                    onClick={() => onEdit?.(it)}
                    className="rounded-xl border border-violet-200 bg-white px-3 py-1 text-sm text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    Edit
                </button>

                <button
                    onClick={() => onDelete?.(it)}
                    className="rounded-xl border border-violet-200 bg-rose-100 px-3 py-1 text-sm text-red-700 hover:bg-rose-200 hover:text-red-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
