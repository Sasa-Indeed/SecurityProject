from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from backend.app.core.hashing import hash_password, verify_password, hash_text, verify_hash

router = APIRouter()

class HashPasswordRequest(BaseModel):
    password: str

class HashPasswordResponse(BaseModel):
    hashed_password: str

class VerifyPasswordRequest(BaseModel):
    plain_password: str
    hashed_password: str

class VerifyPasswordResponse(BaseModel):
    is_valid: bool

class HashTextRequest(BaseModel):
    text: str

class HashTextResponse(BaseModel):
    hash_value: str

class VerifyHashRequest(BaseModel):
    text: str
    hash_value: str

class VerifyHashResponse(BaseModel):
    is_valid: bool

# Endpoints
@router.post("/hash-password", response_model=HashPasswordResponse, status_code=status.HTTP_200_OK)
def hash_password_endpoint(request: HashPasswordRequest):
    try:
        hashed_password = hash_password(request.password)
        return HashPasswordResponse(hashed_password=hashed_password)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/verify-password", response_model=VerifyPasswordResponse, status_code=status.HTTP_200_OK)
def verify_password_endpoint(request: VerifyPasswordRequest):
    try:
        is_valid = verify_password(request.plain_password, request.hashed_password)
        return VerifyPasswordResponse(is_valid=is_valid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/hash-text", response_model=HashTextResponse, status_code=status.HTTP_200_OK)
def hash_text_endpoint(request: HashTextRequest):
    try:
        hash_value = hash_text(request.text)
        return HashTextResponse(hash_value=hash_value)
    except TypeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/verify-hash", response_model=VerifyHashResponse, status_code=status.HTTP_200_OK)
def verify_hash_endpoint(request: VerifyHashRequest):
    try:
        is_valid = verify_hash(request.text, request.hash_value)
        return VerifyHashResponse(is_valid=is_valid)
    except TypeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
