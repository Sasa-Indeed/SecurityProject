import React from "react";
import AuthMessage from "./AuthMessage";
import AuthForm from "./AuthForm";

const AuthCard = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleLogin,
  handleSignup,
  toggleForm,
}) => (
  <div className="auth-card" data-aos="fade-up">
    <AuthMessage isLogin={isLogin} />
    <AuthForm
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

export default AuthCard;
