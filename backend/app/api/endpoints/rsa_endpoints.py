from fastapi import APIRouter, HTTPException
from backend.app.models.encrypt_request import EncryptRequest
from backend.app.models.decrypt_request import DecryptRequest
from backend.app.core.rsa_service import RSACipher

rsa_service = RSACipher(
    private_key_path="backend/app/core/private_key.pem",
    public_key_path="backend/app/core/public_key.pem"
)

router = APIRouter()

@router.post("/encrypt")
async def encrypt(data: EncryptRequest):
    try:
        ciphertext = rsa_service.encrypt(data.plaintext)
        return {"ciphertext": ciphertext}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decrypt")
async def decrypt(data: DecryptRequest):
    try:
        plaintext = rsa_service.decrypt(data.ciphertext)
        return {"plaintext": plaintext}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
