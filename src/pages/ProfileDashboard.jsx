import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import Spinner from "../components/Spinner";
import WeightChart from "../components/WeightChart";
import LogModal from "../components/LogModal";
import PrescriptionsList from "../components/PrescriptionsList";
import LogsList from "../components/LogsList";
import LogoutButton from "../components/LogoutButton";

export default function ProfileDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const [profile, setProfile] = useState(null);
    const [summary, setSummary] = useState([]);
    const [weightStats, setWeightStats] = useState(null);
    const [weightSeries, setWeightSeries] = useState([]);

    const [tab, setTab] = useState("overview");
    const [logOpen, setLogOpen] = useState(false);

    const load = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            const [p, s, w] = await Promise.all([
                api.get(`/profiles/${id}`),
                api.get(`/profiles/${id}/stats/summary`),
                api.get(`/profiles/${id}/stats/weight`),
            ]);

            const pData = p?.data?.data ?? p?.data ?? null;
            setProfile(pData);

            const sData = Array.isArray(s?.data?.data)
                ? s.data.data
                : Array.isArray(s?.data)
                    ? s.data
                    : [];
            setSummary(sData);

            setWeightStats(w?.data?.stats || null);
            setWeightSeries(Array.isArray(w?.data?.series) ? w.data.series : []);
        } catch (e) {
            setErrorMsg("Failed to load profile stats.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) load();
    }, [id]);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-dvh bg-gradient-to-b from-white via-violet-50/50 to-purple-50/40">
            <div id="main" className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">
                            <span className="text-violet-700">{profile?.name || "—"}'s Profile</span>
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
                            onClick={() => {
                                setTab("logs");
                                setLogOpen(true);
                            }}
                        >
                            + Quick Log
                        </button>
                        <button
                            className="rounded-xl bg-violet-500 px-4 py-2 text-white shadow-sm transition hover:bg-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-300"
                            onClick={() => setTab("rx")}
                        >
                            + Add Rx
                        </button>
                        <LogoutButton />
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMsg}
                    </div>
                )}

                <button
                    onClick={() => navigate("/profiles")}
                    className="mb-4 rounded-xl px-3 py-2 text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    ← Back
                </button>
                <div
                    role="tablist"
                    aria-label="Profile sections"
                    className="mb-6 flex flex-wrap items-center gap-2"
                >
                    <TabButton id="tab-overview" active={tab === "overview"} onClick={() => setTab("overview")}>
                        Overview
                    </TabButton>
                    <TabButton id="tab-logs" active={tab === "logs"} onClick={() => setTab("logs")}>
                        Logs
                    </TabButton>
                    <TabButton id="tab-rx" active={tab === "rx"} onClick={() => setTab("rx")}>
                        Prescriptions
                    </TabButton>
                    <TabButton id="tab-chart" active={tab === "chart"} onClick={() => setTab("chart")}>
                        Chart
                    </TabButton>
                </div>

                {tab === "overview" && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card title="Weight">
                            <dl className="grid grid-cols-2 gap-y-2 text-slate-700">
                                <Item label="Latest" value={weightStats?.latest ?? "—"} />
                                <Item label="Min" value={weightStats?.min ?? "—"} />
                                <Item label="Max" value={weightStats?.max ?? "—"} />
                                <Item label="Avg" value={weightStats?.avg ?? "—"} />
                                <Item label="Count" value={weightStats?.count ?? 0} />
                            </dl>
                        </Card>

                        <Card title="Activity">
                            {summary.length === 0 ? (
                                <div className="text-slate-600">No stats yet.</div>
                            ) : (
                                <ul className="list-disc pl-6 text-slate-700">
                                    {summary.map((s) => (
                                        <li key={s._id}>
                                            {s._id}: {s.count}{" "}
                                            {s.latest ? `(latest ${new Date(s.latest).toLocaleDateString()})` : ""}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card title="Recent Weight" full>
                            <div className="min-w-0">
                                <WeightChart series={weightSeries} />
                            </div>
                        </Card>
                    </div>
                )}

                {tab === "logs" && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setLogOpen(true)}
                            className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
                        >
                            + Quick Log
                        </button>
                        <LogModal
                            open={logOpen}
                            onClose={(changed) => {
                                setLogOpen(false);
                                if (changed) load();
                            }}
                            profileId={id}
                        />
                        <Card title="Logs">
                            <LogsList profileId={id} onChanged={load} />
                        </Card>
                    </div>
                )}

                {tab === "rx" && (
                    <Card title="Prescriptions">
                        <PrescriptionsList profileId={id} />
                    </Card>
                )}

                {tab === "chart" && (
                    <Card title="Weight Chart (last 30)">
                        <div className="min-w-0">
                            <WeightChart series={weightSeries} />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

function TabButton({ id, active, children, ...props }) {
    return (
        <button
            role="tab"
            id={id}
            aria-selected={active}
            className={[
                "rounded-xl px-3 py-2 transition focus:outline-none focus:ring-4",
                active
                    ? "bg-violet-600 text-white shadow-sm focus:ring-violet-300"
                    : "bg-white text-violet-700 border border-violet-200 hover:bg-violet-50 focus:ring-violet-200",
            ].join(" ")}
            {...props}
        >
            {children}
        </button>
    );
}

function Card({ title, children, full = false }) {
    return (
        <section
            className={[
                "rounded-2xl border border-violet-200 bg-white/90 p-4 shadow-sm",
                full ? "md:col-span-2" : "",
            ].join(" ")}
        >
            {title && <h2 className="mb-2 font-semibold text-slate-800">{title}</h2>}
            {children}
        </section>
    );
}

function Item({ label, value }) {
    return (
        <>
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium text-slate-800">{String(value)}</dd>
        </>
    );
}
