from fastapi import APIRouter, HTTPException
from backend.app.models.encrypt_request import EncryptRequest
from backend.app.models.decrypt_request import DecryptRequest
from backend.app.core.rsa_service import RSACipher

router = APIRouter()

@router.post("/encrypt")
async def encrypt(data: EncryptRequest):
    """
    Encrypt plaintext using the provided public key.
    """
    try:
        rsa_service = RSACipher(encrypted_private_key=None, public_key=data.key)
        ciphertext = rsa_service.encrypt(data.plaintext)
        return {"ciphertext": ciphertext}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Encryption failed: {str(e)}")

@router.post("/decrypt")
async def decrypt(data: DecryptRequest):
    """
    Decrypt ciphertext using the provided AES-encrypted private key.
    """
    try:
        rsa_service = RSACipher(encrypted_private_key=data.key, public_key=None)
        plaintext = rsa_service.decrypt(data.ciphertext)
        return {"plaintext": plaintext}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decryption failed: {str(e)}")
