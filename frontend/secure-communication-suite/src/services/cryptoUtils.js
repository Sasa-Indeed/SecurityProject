// cryptoUtils.js
import { Buffer } from 'buffer';
import { createCipheriv, createHash } from 'crypto-browserify';

const API_BASE_URL = 'http://localhost:8000/auth';

export class CryptoManager {
  constructor() {
    this.algorithm = 'aes-256-cbc';
  }

  // Use stored hash to derive encryption key
  deriveKey(storedHash) {
    try {
      // Use SHA-256 on the stored hash
      const hash = createHash('sha256');
      hash.update(storedHash);
      const key = hash.digest();

      console.log('Stored hash used for key derivation:', storedHash);
      console.log('Derived key length:', key.length);
      console.log('Derived key (hex):', key.toString('hex'));

      return key;
    } catch (error) {
      console.error('Key derivation error:', error);
      throw error;
    }
  }

  // Encrypt challenge using derived key
  encryptChallenge(key, challenge) {
    try {
      console.log('Input challenge:', challenge);
      console.log('Key length:', key.length);

      // Generate IV (16 bytes for AES)
      const iv = Buffer.alloc(16);
      crypto.getRandomValues(iv);
      console.log('Generated IV:', iv.toString('hex'));

      // Create cipher
      const cipher = createCipheriv(this.algorithm, key, iv);

      // Convert base64 challenge to Buffer
      const challengeBuffer = Buffer.from(challenge, 'base64');
      console.log('Challenge buffer length:', challengeBuffer.length);

      // Encrypt without padding since challenge is fixed size
      const ciphertext = Buffer.concat([
        cipher.update(challengeBuffer),
        cipher.final()
      ]);
      console.log('Ciphertext length:', ciphertext.length);

      // Combine IV and ciphertext
      const combined = Buffer.concat([iv, ciphertext]);
      const result = combined.toString('base64');
      console.log('Final encrypted result length:', result.length);

      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  // Login function that implements the challenge-response protocol
  async login(email, password) {
    try {
      console.log('Starting login process for:', email);

      // Step 1: Request challenge
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

      const { challenge, stored_hash } = await challengeResponse.json();
      console.log('Received challenge and stored hash');

      // Step 2: Derive key from stored hash
      const key = this.deriveKey(stored_hash);
      console.log('Key derived successfully');

      // Step 3: Encrypt challenge
      const encryptedChallenge = this.encryptChallenge(key, challenge);
      console.log('Challenge encrypted successfully');

      // Step 4: Send encrypted challenge
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