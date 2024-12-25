from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from fastapi import HTTPException
from .key_management import decrypt_rsa_private_key

class RSACipher:
    def __init__(self, key: str):
        """
        Initialize the RSACipher with the provided key.
        If the operation is encryption, the key is expected to be a public key in PEM format.
        If the operation is decryption, the key is expected to be an AES-encrypted private key in PEM format.
        """
        self.key = key

    def load_private_key(self, encrypted_private_key: str):
        """
        Decrypt the AES-encrypted private key using the `decrypt_rsa_private_key` function.
        """
        try:
            private_key = decrypt_rsa_private_key(encrypted_private_key)
            print("Decrypted private key.")
            return private_key
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading private key: {str(e)}")

    def load_public_key(self, public_key_pem: str):
        """
        Load the RSA public key from a PEM-formatted string.
        """
        try:
            public_key = serialization.load_pem_public_key(
                public_key_pem.encode(), backend=default_backend()
            )
            print("Loaded public key.")
            return public_key
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading public key: {str(e)}")

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypt the given plaintext using the public key and return the ciphertext in hex format.
        """
        try:
            public_key = self.load_public_key(self.key)
            ciphertext = public_key.encrypt(
                plaintext.encode("utf-8"),
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None,
                ),
            )
            print("Data encrypted.")
            return ciphertext.hex()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Encryption failed: {str(e)}")

    def decrypt(self, ciphertext_hex: str) -> str:
        """
        Decrypt the given ciphertext (in hex format) using the private key and return the plaintext.
        """
        try:
            private_key = self.load_private_key(self.key)
            ciphertext_bytes = bytes.fromhex(ciphertext_hex)
            plaintext = private_key.decrypt(
                ciphertext_bytes,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None,
                ),
            )
            print("Data decrypted.")
            return plaintext.decode("utf-8")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Decryption failed: {str(e)}")
