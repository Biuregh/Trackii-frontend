import { useState } from "react";

export default function AuthForm({ onSubmit, buttonText }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) return;
        if (password.length < 6) return;
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">{buttonText}</button>
        </form>
    );
}
