import { useState, useEffect } from "react";
import { getToken, setToken as storeToken, removeToken } from "../lib/storage";
import api from "../lib/api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api.get("/auth/me");
          setUser(response.data.user ?? response.data);
          setIsAuthenticated(true);
        } catch (err) {
          removeToken();
          setTokenState(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const t = response.data.data.token;
        console.log(t , response.data.data)
    if (t) {
      storeToken(t);
      setTokenState(t);
      setUser(response.data.user ?? null);
      setIsAuthenticated(true);
    }

    return response.data;
  };

  const register = async (data) => {
    const response = await api.post("/auth/register", data);
    const t = response.data.token;
    if (t) {
      storeToken(t);
      setTokenState(t);
      setUser(response.data.user ?? null);
      setIsAuthenticated(true);
    }
    return response.data;
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, token, isAuthenticated, login, register, logout };
}
