from datetime import datetime
from secrets import token_bytes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from ..database.session import db_instance
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
from bson import ObjectId
from cryptography.hazmat.primitives import padding


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
- Ensuring data integrity and security by storing RSA keys in PEM format (encrypted using AES) and AES keys as securely generated random bytes.
- Enforcing constraints to prevent misuse, such as allowing only one RSA key pair per user while supporting multiple AES keys.
- Using MongoDB for efficient and secure storage of keys, indexed by user email for fast retrieval.

PEM Format:
- PEM (Privacy-Enhanced Mail) is a standardized, text-based format for encoding binary cryptographic keys or certificates.
- RSA private keys are serialized into PEM format and encrypted using AES before storage, ensuring both compatibility and security.
- PEM files include clear delimiters, such as:
  - `-----BEGIN RSA PRIVATE KEY-----` for private keys.
  - `-----BEGIN PUBLIC KEY-----` for public keys.
- The PEM format is used in this module to ensure compatibility with widely-used tools and protocols like OpenSSL, TLS, and SSH.

Key Encryption Key (KEK):
- A KEK is a cryptographic key used to encrypt other keys.
- It ensures that sensitive keys (e.g., RSA private keys and AES keys) are not stored in plaintext, even in secure databases.
- The KEK itself is securely stored, typically in an HSM, a cloud-based KMS, or as an environment variable.
- The KEK is used to encrypt RSA private keys in PEM format and AES keys before they are stored in the database.
"""


def generate_rsa_key(user_email: str):
    """
    Generate and securely store an RSA key pair for a given user email.

    Steps:
    1. Check if the user already has an RSA key pair. Raise an error if one exists.
    2. Generate a 2048-bit RSA private key.
    3. Extract and serialize the public key in PEM format.
    4. Serialize the private key in PEM format with no encryption (temporarily).
    5. Encrypt the private key PEM using AES encryption with a Key Encryption Key (KEK).
    6. Store both keys in the MongoDB `keys` collection, with the private key encrypted.
    7. Return the public key and database ID.

    Parameters:
        user_email (str): Email address of the user.

    Returns:
        dict: A dictionary containing the public key in PEM format and the database ID.

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

    # Encrypt private key PEM
    encrypted_private_key = encrypt_aes_key(private_key_pem, KEK)

    key_data = {
        "user_email": user_email,
        "key_type": "RSA",
        "key_data": {
            "public_key": public_key_pem.decode(),  # Public key in PEM format
            "private_key": encrypted_private_key,  # Encrypted private key in PEM format
        },
    }
    result = keys_collection.insert_one(key_data)
    return {"id": str(result.inserted_id), "public_key": public_key_pem.decode()}

def decrypt_rsa_private_key(encrypted_private_key_hex: str):
    """
    Decrypt an encrypted RSA private key.

    Steps:
    1. Decrypt the private key using AES encryption with the Key Encryption Key (KEK).
    2. Load the decrypted PEM-encoded private key into an RSA key object.

    Parameters:
        encrypted_private_key_hex (str): The encrypted private key as a hex string.

    Returns:
        rsa.RSAPrivateKey: The decrypted RSA private key object.

    Raises:
        ValueError: If the decryption fails or the private key is invalid.
    """
    # Decrypt the encrypted private key using the KEK
    decrypted_key_pem = decrypt_aes_key(encrypted_private_key_hex, KEK)

    # Load the RSA private key from the decrypted PEM
    private_key = serialization.load_pem_private_key(
        decrypted_key_pem,
        password=None,
        backend=default_backend()
    )
    return private_key


def encrypt_aes_key(aes_key: bytes, kek: bytes) -> str:
    """
    Encrypt an AES key or data using the Key Encryption Key (KEK).

    Parameters:
        aes_key (bytes): The plaintext AES key or data to be encrypted.
        kek (bytes): The Key Encryption Key used for encryption.

    Returns:
        str: The encrypted AES key or data in hexadecimal format.
    """
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(aes_key) + padder.finalize()

    cipher = Cipher(algorithms.AES(kek), modes.ECB(), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_key = encryptor.update(padded_data) + encryptor.finalize()
    return encrypted_key.hex()

def decrypt_aes_key(encrypted_key_hex: str, kek: bytes) -> bytes:
    """
    Decrypt an AES key or data using the Key Encryption Key (KEK).

    Parameters:
        encrypted_key_hex (str): The encrypted AES key or data in hexadecimal format.
        kek (bytes): The Key Encryption Key used for decryption.

    Returns:
        bytes: The decrypted AES key or data in plaintext.
    """
    cipher = Cipher(algorithms.AES(kek), modes.ECB(), backend=default_backend())
    decryptor = cipher.decryptor()
    encrypted_key = bytes.fromhex(encrypted_key_hex)
    padded_data = decryptor.update(encrypted_key) + decryptor.finalize()

    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    data = unpadder.update(padded_data) + unpadder.finalize()
    return data


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
        key["id"] = str(key["_id"])  # Map MongoDB `_id` to `id`
        del key["_id"]  # Remove the raw `_id` field
        transformed_keys.append(key)

    return transformed_keys

def fetch_public_key(user_email: str):
    """
    Retrieve the public RSA key associated with a given user email.

    Parameters:
        user_email (str): The email address of the user.

    Returns:
        str: The public RSA key in PEM format.
    """
    key = keys_collection.find_one({"user_email": user_email, "key_type": "RSA"})
    if key:
        return key["key_data"]["public_key"]
    return None



def delete_key(key_id: str, user_email: str):
    """
    Delete a specific key by its database ID, ensuring it belongs to the specified user.

    Steps:
    1. Validate the `key_id` and ensure it corresponds to an existing key owned by the user.
    2. Delete the key from the MongoDB `keys` collection if it matches the user.
    3. Return a success message if the operation is successful.

    Parameters:
        key_id (str): The database ID of the key to delete.
        user_email (str): The email address of the user.

    Returns:
        dict: A success message.

    Raises:
        ValueError: If the key does not exist or does not belong to the user.
    """
    result = keys_collection.delete_one({"_id": ObjectId(key_id), "user_email": user_email})
    if result.deleted_count == 0:
        raise ValueError("Key not found or does not belong to the user")
    return {"msg": "Key deleted successfully"}