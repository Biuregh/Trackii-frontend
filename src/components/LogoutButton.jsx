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
        <button onClick={handle} className="rounded px-3 py-2 border">
            Logout
        </button>
    );
}
