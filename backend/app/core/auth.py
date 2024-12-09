from datetime import datetime, timedelta
from jose import jwt
from .hashing import hash_password, verify_password
from ..database.session import db_instance
import os

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
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
