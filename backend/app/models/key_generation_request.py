from pydantic import BaseModel


class KeyGenerationRequest(BaseModel):
    key_type: str