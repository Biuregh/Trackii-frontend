import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuthContext } from "../context/Authprovider";

export default function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (values) => {
    console.log(values)
    setSubmitting(true);

    setError("");
    try {
      await login(values);

      navigate("/dashboard");
    } catch (e) {
      const m =
        e?.response?.data?.errors?.[0]?.msg ||
        e?.response?.data?.message ||
        "Login failed";
      setError(m);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white via-violet-50/50 to-purple-50/40">
      <div className="mx-auto max-w-sm px-6 py-16">
        <div className="rounded-2xl border border-violet-200 bg-white/90 p-6 shadow-sm backdrop-blur">

          <h1 className="text-xl font-semibold text-slate-800 text-center">
            Welcome back
          </h1>
          <p className="mt-1 mb-4 text-center text-sm text-slate-500">
            Log in to continue to your family dashboard.
          </p>

          {error ? (
            <p
              id="login-error"
              role="alert"
              aria-live="polite"
              className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <AuthForm
            onSubmit={handleLogin}
            buttonText={submitting ? "…" : "Login"}
            disabled={submitting}
            passwordAutoComplete="current-password"
          />

          <div className="mt-4 text-center">
            <a
              href="/register"
              className="text-sm text-violet-700 hover:text-violet-800 hover:underline"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
