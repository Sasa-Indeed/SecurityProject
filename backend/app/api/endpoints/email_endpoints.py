from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from backend.app.models.email import Email
from backend.app.database.session import db_instance

load_dotenv()
router = APIRouter()

email_collection = db_instance.get_collection("emails")

@router.post("/compose")
async def create_email(email: Email):
    try:
        email_dict_data = email.to_dict()
        result = email_collection.insert_one(email_dict_data)
        return {"email_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating email: {str(e)}")

@router.get("/inbox", response_model=list[Email])
async def get_emails(recipient_email: str):
    try:
        emails_cursor = email_collection.find({"recipient_email": recipient_email})
        emails = [Email(**email) for email in emails_cursor.to_list(length=None)]
        return emails
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching emails: {str(e)}")

@router.get("/inbox/email", response_model=Email)
async def get_email(email_id: int):
    try:
        email = email_collection.find_one({"email_id": email_id})
        if not email:
            raise HTTPException(status_code=404, detail="Email not found")
        email.pop("_id", None)
        return Email(**email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching email: {str(e)}")
