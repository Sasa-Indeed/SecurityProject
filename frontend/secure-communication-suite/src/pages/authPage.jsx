import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthCard from "../components/Auth/AuthCard";
import { login, signup } from "../services/api";
import { validateFields } from "../utils/validators"; 
import "../styles/auth.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await login(email, password);
      console.log("Login success:", data);
    } catch (error) {
      console.error("Login error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const data = await signup(email, password);
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
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        toggleForm={toggleForm}
      />
    </div>
  );
};

export default AuthPage;