// Password validation
export const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!regex.test(password)) {
      return "Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character";
    }
    return null;
  };
  
  // Email validation
  export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };
  
  // Match password and confirm password
  export const matchPasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Password and confirm password do not match";
    }
    return null;
  };
  
  
  