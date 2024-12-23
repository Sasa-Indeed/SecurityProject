import React from "react";

const AuthMessage = ({ isLogin }) => (
  <div className="auth-message" data-aos="fade-right" data-aos-delay="200">
    <h2>{isLogin ? "Welcome Back!" : "Welcome On Board!"}</h2>
    <p>
      {isLogin
        ? "Sign in to continue accessing your account and services."
        : "Register to start using our encryption and security services."}
    </p>
  </div>
);

export default AuthMessage;
