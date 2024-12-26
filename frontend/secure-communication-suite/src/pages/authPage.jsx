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
  const [isLoading, setIsLoading] = useState(false);
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
      const tempEmail = email;
      setIsLoading(true);
      const data = await login(email, password);
      console.log("temp email:", tempEmail);
      setUserEmail(tempEmail);
      console.log("Login success:", data);
      console.log("Logged in as:", tempEmail);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const tempEmail = email;
      const data = await signup(email, password);
      setUserEmail(tempEmail);
      navigate("/dashboard");
      console.log("Signup success:", data);
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
        isLoading={isLoading}
      />
    </div>
  );
};

export default AuthPage;