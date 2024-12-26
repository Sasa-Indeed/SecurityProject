import logging
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64
import os

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class EncryptionManager:
    def __init__(self):
        self.backend = default_backend()
        self._key_length = 32  # 256 bits for AES-256

    def _remove_pkcs7_padding(self, padded_data: bytes) -> bytes:
        """Remove PKCS7 padding from decrypted data"""
        padding_length = padded_data[-1]
        return padded_data[:-padding_length]

    def decrypt(self, key: bytes, ciphertext_b64: str) -> str:
        """
        Decrypts base64 encoded IV + ciphertext using AES-256-CBC.
        Returns decrypted plaintext.
        """
        try:
            logger.debug(f"Using key (hex): {key.hex()}")

            # Decode from base64
            logger.debug(f"Attempting to decode base64 string of length: {len(ciphertext_b64)}")
            ciphertext_full = base64.b64decode(ciphertext_b64.encode())
            logger.debug(f"Decoded bytes length: {len(ciphertext_full)}")

            # Split IV and ciphertext
            iv = ciphertext_full[:16]
            ciphertext = ciphertext_full[16:]
            logger.debug(f"IV: {iv.hex()}")
            logger.debug(f"Ciphertext length: {len(ciphertext)}")

            # Create cipher
            cipher = Cipher(
                algorithms.AES(key),
                modes.CBC(iv),
                backend=self.backend
            )
            decryptor = cipher.decryptor()
            logger.debug("Cipher created for decryption")

            # Decrypt
            padded_data = decryptor.update(ciphertext) + decryptor.finalize()
            logger.debug(f"Decrypted padded data length: {len(padded_data)}")

            # Remove padding
            unpadded_data = self._remove_pkcs7_padding(padded_data)
            logger.debug(f"Unpadded data length: {len(unpadded_data)}")

            # Convert to base64
            result = base64.b64encode(unpadded_data).decode('utf-8')
            logger.debug(f"Final decrypted result (base64): {result}")

            return result

        except Exception as e:
            logger.error(f"Decryption failed: {str(e)}")
            logger.exception("Detailed decryption error:")
            raise

    def encrypt(self, key: bytes, plaintext: str) -> str:
        """
        Encrypts plaintext using AES-256-CBC.
        Returns base64 encoded string of IV + ciphertext.
        """
        try:
            logger.debug(f"Using key (hex): {key.hex()}")

            # Generate IV
            iv = os.urandom(16)
            logger.debug(f"Generated IV: {iv.hex()}")

            # Create cipher
            cipher = Cipher(
                algorithms.AES(key),
                modes.CBC(iv),
                backend=self.backend
            )
            encryptor = cipher.encryptor()
            logger.debug("Cipher created")

            # Convert plaintext to bytes
            plaintext_bytes = base64.b64decode(plaintext) if isinstance(plaintext, str) else plaintext
            logger.debug(f"Plaintext length: {len(plaintext_bytes)}")

            # Add PKCS7 padding
            block_size = 16
            padding_length = block_size - (len(plaintext_bytes) % block_size)
            padded_data = plaintext_bytes + bytes([padding_length] * padding_length)

            # Encrypt
            ciphertext = encryptor.update(padded_data) + encryptor.finalize()
            logger.debug(f"Ciphertext length: {len(ciphertext)}")

            # Combine IV and ciphertext and encode
            combined = iv + ciphertext
            result = base64.b64encode(combined).decode('utf-8')
            logger.debug(f"Final encrypted length: {len(result)}")

            return result

        except Exception as e:
            logger.error(f"Encryption failed: {str(e)}")
            logger.exception("Detailed encryption error:")
            raise


# Global instance
encryption_manager = EncryptionManager()