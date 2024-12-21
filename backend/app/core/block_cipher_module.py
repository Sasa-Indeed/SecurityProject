import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import base64

class AESCipher:
    """
    A utility class for AES encryption and decryption using CBC mode.
    
    This implementation uses:
    - AES-256 encryption
    - Cipher Block Chaining (CBC) mode
    - PKCS7 padding
    - Random IV generation for each encryption
    """

    """
        Initialize the AES cipher with a given key.
        
        :param key: A 32-byte (256-bit) encryption key
    """
    def __init__(self, key):
        if len(key) != 32:
            raise ValueError("Key must be 32 bytes long for AES-256")
        self.key = key
        
        
    """
    Encrypt the given plaintext.
    
    :param plaintext: String or bytes to encrypt
    :return: Base64 encoded string containing IV and encrypted text
    """
    def encrypt(self, plaintext):
        # Ensure plaintext is bytes
        if isinstance(plaintext, str):
            plaintext = plaintext.encode('utf-8')
        
        # Generate a random 16-byte IV (Initialization Vector)
        iv = os.urandom(16)
        
        # Create padder to ensure the input data has a fixed-size block (16 bytes)
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(plaintext) + padder.finalize()
        
        # Create cipher
        cipher = Cipher(
            algorithms.AES(self.key), 
            modes.CBC(iv), 
            backend=default_backend()
        )
        encryptor = cipher.encryptor()
        
        # Encrypt
        ciphertext = encryptor.update(padded_data) + encryptor.finalize()
        
        # Combine IV and ciphertext and base64 encode
        return base64.b64encode(iv + ciphertext).decode('utf-8')
    
    """
        Decrypt the given encrypted text.
        
        :param encrypted_text: Base64 encoded string containing IV and ciphertext
        :return: Decrypted plaintext as string
    """
    def decrypt(self, encrypted_text):
        
        # Decode base64
        encrypted_data = base64.b64decode(encrypted_text)
        
        # Extract IV (first 16 bytes)
        iv = encrypted_data[:16]
        ciphertext = encrypted_data[16:]
        
        # Create cipher
        cipher = Cipher(
            algorithms.AES(self.key), 
            modes.CBC(iv), 
            backend=default_backend()
        )
        decryptor = cipher.decryptor()
        
        # Decrypt
        padded_data = decryptor.update(ciphertext) + decryptor.finalize()
        
        # Remove padding
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        plaintext = unpadder.update(padded_data) + unpadder.finalize()
        
        return plaintext.decode('utf-8')