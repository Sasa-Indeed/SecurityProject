from pymongo.collection import Collection
from pymongo.errors import PyMongoError
from ..models.email import Email


class EmailService:
    def __init__(self, db_instance):
        self.db_instance = db_instance

    def _get_collection(self) -> Collection:
        """Retrieve the 'emails' collection."""
        return self.db_instance.get_collection("emails")

    def create_email(self, email: Email) -> bool:
        """Insert a new email document into the database."""
        try:
            email_data = email.to_dict()
            collection = self._get_collection()
            collection.insert_one(email_data)
            return True
        except PyMongoError as e:
            return False

    def get_emails(self, recipient_email: str) -> list[Email]:
        """Retrieve all emails for a specific recipient."""
        try:
            collection = self._get_collection()
            emails_cursor = collection.find({"recipient_email": recipient_email})
            emails_data = list(emails_cursor)
            return [Email(**email) for email in emails_data]
        except PyMongoError as e:
            raise RuntimeError(f"Database error while fetching emails: {str(e)}")

    def get_sent_emails(self, sender_email: str) -> list[Email]:
        """Retrieve all emails for a specific sender."""
        try:
            collection = self._get_collection()
            emails_cursor = collection.find({"sender_email": sender_email})
            emails_data = list(emails_cursor)
            return [Email(**email) for email in emails_data]
        except PyMongoError as e:
            raise RuntimeError(f"Database error while fetching emails: {str(e)}")

    def get_email_by_id(self, email_id: int, user_email: str) -> Email:
        """Retrieve a specific email by ID if the user is authorized."""
        try:
            collection = self._get_collection()
            email_data = collection.find_one(
                {
                    "email_id": email_id,
                    "$or": [
                        {"sender_email": user_email},
                        {"recipient_email": user_email},
                    ],
                }
            )
            if not email_data:
                raise ValueError("Email not found or access denied")
            email_data.pop("_id", None)
            return Email(**email_data)
        except PyMongoError as e:
            raise RuntimeError(f"Database error while fetching email: {str(e)}")
