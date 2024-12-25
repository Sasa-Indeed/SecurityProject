from pydantic import BaseModel


class PKRequestBody(BaseModel):
    email: str