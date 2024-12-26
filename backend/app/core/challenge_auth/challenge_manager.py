from datetime import datetime, timedelta
import secrets
import threading
from typing import Dict, Optional, Tuple
import base64
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class ChallengeManager:
    def __init__(self, challenge_timeout_seconds: int = 300):
        self._challenges: Dict[str, Tuple[str, datetime]] = {}
        self._lock = threading.Lock()
        self._challenge_timeout = timedelta(seconds=challenge_timeout_seconds)
        logger.info(f"ChallengeManager initialized with timeout: {challenge_timeout_seconds} seconds")

        # Start cleanup thread
        self._cleanup_thread = threading.Thread(target=self._cleanup_expired_challenges, daemon=True)
        self._cleanup_thread.start()
        logger.info("Cleanup thread started")

    def generate_challenge(self, email: str) -> str:
        """
        Generates a new challenge for the given email.
        Returns base64 encoded challenge string.
        """
        logger.info(f"Generating challenge for email: {email}")

        # Generate 32 bytes (256 bits) of random data
        challenge = secrets.token_bytes(32)
        challenge_b64 = base64.b64encode(challenge).decode('utf-8')
        logger.debug(f"Generated challenge: {challenge_b64}")

        with self._lock:
            self._challenges[email] = (challenge_b64, datetime.utcnow())
            logger.debug(f"Stored challenge for {email}")

        return challenge_b64

    def validate_challenge(self, email: str, response: str) -> bool:
        """
        Validates the challenge response for the given email.
        Returns True if valid, False otherwise.
        """
        logger.info(f"Validating challenge for email: {email}")

        with self._lock:
            if email not in self._challenges:
                logger.error(f"No challenge found for email: {email}")
                return False

            stored_challenge, timestamp = self._challenges[email]
            logger.debug(f"Retrieved stored challenge: {stored_challenge}")
            logger.debug(f"Challenge timestamp: {timestamp}")

            # Check if challenge has expired
            time_elapsed = datetime.utcnow() - timestamp
            logger.debug(f"Time elapsed: {time_elapsed}")

            if time_elapsed > self._challenge_timeout:
                logger.error(f"Challenge expired for {email}. Elapsed time: {time_elapsed}")
                del self._challenges[email]
                return False

            # Clean up after validation attempt
            del self._challenges[email]

            # Compare challenges
            result = response == stored_challenge
            logger.info(f"Challenge validation result for {email}: {result}")
            logger.debug(f"Received response: {response}")
            logger.debug(f"Expected challenge: {stored_challenge}")

            return result

    def _cleanup_expired_challenges(self):
        """
        Periodically removes expired challenges.
        Runs in a separate thread.
        """
        logger.info("Starting cleanup thread")
        while True:
            with self._lock:
                current_time = datetime.utcnow()
                expired = [
                    email for email, (_, timestamp) in self._challenges.items()
                    if current_time - timestamp > self._challenge_timeout
                ]

                for email in expired:
                    logger.info(f"Cleaning up expired challenge for {email}")
                    del self._challenges[email]

                if expired:
                    logger.debug(f"Cleaned up {len(expired)} expired challenges")

            # Sleep for 60 seconds before next cleanup
            threading.Event().wait(60)


# Global instance
challenge_manager = ChallengeManager()