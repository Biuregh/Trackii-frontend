import { useEffect, useState } from "react";
import api from "../lib/api";
import ProfileCard from "../components/ProfileCard";
import Modal from "../components/Modal";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("general");
  const [dueDate, setDueDate] = useState(""); 
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.profiles)) return payload.profiles;
    return [];
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/profiles");
      setProfiles(normalizeList(res.data));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) return;

    const body = { name: name.trim(), type };
    if (type === "pregnancy") {
      if (!dueDate) {
        setFormError("Due date is required for pregnancy.");
        return;
      }
      body.dueDate = new Date(dueDate).toISOString();
    }

    setSubmitting(true);
    try {
      const res = await api.post("/profiles", body);
      const created = res.data?.data ?? res.data ?? null;
      if (created) setProfiles((prev) => [created, ...prev]);

      setShowCreate(false);
      setName("");
      setType("general");
      setDueDate("");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Failed to create profile.";
      setFormError(msg);
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

      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <h2 className="mb-2 text-lg font-semibold">Create Profile</h2>

        {formError ? (
          <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {formError}
          </div>
        ) : null}

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

          {type === "pregnancy" && (
            <div>
              <label className="mb-1 block text-sm">Due Date</label>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-slate-800"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl px-4 py-2">
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
      </Modal>
    </div>
  );
}