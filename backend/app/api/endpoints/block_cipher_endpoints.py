from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, conbytes
from backend.app.core.block_cipher_module import AESCipher
import backend.app.core.key_management as keyManagement
from dotenv import load_dotenv
load_dotenv()


router = APIRouter()

class AESEncryptRequest(BaseModel):
    plaintext: str
    key: str  

class AESDecryptRequest(BaseModel):
    encrypted_text: str
    key: str  


class CipherManager:
    """
    Manages AES Cipher initialization and provides a way to dynamically create ciphers
    """
    _current_cipher = None

    @classmethod
    def initialize_cipher(cls, key: bytes):
        """
        Initialize the cipher with a given key
        
        :param key: 32-byte encryption key
        """
        cls._current_cipher = AESCipher(key)
        return cls._current_cipher

    @classmethod
    def get_cipher(cls):
        """
        Get the current cipher instance
        
        :raises HTTPException: If cipher has not been initialized
        """
        if cls._current_cipher is None:
            raise HTTPException(
                status_code=400, 
                detail="Cipher not initialized. Please provide a key first."
            )
        return cls._current_cipher
    

@router.post("/encrypt")
async def encrypt_endpoint(request: AESEncryptRequest):
    """
    Encrypt the given plaintext using a provided key
    
    - Takes a plaintext string and a 32-byte key
    - Returns base64 encoded encrypted text
    """
    try:
        decrypted_key =  keyManagement.decrypt_aes_key(request.key, keyManagement.KEK)
        # Initialize cipher with the provided key
        cipher = CipherManager.initialize_cipher(decrypted_key)
        # Encrypt the plaintext
        encrypted_text = cipher.encrypt(request.plaintext)
        return {"AES_encrypted_text": encrypted_text}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/decrypt")
async def decrypt_endpoint(request: AESDecryptRequest):
    """
    Decrypt the given encrypted text using a provided key
    
    - Takes a base64 encoded encrypted text and a 32-byte key
    - Returns the original plaintext
    """
    try:
        # Decrypt the key     
        decrypted_key =  keyManagement.decrypt_aes_key(request.key, keyManagement.KEK)

        # Initialize cipher with the provided key
        cipher = CipherManager.initialize_cipher(decrypted_key)
        
        # Decrypt the text
        decrypted_text = cipher.decrypt(request.encrypted_text)
        return {"AES_decrypted_text": decrypted_text}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Decryption failed. Invalid encrypted text.")