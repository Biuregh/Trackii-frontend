// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import AuthForm from "../components/AuthForm";

export default function Register() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (body) => {
    setErr("");
    setSubmitting(true);
    try {
      // body will be { name, email, password } because includeName is true
      const res = await api.post("/auth/register", body);
      // optionally auto-login if API returns token:
      // storage.setToken(res.data.token)
      navigate("/dashboard");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.errors?.[0]?.msg ||
        "Registration failed.";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-gradient-to-b from-white via-violet-50/50 to-purple-50/40 px-6 py-8">
      <div className="w-full max-w-md rounded-2xl border border-violet-200 bg-white/90 p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-800">Create account</h1>
        <p className="mb-4 text-sm text-slate-500">Join Trackii in seconds.</p>

        {err ? (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <AuthForm
          includeName  
          buttonText="Create account"
          disabled={submitting}
          passwordAutoComplete="new-password"
          onSubmit={handleSubmit}
        />

        <div className="mt-3 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-700 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
