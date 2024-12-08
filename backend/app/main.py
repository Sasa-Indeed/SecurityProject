from fastapi import FastAPI
from .api.endpoints import authentication

app = FastAPI()

app.include_router(authentication.router, prefix="/auth", tags=["Authentication"])
