import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import Spinner from "../components/Spinner";
import WeightChart from "../components/WeightChart";

export default function ProfileDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState([]);
    const [weightStats, setWeightStats] = useState(null);
    const [weightSeries, setWeightSeries] = useState([]);

    const [tab, setTab] = useState("overview");

    const [showLog, setShowLog] = useState(false);
    const [logCategory, setLogCategory] = useState("weight");
    const [logValue, setLogValue] = useState("");
    const [logDate, setLogDate] = useState("");

    const [showRx, setShowRx] = useState(false);
    const [rxName, setRxName] = useState("");
    const [rxDosage, setRxDosage] = useState("");
    const [rxFrequency, setRxFrequency] = useState("");
    const [rxStart, setRxStart] = useState("");
    const [rxActive, setRxActive] = useState(true);

    const [submitting, setSubmitting] = useState(false);
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
        } catch (e) {
            setErrorMsg("Failed to load profile stats.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        load();
    }, [id]);

    const submitLog = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg("");
        try {
            const body = { profileId: id, category: logCategory };
            if (logValue) body.value = Number(logValue);
            if (logDate) body.date = new Date(logDate).toISOString();
            await api.post("/logs", body);
            setShowLog(false);
            setLogCategory("weight");
            setLogValue("");
            setLogDate("");
            load();
        } catch (err) {
            const m = err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || "Failed to add log.";
            setErrorMsg(m);
        } finally {
            setSubmitting(false);
        }
    };

    const submitRx = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg("");
        try {
            const body = {
                profileId: id,
                name: rxName,
                dosage: rxDosage || undefined,
                frequency: rxFrequency || undefined,
                startDate: rxStart ? new Date(rxStart).toISOString() : undefined,
                active: !!rxActive
            };
            await api.post("/prescriptions", body);
            setShowRx(false);
            setRxName("");
            setRxDosage("");
            setRxFrequency("");
            setRxStart("");
            setRxActive(true);
            load();
        } catch (err) {
            const m = err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || "Failed to add prescription.";
            setErrorMsg(m);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div id="main" className="p-6">
            <div className="mb-4 flex justify-between">
                <button className="underline" onClick={() => navigate("/dashboard")}>Back</button>
                <div className="flex gap-2">
                    <button className="rounded px-3 py-2 bg-emerald-600 text-white" onClick={() => setShowLog(true)}>+ Quick Log</button>
                    <button className="rounded px-3 py-2 bg-blue-600 text-white" onClick={() => setShowRx(true)}>+ Add Rx</button>
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

                    <div className="rounded border p-4">
                        <div className="mb-2 font-semibold">Recent Weight</div>
                        <WeightChart series={weightSeries} />
                    </div>
                </div>
            )}

            {tab === "chart" && (
                <div className="rounded border p-4">
                    <div className="mb-2 font-semibold">Weight Chart (last 30)</div>
                    <WeightChart series={weightSeries} />
                </div>
            )}

            {showLog && (
                <div className="fixed inset-0 grid place-items-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded bg-white p-4">
                        <div className="mb-3 text-lg font-semibold">Quick Log</div>
                        <form onSubmit={submitLog} className="grid gap-3">
                            <select value={logCategory} onChange={(e) => setLogCategory(e.target.value)} className="border p-2 rounded">
                                <option value="weight">weight</option>
                                <option value="meal">meal</option>
                                <option value="water">water</option>
                                <option value="feed">feed</option>
                                <option value="sleep">sleep</option>
                                <option value="growth">growth</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Value"
                                value={logValue}
                                onChange={(e) => setLogValue(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="date"
                                value={logDate}
                                onChange={(e) => setLogDate(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowLog(false)} className="px-3 py-2">Cancel</button>
                                <button disabled={submitting} className="rounded px-3 py-2 bg-emerald-600 text-white">{submitting ? "Saving..." : "Save"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showRx && (
                <div className="fixed inset-0 grid place-items-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded bg-white p-4">
                        <div className="mb-3 text-lg font-semibold">Add Prescription</div>
                        <form onSubmit={submitRx} className="grid gap-3">
                            <input
                                placeholder="Name"
                                value={rxName}
                                onChange={(e) => setRxName(e.target.value)}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                placeholder="Dosage"
                                value={rxDosage}
                                onChange={(e) => setRxDosage(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                placeholder="Frequency"
                                value={rxFrequency}
                                onChange={(e) => setRxFrequency(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="date"
                                value={rxStart}
                                onChange={(e) => setRxStart(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={rxActive}
                                    onChange={(e) => setRxActive(e.target.checked)}
                                />
                                Active
                            </label>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowRx(false)} className="px-3 py-2">Cancel</button>
                                <button disabled={submitting} className="rounded px-3 py-2 bg-blue-600 text-white">{submitting ? "Saving..." : "Save"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
