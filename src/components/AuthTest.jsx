import React, { useState } from "react";
import { useAuthContext } from "../context/Authprovider";

export default function AuthTest() {
  const { user, token, isAuthenticated, login, register, logout } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      console.log("Login success:", res);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await register({ email, password, name: "Test User" });
      console.log("Register success:", res);
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Auth Test</h2>
      <p>User: {user ? user.email : "No user"}</p>
      <p>Token: {token ?? "No token"}</p>
      <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>

      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
