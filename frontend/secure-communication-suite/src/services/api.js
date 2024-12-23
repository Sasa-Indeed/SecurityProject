import axios from "axios";

const apiUrl = "http://http://127.0.0.1:8000";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Login failed");
  }
};

export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/signup`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Signup failed");
  }
};
