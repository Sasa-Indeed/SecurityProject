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
  const [decryptedKey, setDecryptedKey] = useState('');
  const [decryptedBody, setDecryptedBody] = useState('');
  const [decryptedHash, setDecryptedHash] = useState('');
  const [isKeyDecrypted, setIsKeyDecrypted] = useState(false);
  const [isBodyDecrypted, setIsBodyDecrypted] = useState(false);
  const [isHashDecrypted, setIsHashDecrypted] = useState(false);
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await viewEmail(emailId);
        setEmail(response.data);
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };
    fetchEmail();
  }, [emailId]);

  const handleDecryptKey = async () => {
    try {
      const keys = await getKeys();
      const privateKey = keys.find((key) => key.key_type === 'RSA' && key.key_data.private_key)?.private_key;

      if (!privateKey || !email?.encryptedKey) {
        alert('Missing private key or encrypted AES key.');
        return;
      }

      const response = await decryptUsingRSA(email.encryptedKey, privateKey);
      setDecryptedKey(response);
      setIsKeyDecrypted(true);
    } catch (error) {
      console.error('Error decrypting key:', error);
    }
  };

  const handleDecryptBody = async () => {
    try {
      if (!isKeyDecrypted || !decryptedKey || !email?.encryptedBody) {
        alert('Key must be decrypted first.');
        return;
      }

      const response = await decryptUsingAES(email.encryptedBody, decryptedKey);
      setDecryptedBody(response);
      setIsBodyDecrypted(true);
    } catch (error) {
      console.error('Error decrypting email body:', error);
    }
  };

  const handleDecryptHash = async () => {
    try {
      if (!isKeyDecrypted || !decryptedKey || !email?.encryptedHash) {
        alert('Key must be decrypted first.');
        return;
      }

      const response = await decryptUsingAES(email.encryptedHash, decryptedKey);
      setDecryptedHash(response);
      setIsHashDecrypted(true);
    } catch (error) {
      console.error('Error decrypting hash:', error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      if (!isBodyDecrypted || !isHashDecrypted) {
        alert('Body and hash must be decrypted first.');
        return;
      }

      const isValid = await verifyEmailBody(decryptedBody, decryptedHash);
      setIsVerified(isValid);
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };

  return (
    <div className="view-email-page">
      <h2>View Email</h2>
      {email ? (
        <>
          <div className="email-section">
            <h3>Encrypted Email Body:</h3>
            <textarea value={email.encryptedBody} readOnly className="textarea" />
          </div>

          <div className="email-section">
            <h3>Encrypted Hash:</h3>
            <textarea value={email.encryptedHash} readOnly className="textarea" />
          </div>

          <div className="email-section">
            <h3>Encrypted AES Key:</h3>
            <textarea value={email.encryptedKey} readOnly className="textarea" />
            <button onClick={handleDecryptKey} disabled={isKeyDecrypted} className="button">
              {isKeyDecrypted ? 'Key Decrypted' : 'Decrypt Key'}
            </button>
          </div>

          {isKeyDecrypted && (
            <div className="email-section">
              <h3>Decrypted AES Key:</h3>
              <textarea value={decryptedKey} readOnly className="textarea" />

              <button onClick={handleDecryptBody} disabled={isBodyDecrypted} className="button">
                {isBodyDecrypted ? 'Body Decrypted' : 'Decrypt Body'}
              </button>
              <button onClick={handleDecryptHash} disabled={isHashDecrypted} className="button">
                {isHashDecrypted ? 'Hash Decrypted' : 'Decrypt Hash'}
              </button>
            </div>
          )}

          {isBodyDecrypted && (
            <div className="email-section">
              <h3>Decrypted Email Body:</h3>
              <textarea value={decryptedBody} readOnly className="textarea" />
            </div>
          )}

          {isHashDecrypted && (
            <div className="email-section">
              <h3>Decrypted Hash:</h3>
              <textarea value={decryptedHash} readOnly className="textarea" />
            </div>
          )}

          {isBodyDecrypted && isHashDecrypted && (
            <div className="email-section">
              <button onClick={handleVerifyEmail} disabled={isVerified !== null} className="button">
                Verify Email Integrity
              </button>
              {isVerified !== null && (
                <p>
                  {isVerified ? 'Email is verified and untampered.' : 'Email verification failed.'}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Loading email...</p>
      )}
    </div>
  );
};

export default ViewEmail;
