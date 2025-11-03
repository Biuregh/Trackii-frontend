import { createPortal } from "react-dom";

export default function Modal({ open, onClose, children }) {
    if (!open) return null;
    return createPortal(
        <div className="fixed inset-0 grid place-items-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
}
