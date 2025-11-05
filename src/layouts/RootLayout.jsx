import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function RootLayout() {
    return (
        <>
            <a href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:rounded-xl focus:border focus:border-violet-300 focus:bg-white focus:px-3 focus:py-2 focus:text-violet-700 focus:shadow-sm focus:ring-4 focus:ring-violet-200"
            >
                Skip to content
            </a>

            <Header />

            <main id="main"
                className="mx-auto min-h-dvh max-w-5xl px-6 py-8 pt-16"
            >
                <Outlet />
            </main>
        </>
    );
}
