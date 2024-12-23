import React from "react";
import AuthMessage from "./AuthMessage";
import AuthForm from "./AuthForm";

const AuthCard = ({ isLogin, handleLogin, handleSignup, toggleForm }) => (
  <div className="auth-card" data-aos="fade-up">
    <AuthMessage isLogin={isLogin} />
    <AuthForm
      isLogin={isLogin}
      handleLogin={handleLogin}
      handleSignup={handleSignup}
      toggleForm={toggleForm}
    />
  </div>
);

export default AuthCard;
