export default function LogRow({ item, onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-between rounded-xl border p-3">
            <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wide text-gray-500">{item.category}</span>
                <span className="text-sm">{item.value ?? ""}</span>
                <span className="text-xs text-gray-400">{new Date(item.date || item.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onEdit(item)} className="rounded-lg border px-3 py-1 text-sm">Edit</button>
                <button onClick={() => onDelete(item)} className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white">Delete</button>
            </div>
        </div>
    );
}