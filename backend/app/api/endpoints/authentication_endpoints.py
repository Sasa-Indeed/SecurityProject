from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from backend.app.core.auth import register_user, authenticate_user, create_access_token, get_all_users, get_current_user, generate_challenge_logic, validate_challenge_logic
from fastapi.responses import JSONResponse

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
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

@router.post("/login")
async def login_user_endpoint(request: LoginRequest):
    user = authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user["email"]})
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

@router.post("/challenge")
async def generate_challenge(request: ChallengeRequest):
    challenge = generate_challenge_logic(request.email)
    return {"challenge": challenge}

@router.post("/validate-challenge")
async def validate_challenge(request: ChallengeValidationRequest):
    access_token = validate_challenge_logic(request.email, request.encrypted_challenge)
    return {"access_token": access_token}