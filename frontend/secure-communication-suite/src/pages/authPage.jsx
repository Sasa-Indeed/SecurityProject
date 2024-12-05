import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./../styles/authStyles.css";



const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: "ease-in-out"
    });
  }, []);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" data-aos="fade-up">
        <div
          className="auth-message"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <h2>{isLogin ? "Welcome Back!" : "Welcome On Board!"}</h2>
          <p>
            {isLogin
              ? "Sign in to continue accessing your account and services."
              : "Register to start using our encryption and security services."}
          </p>
        </div>
        <div
          className="auth-form"
          data-aos="fade-left"
          data-aos-delay="400"
        >
          <h3>{isLogin ? "Login" : "Sign Up"}</h3>
          <form>
            {isLogin ? (
              <>
                <div className="form-group" data-aos="fade-in">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your email" />
                </div>
                <div className="form-group" data-aos="fade-in">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group" data-aos="fade-in">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="Enter your full name" />
                </div>
                <div className="form-group" data-aos="fade-in">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your email" />
                </div>
                <div className="form-group" data-aos="fade-in">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="form-group" data-aos="fade-in">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="toggle-link" data-aos="fade-in" data-aos-delay="800">
            {isLogin
              ? "Not registered yet?"
              : "Already have an account?"}{" "}
            <span onClick={toggleForm}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


