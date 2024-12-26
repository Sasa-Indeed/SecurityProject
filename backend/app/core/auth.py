from datetime import datetime, timedelta, timezone
from fastapi import Request, HTTPException, status
from jose import jwt, JWTError
from .hashing import hash_password, verify_password
from ..database.session import db_instance
import os
from dotenv import load_dotenv
import hashlib
from backend.app.core.challenge_auth.challenge_manager import challenge_manager
from backend.app.core.challenge_auth.encryption_manager import encryption_manager

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def register_user(email: str, password: str):
    users = db_instance.get_collection("users")
    if users.find_one({"email": email}):
        raise ValueError("User already exists")

    hashed_pwd = hash_password(password)
    user_data = {"email": email, "hashed_password": hashed_pwd}
    result = users.insert_one(user_data)
    print(f"Inserted ID: {result.inserted_id}")
    return {"msg": "User registered successfully"}

def authenticate_user(email: str, password: str):
    users = db_instance.get_collection("users")
    user = users.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        return None
    return user

def get_all_users():
    users = db_instance.get_collection("users")
    all_users = list(users.find({}))
    for user in all_users:
        if "_id" in user:
            user["_id"] = str(user["_id"])
    return all_users

def get_current_user(request: Request):
    try:
        token = request.cookies.get("access_token")
        if token is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token not found in cookies"
            )
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

def request_login_challenge(email: str):
    """Handle login challenge request business logic"""
    users = db_instance.get_collection("users")
    user = users.find_one({"email": email})

    if not user:
        raise ValueError("User not found")

    # Extract salt from stored bcrypt hash (first 29 chars)
    bcrypt_salt = user["hashed_password"][:29]
    challenge = challenge_manager.generate_challenge(email)

    return {
        "challenge": challenge,
        "salt": bcrypt_salt
    }


def validate_login_challenge(email: str, encrypted_challenge: str):
    """Handle challenge validation business logic"""
    users = db_instance.get_collection("users")
    user = users.find_one({"email": email})

    if not user:
        raise ValueError("User not found")

    # Get stored bcrypt hash and derive key
    hashed_password = user["hashed_password"]
    key = hashlib.sha256(hashed_password.encode()).digest()

    # Decrypt and validate challenge
    decrypted_challenge = encryption_manager.decrypt(
        key,
        encrypted_challenge
    )

    if not challenge_manager.validate_challenge(email, decrypted_challenge):
        raise ValueError("Invalid challenge response")

    # Create and return access token
    return create_access_token(data={"sub": email})