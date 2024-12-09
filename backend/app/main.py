from fastapi import FastAPI
from .api.endpoints import authentication
from .api.endpoints.rsa_endpoints import router as rsa_router

app = FastAPI()

app.include_router(authentication.router, prefix="/auth", tags=["Authentication"])
app.include_router(rsa_router, prefix="/rsa", tags=["RSA Operations"])

