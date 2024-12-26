// cryptoUtils.js
import { Buffer } from 'buffer';
import { createCipheriv, createHash } from 'crypto-browserify';
import bcrypt from 'bcryptjs';

const API_BASE_URL = 'http://localhost:8000/auth';

export class CryptoManager {
  constructor() {
    this.algorithm = 'aes-256-cbc';
  }

  async hashPasswordWithSalt(password, salt) {
    try {
      return bcrypt.hashSync(password, salt);
    } catch (error) {
      console.error('Password hashing error:', error);
      throw error;
    }
  }

  // Encrypt challenge using derived key
  encryptChallenge(key, challenge) {
    try {
      // Generate IV (16 bytes for AES)
      const iv = Buffer.alloc(16);
      crypto.getRandomValues(iv);

      // Create cipher
      const cipher = createCipheriv(this.algorithm, key, iv);

      // Convert base64 challenge to Buffer
      const challengeBuffer = Buffer.from(challenge, 'base64');

      // Encrypt without padding since challenge is fixed size
      const ciphertext = Buffer.concat([
        cipher.update(challengeBuffer),
        cipher.final()
      ]);

      // Combine IV and ciphertext
      const combined = Buffer.concat([iv, ciphertext]);
      return combined.toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  // Login function that implements the challenge-response protocol
  async login(email, password) {
    try {
      console.log('Starting login process for:', email);

      // Step 1: Request challenge and salt
      const challengeResponse = await fetch(`${API_BASE_URL}/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      if (!challengeResponse.ok) {
        const errorData = await challengeResponse.json();
        throw new Error(errorData.detail || 'Failed to get challenge');
      }

      const { challenge, salt } = await challengeResponse.json();
      console.log('Received challenge and salt');

      // Step 2: Hash password using server's salt
      const hashedPassword = await this.hashPasswordWithSalt(password, salt);
      console.log('Password hashed with server salt');

      // Step 3: Derive key from bcrypt hash (same as server)
      const key = createHash('sha256').update(hashedPassword).digest();
      console.log('Key derived from bcrypt hash');

      // Step 4: Encrypt challenge
      const encryptedChallenge = this.encryptChallenge(key, challenge);
      console.log('Challenge encrypted successfully');

      // Step 5: Send encrypted challenge
      const validationResponse = await fetch(`${API_BASE_URL}/validate-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          encrypted_challenge: encryptedChallenge
        }),
        credentials: 'include'
      });

      if (!validationResponse.ok) {
        const errorData = await validationResponse.json();
        console.error('Validation failed:', errorData);
        throw new Error(errorData.detail || 'Login failed');
      }

      return await validationResponse.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}

export const cryptoManager = new CryptoManager();