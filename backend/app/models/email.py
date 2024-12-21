from pydantic import BaseModel, Field, EmailStr
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId

class Email(BaseModel):

    id: int
    sender_email: EmailStr
    recipient_email: EmailStr
    subject: str = Field(max_length=255)
    body: str
    hash: str = Field(max_length=64)
    encrypted_aes_key: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

def email_dict(email):
    email["_id"] = str(email["_id"])
    return email

