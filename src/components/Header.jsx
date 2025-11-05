import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        const onClick = (e) => {
            if (!open) return;
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [open]);

    const linkBase =
        "block rounded-lg px-3 py-2 text-slate-200/90 hover:text-white hover:bg-white/10 transition";
    const active =
        "text-sky-400 bg-sky-400/10 ring-2 ring-sky-400/40";

    return (
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-white/10">
            <div className="mx-auto max-w-6xl px-4">
                <div className="h-14 flex items-center justify-between">
                    {/* Brand */}
                    <a href="/" className="flex items-center gap-2">
                        {/* Put your logo at /public/logo.png or import it */}
                        <img src="/logo.png" alt="Trackii Logo" className="h-8 w-8 rounded-md" />
                        <span className="font-semibold tracking-wide text-slate-100">Trackii</span>
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
                        {[
                            { to: "/", label: "Home", end: true },
                            { to: "/profiles", label: "Profiles" },
                            { to: "/logs", label: "Logs" },
                            { to: "/prescriptions", label: "Prescriptions" },
                            { to: "/about", label: "About" },
                        ].map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `${linkBase} ${isActive ? active : ""}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Burger */}
                    <button
                        aria-label="Open menu"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        onClick={() => setOpen((v) => !v)}
                        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-slate-100 hover:bg-white/10 transition"
                    >
                        <div className="relative h-4 w-5">
                            <span
                                className={`absolute inset-x-0 top-0 h-0.5 bg-current transition 
                ${open ? "translate-y-2 rotate-45" : ""}`}
                            />
                            <span
                                className={`absolute inset-x-0 top-1/2 -mt-0.5 h-0.5 bg-current transition 
                ${open ? "opacity-0" : ""}`}
                            />
                            <span
                                className={`absolute inset-x-0 bottom-0 h-0.5 bg-current transition 
                ${open ? "-translate-y-2 -rotate-45" : ""}`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile drawer + backdrop */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 transition-opacity md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Panel */}
            <div
                id="mobile-menu"
                ref={panelRef}
                className={`fixed right-0 top-0 h-full w-[72%] max-w-xs bg-slate-900 border-l border-white/10 md:hidden
        transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
                    <span className="font-semibold text-slate-100">Menu</span>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10"
                    >
                        ✕
                    </button>
                </div>
                <nav className="p-3 space-y-1" aria-label="Mobile">
                    {[
                        { to: "/", label: "Home", end: true },
                        { to: "/profiles", label: "Profiles" },
                        { to: "/logs", label: "Logs" },
                        { to: "/prescriptions", label: "Prescriptions" },
                        { to: "/about", label: "About" },
                    ].map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block rounded-lg px-3 py-2 text-slate-200/90 hover:text-white hover:bg-white/10 transition ${isActive ? active : ""
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
