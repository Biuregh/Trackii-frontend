import { Link } from "react-router-dom";

export default function ProfileCard({ profile }) {
    const lastWeight = profile.latestWeight ?? null;
    const activeRx = profile.activeRxCount ?? 0;
    const id = profile._id;

    return (
        <div id="main" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-800">{profile.type}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
                    <div className="text-gray-500">Last weight</div>
                    <div className="text-base font-medium">{lastWeight ? `${lastWeight} kg` : "—"}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
                    <div className="text-gray-500">Active Rx</div>
                    <div className="text-base font-medium">{activeRx}</div>
                </div>
            </div>
            <div className="mt-4">
                <Link
                    to={`/profiles/${id}`}
                    aria-label={`Open dashboard for ${profile.name}`}
                    className="block w-full rounded-xl bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                >
                    View Dashboard
                </Link>
            </div>
        </div>
    );
}
