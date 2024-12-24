from pydantic import BaseModel


class KeyDeleteRequest(BaseModel):
    key_id: str