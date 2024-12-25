import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email : email, password : password });
    console.log("Response headers:", response.headers);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const signup = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/register', { email : email, password : password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const getInboxEmails = async () => {
  try {
    const response = await axiosInstance.get("/email/inbox");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching inbox emails");
  }
};

export const getSentEmails = async () => {
  try {
    const response = await axiosInstance.get("/email/sent");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching sent emails");
  }
};

export const viewEmail = async (emailId) => {
  try {
    const response = await axiosInstance.get("/email/inbox/view-email",{email_id: emailId});
    return response.data;
  } catch(error) {
    throw new Error(error.response?.data?.message || "Error viewing email");
  }
}

export const getKeys = async () => {
  try {
    const response = await axiosInstance.get("/keys/fetchkeys");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching keys");
  }
};

export const deleteKey = async (keyId) => {
  try {
    await axiosInstance.delete('/keys/deletekey', { id : keyId });
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error deleting key");
  }
};

export const generateKey = async (keyType) => {
  try {
    const response = await axiosInstance.post('/keys/gen', { key_type: keyType });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error generating key");
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Logout failed");
  }
};

export const validateSession = async () => {
  try {
    const response = await axiosInstance.get('/auth/validate-session');
    return response.data.isValid;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
};

export const composeEmail = async (   
    recipient_email,
    sender_email,
    subject,
    body,
    hash,
    encrypted_aes_key
  ) => {
  try {
    const email_id = Math.floor(Math.random() * 1_000_000); 
    const timestamp = new Date().toISOString();

    const response = await axiosInstance.post('/email/compose', { 
      email_id: email_id,
      recipient_email : recipient_email,
      sender_email : sender_email,
      subject : subject,
      body : body,
      hash : hash,
      encrypted_aes_key : encrypted_aes_key, 
      timestamp : timestamp });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Creating email failed");
  }
};

// Hash text
export const generateHash = async (text) => {
  try {
    const response = await axiosInstance.post('/hash/hash-text', { text });
    return response.data.hash_value;
  } catch (error) {
    console.error("Error generating hash:", error);
    throw error;
  }
};

// Verify hash
export const verifyEmailBody = async (text, hashValue) => {
  try {
    const response = await axiosInstance.post('/hash/verify-hash', { text, hash_value: hashValue });
    return response.data.is_valid;
  } catch (error) {
    console.error("Error verifying hash:", error);
    throw error;
  }
};

// AES encryption
export const encryptUsingAES = async (plaintext, key) => {
  try {
    const response = await axiosInstance.post('/aes/encrypt', { plaintext : plaintext, key : key});
    return response.data.AES_encrypted_text;
  } catch (error) {
    console.error("Error encrypting with AES:", error);
    throw error;
  }
};

// AES decryption
export const decryptUsingAES = async (encryptedText, key) => {
  try {
    const response = await axiosInstance.post('/aes/decrypt', { encrypted_text: encryptedText, key : key});
    return response.data.AES_decrypted_text;
  } catch (error) {
    console.error("Error decrypting with AES:", error);
    throw error;
  }
};

// RSA encryption
export const encryptUsingRSA = async (plaintext, publicKey) => {
  try {
    const response = await axiosInstance.post('/rsa/encrypt', { plaintext : plaintext, key: publicKey });
    return response.data.ciphertext;
  } catch (error) {
    console.error("Error encrypting with RSA:", error);
    throw error;
  }
};

// RSA decryption
export const decryptUsingRSA = async (encryptedText, privateKey) => {
  try {
    const response = await axiosInstance.post('/rsa/decrypt', { ciphertext: encryptedText, key: privateKey });
    return response.data.plaintext;
  } catch (error) {
    console.error("Error decrypting with RSA:", error);
    throw error;
  }
};

export const fetchPK = async (email) => {
  try {
    const response = await axiosInstance.get('/keys/fetch-public-key', {
      params: { email: email },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching PK:", error);
    throw error;
  }
};



