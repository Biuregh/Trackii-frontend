import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/Authprovider";
import AuthForm from "../components/AuthForm";

export default function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    await login(data);
    navigate("/");
  };

  return <AuthForm onSubmit={handleLogin} buttonText="Login" />;
}
