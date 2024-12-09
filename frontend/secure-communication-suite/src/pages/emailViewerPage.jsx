import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/email.css';

const ViewEmail = ({ emailId }) => {
  const [email, setEmail] = useState(null);
  const [decryptedEmail, setDecryptedEmail] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [hash, setHash] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`/api/get-email/${emailId}`);
        setEmail(response.data);
        setHash(response.data.hash);
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };
    fetchEmail();
  }, [emailId]);

  const decryptEmail = async () => {
    try {
      const response = await axios.post('/api/decrypt-email', { encryptedBody: email.encryptedBody });
      setDecryptedEmail(response.data.decryptedBody);
      setIsDecrypted(true);
    } catch (error) {
      console.error('Error decrypting email:', error);
    }
  };

  const verifyHash = async () => {
    try {
      const response = await axios.post('/api/verify-hash', { emailId, hash });
      setIsVerified(response.data.isVerified);
    } catch (error) {
      console.error('Error verifying hash:', error);
    }
  };

  return (
    <div className="view-email-page">
      {email ? (
        <>
          <h2>View Email</h2>
          <div>
            <h3>Encrypted Email Body:</h3>
            <textarea value={email.encryptedBody} readOnly />
            <button type="button" onClick={decryptEmail}>
              Decrypt Email
            </button>
            {isDecrypted && (
              <div>
                <h3>Decrypted Email:</h3>
                <textarea value={decryptedEmail} readOnly />
              </div>
            )}
          </div>
          <div className="hash-verification">
            <button type="button" onClick={verifyHash}>
              Verify Email Integrity
            </button>
            {isVerified !== null && (
              <p>{isVerified ? 'Email is verified and untampered' : 'Email verification failed'}</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading email...</p>
      )}
    </div>
  );
};

export default ViewEmail;
