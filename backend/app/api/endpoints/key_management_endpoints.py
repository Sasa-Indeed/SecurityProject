from fastapi import APIRouter, HTTPException, Depends
from backend.app.core.key_management import generate_rsa_key, generate_aes_key, fetch_keys, delete_key
from backend.app.core.auth import get_current_user

router = APIRouter()
@router.post("/gen")
def generate_key(key_type: str, user_email: str = Depends(get_current_user)):
    try:
        if key_type == "RSA":
            return generate_rsa_key(user_email)
        elif key_type == "AES":
            return generate_aes_key(user_email)
        else:
            raise ValueError("Invalid key type")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/fetchkeys")
def get_keys(user_email: str = Depends(get_current_user)):
    try:
        return fetch_keys(user_email)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/deletekey")
def remove_key(key_id: str, user_email: str = Depends(get_current_user)):
    try:
        return delete_key(key_id, user_email)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
