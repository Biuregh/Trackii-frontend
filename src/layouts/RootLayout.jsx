import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function RootLayout() {
    return (
        <div className="min-h-dvh bg-slate-950 text-slate-100">
            <Header />
            <main id="main" className="mx-auto max-w-6xl px-4 py-6 outline-none">
                <Outlet />
            </main>
        </div>
    );
}
