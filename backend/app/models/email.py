from pydantic import BaseModel
from datetime import datetime

class Email(BaseModel):
    email_id: int
    sender_email: str
    recipient_email: str
    subject: str
    body: str
    hash: str
    encrypted_aes_key: str
    timestamp: datetime


    def to_dict(self):
        return self.model_dump(exclude_unset=True)

    class Config:
        from_attributes = True

