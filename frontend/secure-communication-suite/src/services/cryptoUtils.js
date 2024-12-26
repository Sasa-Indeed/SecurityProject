import { Buffer } from 'buffer';
import { createCipheriv} from 'crypto-browserify';
import bcrypt from 'bcryptjs';

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
}

export const cryptoManager = new CryptoManager();