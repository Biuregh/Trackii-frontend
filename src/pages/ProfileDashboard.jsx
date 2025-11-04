import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import Spinner from "../components/Spinner";
import WeightChart from "../components/WeightChart";
import LogModal from "../components/LogModal";
import PrescriptionsList from "../components/PrescriptionsList";
import LogsList from "../components/LogsList";

export default function ProfileDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState([]);
    const [weightStats, setWeightStats] = useState(null);
    const [weightSeries, setWeightSeries] = useState([]);
    const [tab, setTab] = useState("overview");
    const [logOpen, setLogOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const load = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const [s, w] = await Promise.all([
                api.get(`/profiles/${id}/stats/summary`),
                api.get(`/profiles/${id}/stats/weight`)
            ]);
            const sData = Array.isArray(s.data?.data) ? s.data.data : Array.isArray(s.data) ? s.data : [];
            setSummary(sData);
            const ws = w.data?.stats || null;
            const series = Array.isArray(w.data?.series) ? w.data.series : [];
            setWeightStats(ws);
            setWeightSeries(series);
        } catch {
            setErrorMsg("Failed to load profile stats.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        load();
    }, [id]);

    if (loading) return <Spinner />;

    return (
        <div id="main" className="p-6">
            <div className="mb-4 flex justify-between">
                <button className="underline" onClick={() => navigate("/dashboard")}>Back</button>
                <div className="flex gap-2">
                    <button
                        className="rounded px-3 py-2 bg-emerald-600 text-white"
                        onClick={() => {
                            setTab("logs");
                            setLogOpen(true);
                        }}
                    >
                        + Quick Log
                    </button>
                    <button
                        className="rounded px-3 py-2 bg-blue-600 text-white"
                        onClick={() => setTab("rx")}
                    >
                        + Add Rx
                    </button>
                </div>
            </div>

            {errorMsg ? <div className="mb-4 text-red-600">{errorMsg}</div> : null}

            <div className="mb-4 flex gap-3">
                <button className={tab === "overview" ? "underline" : ""} onClick={() => setTab("overview")}>Overview</button>
                <button className={tab === "logs" ? "underline" : ""} onClick={() => setTab("logs")}>Logs</button>
                <button className={tab === "rx" ? "underline" : ""} onClick={() => setTab("rx")}>Prescriptions</button>
                <button className={tab === "chart" ? "underline" : ""} onClick={() => setTab("chart")}>Chart</button>
            </div>

            {tab === "overview" && (
                <div className="grid gap-4">
                    <div className="rounded border p-4">
                        <div className="mb-2 font-semibold">Weight</div>
                        <div>Latest: {weightStats?.latest ?? "—"}</div>
                        <div>Min: {weightStats?.min ?? "—"}</div>
                        <div>Max: {weightStats?.max ?? "—"}</div>
                        <div>Avg: {weightStats?.avg ?? "—"}</div>
                        <div>Count: {weightStats?.count ?? 0}</div>
                    </div>

                    <div className="rounded border p-4">
                        <div className="mb-2 font-semibold">Activity</div>
                        {summary.length === 0 ? (
                            <div>No stats yet.</div>
                        ) : (
                            <ul className="list-disc pl-6">
                                {summary.map((s) => (
                                    <li key={s._id}>
                                        {s._id}: {s.count} {s.latest ? `(latest ${new Date(s.latest).toLocaleDateString()})` : ""}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded border p-4 min-w-0">
                        <div className="mb-2 font-semibold">Recent Weight</div>
                        <WeightChart series={weightSeries} />
                    </div>
                </div>
            )}

            {tab === "logs" && (
                <div className="space-y-4">
                    <button onClick={() => setLogOpen(true)} className="rounded-lg bg-gray-900 px-4 py-2 text-white">+ Quick Log</button>
                    <LogModal open={logOpen} onClose={(changed) => { setLogOpen(false); if (changed) load(); }} profileId={id} />
                    <LogsList profileId={id} onChanged={load} />
                </div>
            )}

            {tab === "rx" && (
                <div className="space-y-4">
                    <PrescriptionsList profileId={id} />
                </div>
            )}

            {tab === "chart" && (
                <div className="rounded border p-4 min-w-0">
                    <div className="mb-2 font-semibold">Weight Chart (last 30)</div>
                    <WeightChart series={weightSeries} />
                </div>
            )}
        </div>
    );
}
