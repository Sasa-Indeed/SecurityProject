from fastapi import APIRouter
from backend.app.tests.rsa_encryption_test import rsa_service

router = APIRouter()

@router.post("/encrypt-with-rsa/")
async def encrypt_message(message: str):
    encrypted_message = rsa_service.encrypt_message(message)
    return {"encrypted_message": encrypted_message}
