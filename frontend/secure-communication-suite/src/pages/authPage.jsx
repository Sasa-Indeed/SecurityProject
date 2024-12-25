import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthCard from "../components/Auth/AuthCard";
import { login, signup } from "../services/api";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { setUserEmail } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      setUserEmail(email);
      console.log("Login success:", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSignup = async () => {
    try {
      console.log("Signup with:", { email, password });
      const data = await signup(email, password);
      setUserEmail(email);
      console.log("Signup success:", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-page">
      <AuthCard
        isLogin={isLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        toggleForm={toggleForm}
      />
    </div>
  );
};

export default AuthPage;