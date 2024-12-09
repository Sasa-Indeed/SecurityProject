import React, { useState } from 'react';
import axios from 'axios';
import '../styles/email.css';

const ComposeEmail = () => {
  const [emailBody, setEmailBody] = useState('');
  const [encryptedEmail, setEncryptedEmail] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleEmailBodyChange = (e) => setEmailBody(e.target.value);
  const handleRecipientChange = (e) => setRecipient(e.target.value);

  const encryptEmail = async () => {
    try {
      const response = await axios.post('/api/encrypt-email', { body: emailBody, recipient });
      setEncryptedEmail(response.data.encryptedBody);
      setIsEncrypted(true);
    } catch (error) {
      console.error('Error encrypting email:', error);
    }
  };

  const sendEmail = async () => {
    setIsSending(true);
    try {
      await axios.post('/api/send-email', { recipient, encryptedBody: encryptedEmail });
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="compose-email-page">
      <h2 className='email'>Compose Email</h2>
      <form>
        <label htmlFor="recipient">Recipient:</label>
        <input
          type="email"
          id="recipient"
          value={recipient}
          onChange={handleRecipientChange}
          placeholder="Recipient's email"
        />
        <label htmlFor="email-body">Email Body:</label>
        <textarea
          id="email-body"
          value={emailBody}
          onChange={handleEmailBodyChange}
          placeholder="Write your email here"
        />
        <button type="button" onClick={encryptEmail} className='email'>
          Encrypt Email
        </button>
        {isEncrypted && (
          <>
            <label htmlFor="encrypted-body">Encrypted Email Body:</label>
            <textarea id="encrypted-body" value={encryptedEmail} readOnly className='email'/>
            <button type="button" onClick={sendEmail} disabled={isSending} className='email'>
              {isSending ? 'Sending...' : 'Send Encrypted Email'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ComposeEmail;
