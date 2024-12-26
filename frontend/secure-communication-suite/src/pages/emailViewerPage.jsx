import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/email.css';
import {
  getKeys,
  decryptUsingRSA,
  decryptUsingAES,
  verifyEmailBody,
  viewEmail,
} from '../services/api';

//this page is the main service of the app its flow goes as follows
//the user views the email, hash, key which are encrypted
//the user then clicks on decrypt key (api function decryptusingRSA where we will pass the key and the private key of the user (call to get keys))
//which activiates the decrypt body and decrypt hash buttons
//user clicks on decrypt body shows decrypted body (call to function decryptusingaes)
//user clicks on decrypt hash shows decrypted hash (call to function decryptuseingaes)
//this activates the verify email button
//user clicks on verify email (call to function verifyhash check the hash against the body)
//a message saying email was not tampered willbe displayed

const ViewEmail = () => {
  const { emailId } = useParams();
  const [email, setEmail] = useState(null);
  const [decryptedKey, setDecryptedKey] = useState("");
  const [decryptedBody, setDecryptedBody] = useState("");
  const [decryptedHash, setDecryptedHash] = useState("");
  const [isKeyDecrypted, setIsKeyDecrypted] = useState(false);
  const [isBodyDecrypted, setIsBodyDecrypted] = useState(false);
  const [isHashDecrypted, setIsHashDecrypted] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await viewEmail(emailId);
        setEmail(response);
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };
    fetchEmail();
  }, [emailId]);

  const handleDecryptKey = async () => {
    try {
      const keys = await getKeys();
      const privateKey = keys.find((key) => key.key_type === "RSA" && key.key_data);
      if (!privateKey || !email?.encrypted_aes_key) {
        alert("Missing private key or encrypted AES key.");
        return;
      }
      const response = await decryptUsingRSA(email.encrypted_aes_key, privateKey.key_data.private_key);
      setDecryptedKey(response);
      setIsKeyDecrypted(true);
    } catch (error) {
      console.error("Error decrypting key:", error);
    }
  };

  const handleDecryptBody = async () => {
    try {
      if (!decryptedKey || !email?.body) {
        alert("Key must be decrypted first.");
        return;
      }
      const response = await decryptUsingAES(email.body, decryptedKey);
      setDecryptedBody(response);
      setIsBodyDecrypted(true);
    } catch (error) {
      console.error("Error decrypting email body:", error);
    }
  };

  const handleDecryptHash = async () => {
    try {
      if (!decryptedKey || !email?.hash) {
        alert("Key must be decrypted first.");
        return;
      }
      const response = await decryptUsingAES(email.hash, decryptedKey);
      setDecryptedHash(response);
      setIsHashDecrypted(true);
    } catch (error) {
      console.error("Error decrypting hash:", error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      if (!decryptedBody || !decryptedHash) {
        alert("Body and hash must be decrypted first.");
        return;
      }
      const isValid = await verifyEmailBody(decryptedBody, decryptedHash);
      window.alert(
        isValid ? "Email is verified and untampered." : "Email verification failed."
      );
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="view-email-page">
      <h2>View Email</h2>
      {email ? (
        <>
          {/* Encrypted Key Section */}
          <div className="view-email-section">
            <h3>Encrypted AES Key:</h3>
            <textarea value={email.encrypted_aes_key} readOnly className="view-email-textarea" />
            <button onClick={handleDecryptKey} disabled={isKeyDecrypted} className="view-email-button">
              {isKeyDecrypted ? "Key Decrypted" : "Decrypt Key"}
            </button>
          </div>

          {/* Decrypted Key Section */}
          {isKeyDecrypted && (
            <div className="view-email-section">
              <h3>Decrypted AES Key:</h3>
              <textarea value={decryptedKey} readOnly className="view-email-textarea" />
            </div>
          )}

          {/* Encrypted Email Body Section */}
          <div className="view-email-section">
            <h3>Encrypted Email Body:</h3>
            <textarea value={email.body} readOnly className="view-email-textarea" />
          </div>

          {/* Decrypted Email Body Section */}
          {isKeyDecrypted && (
            <div className="view-email-section">
              {isBodyDecrypted && (
                <div>
                  <h3>Decrypted Email Body:</h3>
                  <textarea value={decryptedBody} readOnly className="view-email-textarea" />
                </div>
              )}
              <button onClick={handleDecryptBody} disabled={isBodyDecrypted} className="view-email-button">
                {isBodyDecrypted ? "Body Decrypted" : "Decrypt Body"}
              </button>
            </div>
          )}

          {/* Encrypted Hash Section */}
          <div className="view-email-section">
            <h3>Encrypted Hash:</h3>
            <textarea value={email.hash} readOnly className="view-email-textarea" />
          </div>

          {/* Decrypted Hash Section */}
          {isKeyDecrypted && (
            <div className="view-email-section">
              {isHashDecrypted && (
                <div>
                  <h3>Decrypted Hash:</h3>
                  <textarea value={decryptedHash} readOnly className="view-email-textarea" />
                </div>
              )}
              <button onClick={handleDecryptHash} disabled={isHashDecrypted} className="view-email-button">
                {isHashDecrypted ? "Hash Decrypted" : "Decrypt Hash"}
              </button>
            </div>
          )}

          {/* Verify Email Integrity Section */}
          {isBodyDecrypted && isHashDecrypted && (
              <button onClick={handleVerifyEmail} className="view-email-button">
                Verify Email Integrity
              </button>
          )}
        </>
      ) : (
        <p>Loading email...</p>
      )}
    </div>
  );
};

export default ViewEmail;


