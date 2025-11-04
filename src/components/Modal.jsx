import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }) {
    const dialogRef = useRef(null);
    const lastActiveRef = useRef(null);
    const titleId = "modal-title";

    useEffect(() => {
        if (!open) return;
        lastActiveRef.current = document.activeElement;

        const el = dialogRef.current;
        const focusables = () =>
            el.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            );

        const focusFirst = () => {
            const f = focusables();
            if (f.length) f[0].focus();
            else el.focus();
        };

        const onKey = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose?.();
            }
            if (e.key === "Tab") {
                const f = Array.from(focusables());
                if (!f.length) return;
                const i = f.indexOf(document.activeElement);
                if (e.shiftKey) {
                    if (i <= 0) {
                        e.preventDefault();
                        f[f.length - 1].focus();
                    }
                } else {
                    if (i === f.length - 1) {
                        e.preventDefault();
                        f[0].focus();
                    }
                }
            }
        };

        const body = document.body;
        const prevOverflow = body.style.overflow;
        body.style.overflow = "hidden";

        setTimeout(focusFirst, 0);
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("keydown", onKey);
            body.style.overflow = prevOverflow;
            lastActiveRef.current?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose?.();
    };

    return (
        <div
            onMouseDown={handleBackdrop}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            aria-hidden="false"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                tabIndex={-1}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
            >
                <div className="flex items-start justify-between gap-4">
                    {title ? (
                        <h2 id={titleId} className="text-lg font-semibold">
                            {title}
                        </h2>
                    ) : (
                        <div />
                    )}
                    <button
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                        ✕
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}
