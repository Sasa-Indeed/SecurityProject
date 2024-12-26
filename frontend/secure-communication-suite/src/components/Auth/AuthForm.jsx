import React, { useState } from "react";
import { validateEmail, validatePassword, matchPasswords } from "../../utils/validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthForm = ({
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
  isLoading
}) => {
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSubmit = async (event) => {
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
    if (!isLogin) {
      const confirmPasswordError = matchPasswords(password, confirmPassword);
      if (confirmPasswordError) {
        fieldErrors.confirmPassword = confirmPasswordError;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="auth-form" data-aos="fade-left" data-aos-delay="400">
      <h3>{isLogin ? "Login" : "Sign Up"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <span
              className="password-toggle-icon"
              onClick={() => !isLoading && setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <span
                className="password-toggle-icon"
                onClick={() => !isLoading && setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>
        )}

        {errors.submit && (
          <div className="error-message text-center mb-4">{errors.submit}</div>
        )}

        <button
          type="submit"
          className={`auth-submit ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLogin
            ? (isLoading ? "Logging in..." : "Login")
            : (isLoading ? "Signing up..." : "Sign Up")
          }
        </button>
      </form>

      <p className="toggle-link">
        {isLogin ? "Not registered yet?" : "Already have an account?"}{" "}
        <span onClick={() => !isLoading && toggleForm()}>
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;
