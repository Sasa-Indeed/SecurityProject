from passlib.context import CryptContext
import hashlib
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.padding import PKCS7
from cryptography.hazmat.backends import default_backend
import base64
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
BACKEND = default_backend()
SALT_LENGTH = 16  # 16 bytes
KEY_LENGTH = 32   # 256-bit key
ITERATIONS = 100000  # Number of iterations for PBKDF2

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

"""
    Hash a given plaintext using SHA-256 algorithm.
    
    Args:
        plaintext (str): The text to be hashed
        
    Returns:
        str: The hexadecimal representation of the hash
        
    Raises:
        TypeError: If input is not a string
"""
def hash_text(plaintext):
    if not isinstance(plaintext, str):
        raise TypeError("Input must be a string")
    
    text_bytes = plaintext.encode('utf-8')
    hash_object = hashlib.sha256(text_bytes)
    return hash_object.hexdigest()


"""
    Verify if a plaintext matches a given SHA-256 hash.
    
    Args:
        plaintext (str): The text to verify
        hash_value (str): The expected SHA-256 hash
        
    Returns:
        bool: True if the hash matches, False otherwise
        
    Raises:
        TypeError: If inputs are not strings
"""
def verify_hash(plaintext, hash_value):
    if not all(isinstance(x, str) for x in [plaintext, hash_value]):
        raise TypeError("Both inputs must be strings")
    
    computed_hash = hash_text(plaintext)
    return computed_hash == hash_value

def derive_key(hashed_password: str, salt: bytes) -> bytes:
    """
    Derive a symmetric encryption key from the hashed password using PBKDF2.
    """
    kdf = PBKDF2HMAC(
        algorithm=SHA256(),
        length=KEY_LENGTH,
        salt=salt,
        iterations=ITERATIONS,
        backend=BACKEND
    )
    # The key derivation works on bytes, so we encode the hashed password
    return kdf.derive(hashed_password.encode('utf-8'))

def decrypt_with_password(encrypted_text: str, hashed_password: str) -> str:
    """
    Decrypt a given encrypted text using the hashed password.

    Args:
        encrypted_text (str): Base64-encoded ciphertext.
        hashed_password (str): The user's hashed password.

    Returns:
        str: The decrypted plaintext.

    Raises:
        ValueError: If decryption fails or the input is invalid.
    """
    try:
        # Decode the base64-encoded encrypted text
        encrypted_data = base64.b64decode(encrypted_text)

        # Extract the salt and the actual ciphertext
        salt = encrypted_data[:SALT_LENGTH]
        ciphertext = encrypted_data[SALT_LENGTH:]

        # Derive the decryption key from the hashed password
        key = derive_key(hashed_password, salt)

        # Decrypt the ciphertext using AES
        cipher = Cipher(algorithms.AES(key), modes.CBC(salt), backend=BACKEND)
        decryptor = cipher.decryptor()
        padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()

        # Remove padding
        unpadder = PKCS7(algorithms.AES.block_size).unpadder()
        plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()

        return plaintext.decode('utf-8')

    except Exception as e:
        raise ValueError("Decryption failed") from e