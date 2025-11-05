export default function LogRow({ item, onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-violet-200 bg-white/90 p-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
                <span className="inline-flex items-center rounded-full border border-violet-200 bg-white px-2 py-0.5 text-xs uppercase tracking-wide text-violet-700">
                    {item.category}
                </span>
                <span className="text-sm font-medium text-slate-800">{item.value ?? ""}</span>
                <span className="truncate text-xs text-slate-500">
                    {new Date(item.date || item.timestamp).toLocaleString()}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(item)}
                    className="rounded-xl border border-violet-200 bg-white px-3 py-1 text-sm text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(item)}
                    className="rounded-xl border border-violet-200 bg-rose-100 px-3 py-1 text-sm text-red-700 hover:bg-rose-200 hover:text-red-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}