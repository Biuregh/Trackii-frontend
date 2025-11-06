import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profiles from "../pages/Profiles";
import RequireAuth from "../components/RequireAuth";
import ProfileDashboard from "../pages/ProfileDashboard";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }
            />
            <Route
                path="/profiles"
                element={
                    <RequireAuth>
                        <Profiles />
                    </RequireAuth>
                }
            />
            <Route
                path="/profiles/:id"
                element={
                    <RequireAuth>
                        <ProfileDashboard />
                    </RequireAuth>
                }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
