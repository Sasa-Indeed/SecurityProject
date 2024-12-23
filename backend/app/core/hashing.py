from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
