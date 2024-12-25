from pydantic import BaseModel


class EncryptRequest(BaseModel):
    plaintext: str
    key: str