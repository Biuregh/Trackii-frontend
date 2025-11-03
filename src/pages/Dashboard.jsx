import { useEffect, useState } from "react";
import api from "../lib/api";
import ProfileCard from "../components/ProfileCard";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/profiles");
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.profiles)
          ? res.data.profiles
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
      setProfiles(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/profiles", { name: name.trim(), type });
      setShowCreate(false);
      setName("");
      setType("general");
      fetchProfiles();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Profiles</h1>
          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Profiles</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          + Add Profile
        </button>
      </div>

      {Array.isArray(profiles) && profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="mb-4 text-gray-600 dark:text-gray-300">No profiles yet.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            + Add Profile
          </button>
        </div>
      ) : Array.isArray(profiles) ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard key={p._id || p.id} profile={p} />
          ))}
        </div>
      ) : null}

      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold">Create Profile</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm">Name</label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Emma"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Type</label>
                <select
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-slate-800"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="general">general</option>
                  <option value="pregnancy">pregnancy</option>
                  <option value="child">child</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}