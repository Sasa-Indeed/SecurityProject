from datetime import datetime, timedelta, timezone
from fastapi import Request, HTTPException, status
from jose import jwt, JWTError
from .hashing import hash_password, verify_password, decrypt_with_password
from ..database.session import db_instance
import os
from dotenv import load_dotenv
import secrets

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
challenges = {}

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


def generate_challenge_logic(email: str) -> str:
    challenge = secrets.token_hex(16)
    challenges[email] = challenge
    return challenge

def validate_challenge_logic(email: str, encrypted_challenge: str) -> str:
    if email not in challenges:
        raise HTTPException(status_code=400, detail="Challenge not found or expired")

    original_challenge = challenges.pop(email)

    user = db_instance.get_collection("users").find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Decrypt the encrypted challenge using the user's hashed password
    hashed_password = user["hashed_password"]
    decrypted_challenge = decrypt_with_password(encrypted_challenge, hashed_password)

    # Compare decrypted challenge with the original
    if decrypted_challenge != original_challenge:
        raise HTTPException(status_code=401, detail="Invalid challenge response")

    # Authentication successful, create and return an access token
    return create_access_token(data={"sub": email})