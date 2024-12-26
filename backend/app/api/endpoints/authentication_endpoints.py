from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import logging
from backend.app.core.challenge_auth.challenge_manager import challenge_manager
from backend.app.core.challenge_auth.encryption_manager import encryption_manager
from backend.app.core.auth import register_user, create_access_token, get_all_users, get_current_user
from fastapi.responses import JSONResponse
from backend.app.database.session import db_instance
import hashlib


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str

class ChallengeRequest(BaseModel):
    email: str

class ChallengeValidationRequest(BaseModel):
    email: str
    encrypted_challenge: str


@router.post("/register")
async def register_user_endpoint(request: RegisterRequest):
    try:
        result = register_user(request.email, request.password)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/challenge")
async def get_challenge(request: ChallengeRequest):
    """
    Step 1 of login: Client requests a challenge by providing email
    """
    logger.info(f"Challenge requested for email: {request.email}")

    users = db_instance.get_collection("users")
    user = users.find_one({"email": request.email})

    if not user:
        logger.error(f"User not found: {request.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Extract salt from stored bcrypt hash (first 29 chars)
    bcrypt_salt = user["hashed_password"][:29]
    logger.debug(f"Extracted bcrypt salt: {bcrypt_salt}")

    challenge = challenge_manager.generate_challenge(request.email)
    logger.info(f"Generated challenge for {request.email}")

    # Return both challenge and salt
    return {
        "challenge": challenge,
        "salt": bcrypt_salt
    }

@router.post("/validate-challenge")
async def validate_challenge_endpoint(request: ChallengeValidationRequest):
    """
    Step 2 of login: Client sends encrypted challenge for validation
    """
    logger.info(f"Validating challenge for email: {request.email}")

    users = db_instance.get_collection("users")
    user = users.find_one({"email": request.email})

    if not user:
        logger.error(f"User not found during challenge validation: {request.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    try:
        # Get stored bcrypt hash and derive key
        hashed_password = user["hashed_password"]
        key = hashlib.sha256(hashed_password.encode()).digest()
        logger.debug(f"Using key (hex): {key.hex()}")

        # Decrypt challenge
        decrypted_challenge = encryption_manager.decrypt(
            key,
            request.encrypted_challenge
        )
        logger.debug(f"Decrypted challenge: {decrypted_challenge}")

        # Validate challenge
        validation_result = challenge_manager.validate_challenge(
            request.email,
            decrypted_challenge
        )
        if not validation_result:
            logger.error("Challenge validation failed")
            raise HTTPException(status_code=401, detail="Invalid credentials")

    except Exception as e:
        logger.error(f"Challenge validation error: {str(e)}")
        logger.exception("Detailed error information:")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create access token
    access_token = create_access_token(data={"sub": request.email})
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=7200
    )
    return response

@router.get("/users")
async def get_all_users_endpoint():
    return get_all_users()

@router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(key="access_token")
    return response

@router.get("/validate-session")
async def validate_session(request: Request, current_user: str = Depends(get_current_user)):
    return {"isValid": True}
