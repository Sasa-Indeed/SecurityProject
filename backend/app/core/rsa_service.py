from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from fastapi import HTTPException

class RSACipher:
    def __init__(self, private_key_path: str, public_key_path: str):
        """
        Initialize the RSAEncryptionService with the provided private and public key paths.
        """
        self.private_key, self.public_key = self.load_keys(private_key_path, public_key_path)

    def load_keys(self, private_key_path: str, public_key_path: str):
        """
        Load the RSA private and public keys from the specified file paths.
        """
        try:
            with open(private_key_path, "rb") as private_file:
                private_key = serialization.load_pem_private_key(private_file.read(), password=None)
            with open(public_key_path, "rb") as public_file:
                public_key = serialization.load_pem_public_key(public_file.read())
            return private_key, public_key
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading keys: {str(e)}")

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypt the given plaintext using the public key and return the ciphertext in hex format.
        """
        try:
            ciphertext = self.public_key.encrypt(
                plaintext.encode("utf-8"),
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None,
                ),
            )
            return ciphertext.hex()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Encryption failed: {str(e)}")

    def decrypt(self, ciphertext_hex: str) -> str:
        """
        Decrypt the given ciphertext (in hex format) using the private key and return the plaintext.
        """
        try:
            ciphertext_bytes = bytes.fromhex(ciphertext_hex)
            plaintext = self.private_key.decrypt(
                ciphertext_bytes,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None,
                ),
            )
            return plaintext.decode("utf-8")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Decryption failed: {str(e)}")
