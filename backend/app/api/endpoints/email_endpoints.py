from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from typing import List
from backend.app.models.email import Email, email_dict
from backend.app.database.session import db_instance

load_dotenv()
router = APIRouter()

email_collection = db_instance.get_collection("emails")

@router.post("/compose", response_model=Email)
async def create_email(email: Email):
    try:
        email_dict_data = email.model_dump(by_alias=True)
        result = await email_collection.insert_one(email_dict_data)
        email_dict_data["_id"] = str(result.inserted_id)
        return Email(**email_dict_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating email: {str(e)}")


@router.get("/inbox", response_model=List[Email])
async def get_emails(recipient_email: str):
    try:
        emails = email_collection.find({"recipient_email": recipient_email})
        return [email_dict(email) for email in emails]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching emails: {str(e)}")


@router.get("/inbox/{email_id}", response_model=Email)
async def get_email(email_id: str):
    try:
        email = await email_collection.find_one({"_id": ObjectId(email_id)})
        if not email:
            raise HTTPException(status_code=404, detail="Email not found")
        return email_dict(email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching email: {str(e)}")


