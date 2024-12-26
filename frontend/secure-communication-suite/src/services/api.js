import axios from "axios";
import { cryptoManager } from './cryptoUtils';
import { createHash } from 'crypto-browserify';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Login function that implements the challenge-response protocol
export const login = async(email, password) =>{
    try {
      
      const challengeResponse = await axiosInstance.post('/auth/challenge', { email: email });

      if (!challengeResponse.status === 200) {
        console.error('Failed to get challenge:', challengeResponse);
        const errorData = await challengeResponse.data;
        throw new Error(errorData.detail || 'Failed to get challenge');
      }

      const challenge = await challengeResponse.data.challenge;
      const salt = await challengeResponse.data.salt;
    
      // Step 2: Hash password using server's salt
      const hashedPassword = await cryptoManager.hashPasswordWithSalt(password, salt);

      // Step 3: Derive key from bcrypt hash (same as server)
      const key = createHash('sha256').update(hashedPassword).digest();

      // Step 4: Encrypt challenge
      const encryptedChallenge = cryptoManager.encryptChallenge(key, challenge);

      const validationResponse = await axiosInstance.post('/auth/validate-challenge', { email: email, encrypted_challenge: encryptedChallenge});

      if (!validationResponse.status === 200) {
        const errorData = await validationResponse.data;
        console.error('Validation failed:', errorData);
        throw new Error(errorData.detail || 'Login failed');
      }

      return await validationResponse.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

export const signup = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/register', { email : email, password : password });
    await login(email, password);
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
    const response = await axiosInstance.get(`email/inbox/view-email`, {
      params: { email_id: emailId },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Error viewing email");
  }
};


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



