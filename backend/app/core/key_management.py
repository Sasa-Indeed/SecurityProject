from datetime import datetime
from secrets import token_bytes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from ..database.session import db_instance
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
from bson import ObjectId


keys_collection = db_instance.get_collection("keys")
KEK = bytes.fromhex(os.getenv("KEK_HEX", "secure-kek-hex"))


"""
This module implements secure methods for key management, including:
1. Key generation (both RSA and AES).
2. Secure storage of keys in a MongoDB database.
3. Retrieval of keys by user.
4. Deletion of keys.

Secure methods for key management are achieved by:
- Using industry-standard cryptographic libraries like `cryptography` for secure RSA and AES key generation.
- Ensuring data integrity and security by storing RSA keys in PEM format and AES keys as securely generated random bytes.
- Enforcing constraints to prevent misuse, such as allowing only one RSA key pair per user while supporting multiple AES keys.
- Using MongoDB for efficient and secure storage of keys, indexed by user email for fast retrieval.

PEM Format:
- PEM (Privacy-Enhanced Mail) is a standardized, text-based format for encoding binary cryptographic keys or certificates.
- Keys are serialized into PEM format using Base64 encoding, making them readable and interoperable with most cryptographic tools.
- PEM files include clear delimiters, such as:
  - `-----BEGIN RSA PRIVATE KEY-----` for private keys.
  - `-----BEGIN PUBLIC KEY-----` for public keys.
- The PEM format is used in this module to ensure compatibility with widely-used tools and protocols like OpenSSL, TLS, and SSH.

Key Encryption Key (KEK):
- A KEK is a cryptographic key used to encrypt other keys.
- It ensures that sensitive keys (e.g., AES keys) are not stored in plaintext, even in secure databases.
- The KEK itself is securely stored, typically in an HSM, a cloud-based KMS, or as an environment variable.

"""


def generate_rsa_key(user_email: str):
    """
    Generate an RSA key pair for the given user email.

    Steps:
    1. Check if the user already has an RSA key pair. Raise an error if one exists.
    2. Use the `cryptography` library to generate a 2048-bit RSA private key.
    3. Extract the public key from the private key.
    4. Serialize the keys in PEM format to ensure secure and standardized storage.
        - PEM (Privacy-Enhanced Mail) format:
            - Text-based encoding of binary key data using Base64.
            - Includes clear delimiters like `-----BEGIN RSA PRIVATE KEY-----`.
            - Ensures compatibility with external tools and protocols like OpenSSL.
    5. Store the keys in the MongoDB `keys` collection, indexed by `user_email`.
    6. Return the public key to the user for sharing/distribution.

    Parameters:
        user_email (str): The email address of the user.

    Returns:
        dict: A dictionary containing the public key and the database ID of the stored key.

    Raises:
        ValueError: If the user already has an RSA key pair.
    """
    existing_key = keys_collection.find_one({"user_email": user_email, "key_type": "RSA"})
    if existing_key:
        raise ValueError("User already has an RSA key pair")

    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

    private_key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    key_data = {
        "user_email": user_email,
        "key_type": "RSA",
        "key_data": {"public_key": public_key_pem.decode(), "private_key": private_key_pem.decode()},
        "created_at": datetime.utcnow(),
    }
    result = keys_collection.insert_one(key_data)
    return {"id": str(result.inserted_id), "public_key": public_key_pem.decode()}


def encrypt_aes_key(aes_key: bytes, kek: bytes) -> str:
    """
    Encrypt an AES key using the Key Encryption Key (KEK).

    Parameters:
        aes_key (bytes): The plaintext AES key to be encrypted.
        kek (bytes): The Key Encryption Key used for encryption.

    Returns:
        str: The encrypted AES key in hexadecimal format.
    """
    cipher = Cipher(algorithms.AES(kek), modes.ECB(), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_key = encryptor.update(aes_key) + encryptor.finalize()
    return encrypted_key.hex()

def decrypt_aes_key(encrypted_key_hex: str, kek: bytes) -> bytes:
    """
    Decrypt an AES key using the Key Encryption Key (KEK).

    Parameters:
        encrypted_key_hex (str): The encrypted AES key in hexadecimal format.
        kek (bytes): The Key Encryption Key used for decryption.

    Returns:
        bytes: The decrypted AES key in plaintext.
    """
    cipher = Cipher(algorithms.AES(kek), modes.ECB(), backend=default_backend())
    decryptor = cipher.decryptor()
    encrypted_key = bytes.fromhex(encrypted_key_hex)
    return decryptor.update(encrypted_key) + decryptor.finalize()


def generate_aes_key(user_email: str):
    """
    Generate a secure AES key for the given user email.

    Steps:
    1. Generate a cryptographically secure 256-bit AES key using the `secrets` library.
    2. Encrypt the AES key using the KEK.
    3. Store the encrypted AES key in the database, indexed by `user_email`.
    4. Return the plaintext AES key to the caller for immediate use.

    Parameters:
        user_email (str): The email address of the user.

    Returns:
        dict: A dictionary containing the plaintext AES key (hexadecimal format) and the database ID.
    """
    aes_key = token_bytes(32)  # 256-bit AES key

    encrypted_aes_key = encrypt_aes_key(aes_key, KEK)

    key_data = {
        "user_email": user_email,
        "key_type": "AES",
        "key_data": {"key_value": encrypted_aes_key},
        "created_at": datetime.utcnow(),
    }
    result = keys_collection.insert_one(key_data)

    # Return the plaintext key for immediate use
    return {"id": str(result.inserted_id), "aes_key": aes_key.hex()}


def fetch_keys(user_email: str):
    """
    Retrieve all keys associated with a given user email.

    For AES keys:
    1. Fetch the encrypted keys from the database.
    2. Decrypt the keys using the KEK before returning them.

    Parameters:
        user_email (str): The email address of the user.

    Returns:
        list: A list of dictionaries, each containing the details of a key.
    """
    keys = list(keys_collection.find({"user_email": user_email}))

    transformed_keys = []
    for key in keys:
        key_type = key["key_type"]
        if key_type == "AES":
            # Decrypt AES keys before returning
            key["key_data"]["key_value"] = decrypt_aes_key(
                key["key_data"]["key_value"], KEK
            ).hex()
        key["id"] = str(key["_id"])  # Map MongoDB `_id` to `id`
        del key["_id"]  # Remove the raw `_id` field
        transformed_keys.append(key)

    return transformed_keys



def delete_key(key_id: str):
    """
    Delete a specific key by its database ID.

    Steps:
    1. Validate the `key_id` and ensure it corresponds to an existing key.
    2. Delete the key from the MongoDB `keys` collection.
    3. Return a success message if the operation is successful.

    Parameters:
        key_id (str): The database ID of the key to delete.

    Returns:
        dict: A success message.

    Raises:
        ValueError: If the key does not exist.
    """
    result = keys_collection.delete_one({"_id": ObjectId(key_id)})
    if result.deleted_count == 0:
        raise ValueError("Key not found")
    return {"msg": "Key deleted successfully"}