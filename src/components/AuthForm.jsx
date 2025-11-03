import { useState } from "react";

export default function AuthForm({ onSubmit, buttonText, disabled }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) return;
        if (password.length < 6) return;
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-3">
            <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <button type="submit" disabled={disabled} className="rounded px-3 py-2 bg-blue-600 text-white disabled:opacity-60">
                {buttonText}
            </button>
        </form>
    );
}