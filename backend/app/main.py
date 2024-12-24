from fastapi import FastAPI
from .api.endpoints import authentication
from .api.endpoints.rsa_endpoints import router as rsa_router
from .api.endpoints.block_cipher_endpoints import router as aes_router
from .api.endpoints.email_endpoints import router as email_router
from .api.endpoints.key_management import router as key_router
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(authentication.router, prefix="/auth", tags=["Authentication"])
app.include_router(rsa_router, prefix="/rsa", tags=["RSA Operations"])
app.include_router(aes_router, prefix="/aes", tags=["AES Operations"])
app.include_router(email_router, prefix="/email", tags=["Email Operations"])
app.include_router(key_router, prefix="/keys", tags=["Key Management"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
