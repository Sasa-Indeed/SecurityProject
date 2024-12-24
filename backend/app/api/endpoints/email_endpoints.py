from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends
from backend.app.core.auth import get_current_user
from backend.app.core.email_service import EmailService
from backend.app.models.email import Email
from backend.app.database.session import db_instance
from backend.app.models.get_email_request import GetEmailRequest

load_dotenv()

router = APIRouter()
email_service = EmailService(db_instance)

@router.post("/compose")
def create_email(email: Email):
    success = email_service.create_email(email)
    if success:
        return {"message": "Email created successfully."}
    else:
        raise HTTPException(status_code=500, detail="Failed to create email.")

@router.get("/inbox", response_model=list[Email])
async def get_emails(current_user: str = Depends(get_current_user)):
    try:
        emails = email_service.get_emails(current_user)
        return emails
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sent", response_model=list[Email])
async def get_sent_emails(current_user: str = Depends(get_current_user)):
    try:
        emails = email_service.get_sent_emails(current_user)
        return emails
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/inbox/view-email", response_model=Email)
async def get_email(body : GetEmailRequest, current_user: str = Depends(get_current_user)):
    try:
        email = email_service.get_email_by_id(body.email_id, current_user)
        return email
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
