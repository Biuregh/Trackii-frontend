import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/Authprovider";

export default function LogoutButton() {
    const { logout } = useAuthContext();
    const navigate = useNavigate();

    const handle = () => {
        logout();
        navigate("/login");
    };

    return (
        <button
            onClick={handle}
            className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-200"
        >
            Logout
        </button>
    );
}
