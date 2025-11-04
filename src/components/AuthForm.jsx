import { useState } from "react";

export default function AuthForm({ onSubmit, buttonText, disabled, passwordAutoComplete = "current-password" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) return;
        if (password.length < 6) return;
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1">
                <label htmlFor="email" className="text-sm">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
            </div>

            <div className="grid gap-1">
                <label htmlFor="password" className="text-sm">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete={passwordAutoComplete}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={disabled}
                className="rounded px-4 py-2 bg-blue-600 text-white disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                {buttonText}
            </button>
        </form>
    );
}