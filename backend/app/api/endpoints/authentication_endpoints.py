from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import logging
from backend.app.core.auth import register_user, validate_login_challenge, get_all_users, get_current_user, request_login_challenge
from fastapi.responses import JSONResponse


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
    """Step 1 of login: Client requests a challenge by providing email"""
    try:
        result = request_login_challenge(request.email)
        return result
    except ValueError as _:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        logger.error(f"Challenge request error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/validate-challenge")
async def validate_challenge_endpoint(request: ChallengeValidationRequest):
    """Step 2 of login: Client sends encrypted challenge for validation"""
    try:
        access_token = validate_login_challenge(
            request.email,
            request.encrypted_challenge
        )

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

    except ValueError as _:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        logger.error(f"Challenge validation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

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
