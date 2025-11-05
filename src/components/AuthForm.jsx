import { useState } from "react";

export default function AuthForm({
    onSubmit,
    buttonText,
    disabled,
    passwordAutoComplete = "current-password",
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) return;
        if (password.length < 6) return;
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label htmlFor="email" className="text-sm text-slate-600">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2
                     text-slate-800 placeholder:text-slate-400 outline-none
                     focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="password" className="text-sm text-slate-600">
                    Password
                </label>
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
                    className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2
                     text-slate-800 placeholder:text-slate-400 outline-none
                     focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
                />
            </div>

            <button
                type="submit"
                disabled={disabled}
                className="w-full rounded-xl bg-violet-600 px-4 py-2 text-white shadow-sm
                   transition hover:bg-violet-700
                   focus:outline-none focus:ring-4 focus:ring-violet-300
                   disabled:opacity-60"
            >
                {buttonText}
            </button>
        </form>
    );
}