import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/Authprovider";
import AuthForm from "../components/AuthForm";

export default function Register() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    await register(data);
    navigate("/");
  };

  return <AuthForm onSubmit={handleRegister} buttonText="Register" />;
}
