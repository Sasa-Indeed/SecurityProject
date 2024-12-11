from pydantic import BaseModel, EmailStr

class Key(BaseModel):
    id: str
    user_email : EmailStr
    key_type : str # Either 'RSA' or 'AES'
    key_data : dict # For RSA: {public_key, private_key}, For AES: {key_value}
