import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import Spinner from "../components/Spinner";
import ProfileCard from "../components/ProfileCard";
import AskAiCard from "../components/AskAiCard";

async function getWeightLatest(profileId) {
    try {
        const res = await api.get(`/profiles/${profileId}/stats/weight`);
        return res.data?.stats?.latest ?? null;
    } catch {
        try {
            const r2 = await api.get(`/profiles/${profileId}/logs`, {
                params: { category: "weight", limit: 1, page: 1 },
            });
            const arr = Array.isArray(r2.data?.data)
                ? r2.data.data
                : Array.isArray(r2.data?.logs)
                    ? r2.data.logs
                    : Array.isArray(r2.data)
                        ? r2.data
                        : [];
            return arr[0]?.value ?? null;
        } catch {
            return null;
        }
    }
}

async function getActiveRxCount(profileId) {
    try {
        const res = await api.get(`/prescriptions/profiles/${profileId}`, {
            params: { active: true },
        });
        const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data?.prescriptions)
                ? res.data.prescriptions
                : Array.isArray(res.data)
                    ? res.data
                    : [];
        return list.length;
    } catch {
        try {
            const r2 = await api.get(`/profiles/${profileId}/prescriptions`);
            const list = Array.isArray(r2.data?.data)
                ? r2.data.data
                : Array.isArray(r2.data?.prescriptions)
                    ? r2.data.prescriptions
                    : Array.isArray(r2.data)
                        ? r2.data
                        : [];
            return list.filter((x) => x.active !== false).length;
        } catch {
            return 0;
        }
    }
}

async function enrichProfiles(list) {
    const jobs = (list || []).map(async (p) => {
        const id = p._id || p.id;
        if (!id) return p;
        const [latestWeight, activeRxCount] = await Promise.all([
            getWeightLatest(id),
            getActiveRxCount(id),
        ]);
        return { ...p, latestWeight, activeRxCount };
    });
    const results = await Promise.allSettled(jobs);
    return results.map((r, i) => (r.status === "fulfilled" ? r.value : list[i]));
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    const [me, setMe] = useState(null);

    const [profiles, setProfiles] = useState([]);
    const [profilesLoading, setProfilesLoading] = useState(true);

    const [reminders, setReminders] = useState([]);
    const [remindersLoading, setRemindersLoading] = useState(true);
    const [remindersErr, setRemindersErr] = useState("");

    const [insights, setInsights] = useState([]);
    const [insightsLoading, setInsightsLoading] = useState(true);

    const [miniSeries, setMiniSeries] = useState([]);

    const loadMe = async () => {
        try {
            const res = await api.get("/auth/me");
            setMe(res.data?.data ?? res.data ?? null);
        } catch {
            try {
                const res2 = await api.get("/users/me");
                setMe(res2.data?.data ?? res2.data ?? null);
            } catch {
                setMe(null);
            }
        }
    };

    const loadProfiles = async () => {
        setProfilesLoading(true);
        try {
            let res = await api.get("/profiles", { params: { active: true } });
            let list =
                Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data?.profiles)
                        ? res.data.profiles
                        : Array.isArray(res.data)
                            ? res.data
                            : [];

            list = list.filter((p) => (p.active ?? true) === true);

            list = await enrichProfiles(list);

            setProfiles(list);
        } catch {
            try {
                const res2 = await api.get("/profiles");
                let list =
                    Array.isArray(res2.data?.data)
                        ? res2.data.data
                        : Array.isArray(res2.data?.profiles)
                            ? res2.data.profiles
                            : Array.isArray(res2.data)
                                ? res2.data
                                : [];
                list = list.filter((p) => (p.active ?? true) === true);

                list = await enrichProfiles(list);

                setProfiles(list);
            } finally {
                setProfilesLoading(false);
            }
            return;
        }
        setProfilesLoading(false);
    };

    const loadReminders = async () => {
        setRemindersLoading(true);
        setRemindersErr("");
        try {
            let list = [];
            try {
                const res = await api.get("/reminders", { params: { limit: 100 } });
                list = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                        ? res.data
                        : [];
            } catch (e) {
                if (e?.response?.status !== 404) throw e;
                list = [];
            }
            setReminders(list);
        } catch {
            setRemindersErr("Failed to load reminders.");
            setReminders([]);
        } finally {
            setRemindersLoading(false);
        }
    };

    const loadInsights = async () => {
        setInsightsLoading(true);
        try {
            const actives = (profiles || []).filter((p) => (p.active ?? true) === true);
            if (actives.length === 0) {
                setInsights([]);
                setInsightsLoading(false);
                return;
            }

            const fetchLogsFor = async (pid) => {
                try {
                    const res = await api.get(`/logs/profiles/${pid}/logs`, {
                        params: { limit: 3, page: 1 },
                    });
                    return Array.isArray(res.data?.data)
                        ? res.data.data
                        : Array.isArray(res.data?.logs)
                            ? res.data.logs
                            : Array.isArray(res.data)
                                ? res.data
                                : [];
                } catch (e) {
                    if (e?.response?.status !== 404) throw e;
                    const r2 = await api.get(`/profiles/${pid}/logs`, {
                        params: { limit: 3, page: 1 },
                    });
                    return Array.isArray(r2.data?.data)
                        ? r2.data.data
                        : Array.isArray(r2.data?.logs)
                            ? r2.data.logs
                            : Array.isArray(r2.data)
                                ? r2.data
                                : [];
                }
            };

            const results = await Promise.all(
                actives.map((p) =>
                    fetchLogsFor(p._id || p.id).then((list) =>
                        list.map((x) => ({
                            ...x,
                            profileId: x.profileId || (p._id || p.id),
                            profileName: p.name || "—",
                        }))
                    )
                )
            );

            const merged = results.flat();
            merged.sort(
                (a, b) =>
                    new Date(b.date || b.createdAt || 0) -
                    new Date(a.date || a.createdAt || 0)
            );
            setInsights(merged.slice(0, 3));
        } catch {
            setInsights([]);
        } finally {
            setInsightsLoading(false);
        }
    };

    const loadMiniTrend = async () => {
        try {
            const active = profiles.find((p) => p.active ?? true) || profiles[0];
            if (!active) {
                setMiniSeries([]);
                return;
            }
            let res;
            try {
                res = await api.get(`/profiles/${active._id || active.id}/stats/weight`);
                const series = Array.isArray(res.data?.series) ? res.data.series : [];
                setMiniSeries(series.slice(-10));
            } catch {
                const lr = await api.get(`/profiles/${active._id || active.id}/logs`, {
                    params: { category: "weight", limit: 10 },
                });
                const arr = Array.isArray(lr.data?.data)
                    ? lr.data.data
                    : Array.isArray(lr.data?.logs)
                        ? lr.data.logs
                        : Array.isArray(lr.data)
                            ? lr.data
                            : [];
                const mapped = arr
                    .filter((x) => x.category === "weight")
                    .map((x) => ({ date: x.date, value: x.value }));
                setMiniSeries(mapped.slice(-10));
            }
        } catch {
            setMiniSeries([]);
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await Promise.all([loadMe(), loadProfiles()]);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (profilesLoading) return;
        loadReminders();
        loadInsights();
        loadMiniTrend();
    }, [profilesLoading, profiles.length]);

    const refCarousel = useRef(null);
    const scrollByCards = (dir = 1) => {
        const el = refCarousel.current;
        if (!el) return;
        const amount = Math.min(900, el.clientWidth * 0.9);
        el.scrollBy({ left: dir * amount, behavior: "smooth" });
    };

    const greetingName = useMemo(() => {
        const raw = me?.name || me?.firstName || me?.email || "there";
        return String(raw).split(" ")[0];
    }, [me]);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-dvh bg-gradient-to-b from-white via-violet-50/50 to-purple-50/40">
            <div id="main" className="mx-auto max-w-6xl px-6 py-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            Welcome, {greetingName}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Your family’s health at a glance.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/profiles"
                            className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-violet-700 shadow-sm transition hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                        >
                            View All Profiles
                        </Link>
                        <Link
                            to="/profiles"
                            className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
                        >
                            + Add Profile
                        </Link>
                    </div>
                </div>

                <section className="mb-8">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800">Profiles</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollByCards(-1)}
                                className="rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => scrollByCards(1)}
                                className="rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {profilesLoading ? (
                        <div className="rounded-2xl border border-violet-200 bg-white/90 p-4 text-sm text-slate-600">
                            Loading profiles…
                        </div>
                    ) : profiles.length === 0 ? (
                        <div className="rounded-2xl border border-violet-200 bg-white/90 p-6 text-slate-600">
                            No profiles yet. Click “+ Add Profile” to create one.
                        </div>
                    ) : (
                        <div
                            ref={refCarousel}
                            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {profiles.map((p) => (
                                <div
                                    key={p._id || p.id}
                                    className="min-w-[300px] max-w-[320px] shrink-0"
                                >
                                    <ProfileCard profile={p} onChanged={loadProfiles} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card title="Reminders">
                        {remindersLoading ? (
                            <div className="rounded-2xl border border-violet-200 bg-white/90 p-3 text-sm text-slate-600">
                                Loading reminders…
                            </div>
                        ) : remindersErr ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {remindersErr}
                            </div>
                        ) : reminders.length === 0 ? (
                            <div className="rounded-2xl border border-violet-200 bg-white/90 p-3 text-sm text-slate-600">
                                Nothing to remind you of. Hydrate and keep going! 💧
                            </div>
                        ) : (
                            <div className="max-h-56 overflow-y-auto pr-1">
                                <ul className="space-y-2">
                                    {reminders.map((r) => (
                                        <li
                                            key={r.key || r._id || r.id}
                                            className="flex items-start justify-between rounded-2xl border border-violet-200 bg-white/90 p-3 shadow-sm"
                                        >
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-slate-800">
                                                    {r.title || r.type || "Reminder"}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {r.when ? new Date(r.when).toLocaleString() : "soon"}
                                                    {r.profileName ? ` • ${r.profileName}` : ""}
                                                </div>
                                                {r.notes ? (
                                                    <div className="mt-1 text-sm text-slate-700">{r.notes}</div>
                                                ) : null}
                                            </div>

                                            <button
                                                onClick={() => dismissReminder(r, setReminders)}
                                                className="ml-3 shrink-0 rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                                                aria-label={`Dismiss reminder: ${r.title || r.type || ""}`}
                                            >
                                                Dismiss
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>

                    <Card title="Insights (Latest Logs)" className="lg:col-span-2">
                        {insightsLoading ? (
                            <div className="rounded-xl border border-violet-200 bg-white p-3 text-sm text-slate-600">
                                Loading insights…
                            </div>
                        ) : insights.length === 0 ? (
                            <div className="rounded-xl border border-violet-200 bg-white p-3 text-sm text-slate-600">
                                No recent activity.
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {insights.map((it) => (
                                    <li
                                        key={it._id}
                                        className="flex items-start justify-between rounded-xl border border-violet-200 bg-white p-3 shadow-sm"
                                    >
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium capitalize text-slate-800">
                                                {it.category} •{" "}
                                                <span className="text-violet-700">{it.profileName || "—"}</span>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {it.value != null ? `Value: ${it.value} • ` : ""}
                                                {it.date ? new Date(it.date).toLocaleString() : ""}
                                            </div>
                                            {it.notes ? (
                                                <div className="mt-1 text-sm text-slate-700">{it.notes}</div>
                                            ) : null}
                                        </div>
                                        {it.category === "weight" && it.value != null ? (
                                            <span className="ml-3 shrink-0 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                                                {it.value}
                                            </span>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <Card title="Need Help?" className="lg:col-span-2">
                        <AskAiCard />
                    </Card>

                    <Card title="Tips & Suggestions">
                        <TipsBlock />
                    </Card>
                </div>

                <div className="mt-6">
                    <Card title="Quick Actions">
                        <div className="flex flex-wrap gap-2">
                            <Link
                                to="/profiles"
                                className="rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-sm text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                            >
                                Open Profiles
                            </Link>
                            <Link
                                to="/profiles"
                                className="rounded-xl bg-violet-600 px-3 py-1.5 text-sm text-white hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
                            >
                                + Quick Log
                            </Link>
                            <Link
                                to="/profiles"
                                className="rounded-xl bg-violet-500 px-3 py-1.5 text-sm text-white hover:bg-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-300"
                            >
                                + Add Rx
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Card({ title, className = "", children }) {
    return (
        <section
            className={
                "rounded-2xl border border-violet-200 bg-white/90 p-4 shadow-sm " + className
            }
        >
            {title ? <h3 className="mb-2 font-semibold text-slate-800">{title}</h3> : null}
            {children}
        </section>
    );
}

async function dismissReminder(reminder, setReminders) {
    try {
        const key = encodeURIComponent(reminder.key || reminder._id || reminder.id);
        await api.post(`/reminders/${key}/dismiss`);
    } catch {
    } finally {
        const k = reminder.key || reminder._id || reminder.id;
        setReminders((prev) => prev.filter((x) => (x.key || x._id || x.id) !== k));
    }
}

function TipsBlock() {
    const tips = [
        "Log weight at the same time daily for cleaner trends.",
        "Add notes to meal logs when you try something new.",
        "Use prescriptions’ ‘active’ toggle to pause meds during breaks.",
        "Hydration tip: set 3 small water reminders instead of 1 big one.",
        "Create separate profiles for each child to keep trends accurate.",
    ];
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIdx((i) => (i + 1) % tips.length), 5000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="rounded-xl border border-violet-200 bg-white p-3 text-sm text-slate-700">
            {tips[idx]}
        </div>
    );
}
