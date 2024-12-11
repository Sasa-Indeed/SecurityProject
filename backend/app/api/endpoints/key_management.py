from fastapi import APIRouter, HTTPException
from ...core.key_management import generate_rsa_key, generate_aes_key, fetch_keys, delete_key

router = APIRouter()


@router.post("/genkeys")
def generate_key(key_type: str, user_email: str):
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
def get_keys(user_email: str):
    try:
        return fetch_keys(user_email)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/deletekey")
def remove_key(key_id: str):
    try:
        return delete_key(key_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
