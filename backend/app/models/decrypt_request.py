from pydantic import BaseModel


class DecryptRequest(BaseModel):
    ciphertext: str