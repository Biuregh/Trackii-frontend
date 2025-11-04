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
    setSubmitting(true);
    setError("");
    try {
      await login(values);
      navigate("/dashboard");
    } catch (e) {
      const m = e?.response?.data?.errors?.[0]?.msg || e?.response?.data?.message || "Login failed";
      setError(m);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="main" className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {error ? (
        <p id="login-error" role="alert" aria-live="polite" className="mb-3 text-red-600">
          {error}
        </p>
      ) : null}
      <AuthForm
        onSubmit={handleLogin}
        buttonText={submitting ? "…" : "Login"}
        disabled={submitting}
        passwordAutoComplete="current-password"
      />
    </div>
  );
}
