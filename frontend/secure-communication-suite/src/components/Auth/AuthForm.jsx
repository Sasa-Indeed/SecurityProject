import React, { useState } from "react";
import { validateEmail, validatePassword, matchPasswords } from "../../utils/validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthForm = ({ isLogin, handleLogin, handleSignup, toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
 
    const fieldErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) {
      fieldErrors.email = emailError;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      fieldErrors.password = passwordError;
    }
    
    const confirmPasswordError = matchPasswords(password, confirmPassword);
    if (confirmPasswordError) {
      fieldErrors.confirmPassword = confirmPasswordError;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    if (isLogin) {
      handleLogin(email, password);
    } else {
      handleSignup(email, password);
    }
  };

  return (
    <div className="auth-form" data-aos="fade-left" data-aos-delay="400">
      <h3>{isLogin ? "Login" : "Sign Up"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group" data-aos="fade-in">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group" data-aos="fade-in">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <span
              className="password-toggle-icon"
              onClick={() => setPasswordVisible((prevState) => !prevState)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        {!isLogin && (
          <>
            <div className="form-group" data-aos="fade-in">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setConfirmPasswordVisible((prevState) => !prevState)}
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>
          </>
        )}

        <input
          type="submit"
          value={isLogin ? "Login" : "Sign Up"}
          className="auth-submit"
          data-aos="zoom-in"
          data-aos-delay="600"
        />
      </form>
      
      <p className="toggle-link" data-aos="fade-in" data-aos-delay="800">
        {isLogin ? "Not registered yet?" : "Already have an account?"}{" "}
        <span onClick={toggleForm}>{isLogin ? "Sign Up" : "Login"}</span>
      </p>
    </div>
  );
};

export default AuthForm;

