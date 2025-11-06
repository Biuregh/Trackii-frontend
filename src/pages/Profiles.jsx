import { useEffect, useState } from "react";
import api from "../lib/api";
import ProfileCard from "../components/ProfileCard";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import LogoutButton from "../components/LogoutButton";

export default function Profiles() {
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

  if (loading) return <Spinner />;

  return (
    <div
      id="main"
      className="min-h-dvh bg-gradient-to-b from-white via-violet-50/50 to-purple-50/40"
    >
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Your Profiles</h1>
            <p className="mt-1 text-sm text-slate-500">
              Keep your family’s health in one calm place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-violet-500 px-4 py-2 text-white shadow-sm transition hover:bg-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-300"
            >
              + Add Profile
            </button>
            <LogoutButton />
          </div>
        </div>

        {Array.isArray(profiles) && profiles.length === 0 ? (
          <div className="rounded-2xl border border-violet-200 bg-white/80 p-10 text-center shadow-sm">

            <p className="mb-4 text-slate-600">No profiles yet.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-violet-500 px-4 py-2 text-white shadow-sm transition hover:bg-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-300"
            >
              + Add Profile
            </button>
          </div>
        ) : Array.isArray(profiles) ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p) => (
              <ProfileCard key={p._id || p.id} profile={p} onChanged={fetchProfiles} />
            ))}
          </div>
        ) : null}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)}>
        <h2 className="mb-2 text-lg font-semibold text-slate-800">Create Profile</h2>

        {formError ? (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Emma"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
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
              <label className="mb-1 block text-sm text-slate-600" htmlFor="dueDate">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-slate-800 focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-violet-300"
            >
              {submitting ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}