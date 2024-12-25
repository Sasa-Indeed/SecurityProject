from backend.app.core.auth import generate_challenge_logic, decrypt_with_password
from backend.app.core.hashing import derive_key
import base64
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7

# Mock test user
email = "test@example.com"
hashed_password = "$2b$12$somethinghashed"  # Example bcrypt hash

def test_challenge_flow():
    # Step 1: Generate a challenge
    challenge = generate_challenge_logic(email)
    print(f"Generated Challenge: {challenge}")

    # Step 2: Encrypt the challenge (simulate client-side encryption)
    salt = os.urandom(16)  # Generate a random salt
    key = derive_key(hashed_password, salt)

    # Encrypt the challenge
    cipher = Cipher(algorithms.AES(key), modes.CBC(salt))
    encryptor = cipher.encryptor()

    padder = PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(challenge.encode('utf-8')) + padder.finalize()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

    # Combine salt and ciphertext
    encrypted_payload = base64.b64encode(salt + encrypted_data).decode('utf-8')
    print(f"Encrypted Challenge Payload: {encrypted_payload}")

    # Step 3: Decrypt the challenge (server-side validation)
    decrypted_challenge = decrypt_with_password(encrypted_payload, hashed_password)
    print(f"Decrypted Challenge: {decrypted_challenge}")

    # Step 4: Assert the decrypted challenge matches the original
    assert decrypted_challenge == challenge, "Decrypted challenge does not match the original"
    print("Test Passed: Challenge decrypted successfully")

if __name__ == "__main__":
    test_challenge_flow()
