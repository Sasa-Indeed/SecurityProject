from pydantic import BaseModel


class GetEmailRequest(BaseModel):
    email_id: int