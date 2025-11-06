import { useState } from "react";
import api from "../lib/api";

export default function AskAiCard() {
    const [q, setQ] = useState("");
    const [a, setA] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const ask = async (e) => {
        e?.preventDefault?.();
        setErr("");
        setA("");
        const question = q.trim();
        if (!question) return;
        setLoading(true);
        try {
            const res = await api.post("/ai/ask", { q: question });
            const answer = res?.data?.data?.answer || res?.data?.answer || res?.data || "";
            setA(String(answer));
        } catch (e) {
            setErr("Sorry, I couldn’t answer right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                    Ask about Trackii
                </span>
            </div>

            <form onSubmit={ask} className="space-y-2">
                <textarea
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    rows={3}
                    placeholder="(e.g., how to log weight, set reminders, view prescriptions)…"
                    className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                />
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => { setQ(""); setA(""); setErr(""); }}
                        className="rounded-xl px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !q.trim()}
                        className="rounded-xl bg-violet-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-violet-300"
                    >
                        {loading ? "Thinking…" : "Ask"}
                    </button>
                </div>
            </form>

            {err ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>
            ) : null}

            {a ? (
                <div className="rounded-xl border border-violet-200 bg-white/90 p-3 text-sm text-slate-800 whitespace-pre-wrap">
                    {a}
                </div>
            ) : null}
        </div>
    );
}
