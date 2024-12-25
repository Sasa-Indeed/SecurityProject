import React, { useState, useEffect } from 'react';
import { composeEmail, generateHash, getKeys, encryptUsingRSA, encryptUsingAES } from "../services/api";
import '../styles/email.css';
import { useAuth } from '../context/AuthContext';
import AOS from "aos";
import "aos/dist/aos.css";

//this page is the main service of the app its flow goes as follows
//the user in an email form enters the ricipient email and the email body and the subject
//the user then clicks on generate hash button which generates a hash for the email body (function from api file)
//then we concatenate the email body with the generated hash
//then we display the concatenated email body to the user
//then the user picks an aes key from his keys dropdown (function from api file but needs filtering for aes keys only)
//then the user clicks on encrypt email (function from api file)
//which encrypts the email body by itself and the hash by itself
//then we display the encrypted email body
//then the user clicks on encrypt key (function from api file encrypts the sleected key using rsa)
//then we display a message to say it was successfully encrypted
//then the user clicks on send email (which calls the composeEmail function where we pass to it the useremail, the encrypted body, encrypted hash, encrypted key, ricipient mail and subject)

const ComposeEmail = () => {
  const [recipient, setRecipient] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [hash, setHash] = useState("");
  const [emailWithHash, setEmailWithHash] = useState("");
  const [aesKeys, setAESKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [encryptedEmail, setEncryptedEmail] = useState("");
  const [encryptedHash, setEncryptedHash] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [subject, setSubject] = useState("");
  const { userEmail } = useAuth();
  console.log("Current User Email:", userEmail);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
    });
    handleGetAESKeys();
  }, []);

  // Step 1: Generate hash for email body and concatenate with email body
  const handleGenerateHash = async () => {
    try {
      const generatedHash = await generateHash(emailBody);
      setHash(generatedHash);
      setEmailWithHash(`${emailBody}\n\nHash: ${generatedHash}`);
    } catch (error) {
      console.error("Error generating hash:", error);
    }
  };

  // Step 2: Fetch AES keys and filter for valid ones
  const handleGetAESKeys = async () => {
    try {
      const keys = await getKeys();
      const aesKeysList = keys.filter((key) => key.key_type === "AES");
      setAESKeys(aesKeysList);
    } catch (error) {
      console.error("Error fetching AES keys:", error);
    }
  };

  // Step 3: Encrypt email body and hash separately
  const handleEncryptEmail = async () => {
    try {
      if (!emailBody || !selectedKey) return;

      console.log("Encrypting email with key:", selectedKey);

      const emailEncryptionResponse = await encryptUsingAES(emailBody, selectedKey);
      setEncryptedEmail(emailEncryptionResponse);

      const hashEncryptionResponse = await encryptUsingAES(hash, selectedKey);
      setEncryptedHash(hashEncryptionResponse);

      setIsEncrypted(true);
    } catch (error) {
      console.error("Error encrypting email:", error);
    }
  };

  // Step 4: Encrypt selected AES key using RSA
  const handleEncryptKey = async () => {
    try {
      //ricipient_public_key :(((((((
      const response = await encryptUsingRSA(selectedKey);
      alert("Key successfully encrypted!");
      return response;
    } catch (error) {
      console.error("Error encrypting key:", error);
    }
  };

  // Step 5: Send email with all encrypted data
  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const encryptedKeyResponse = await handleEncryptKey();
      console.log(recipient,
        userEmail,
        subject,
        encryptedEmail,
        encryptedHash,
        encryptedKeyResponse)
      await composeEmail(
        recipient,
        userEmail,
        subject,
        encryptedEmail,
        encryptedHash,
        encryptedKeyResponse
      );
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="compose-email-page" data-aos="fade-up">
      <h2 className="compose-email-header">Compose Email</h2>

      {/* Step 1: Enter recipient email */}
      <div className="compose-form-group">
        <label htmlFor="recipient" className="compose-label">Recipient Email</label>
        <input
          type="email"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient's email"
          className="compose-input"
        />
      </div>

      {/* Step 2: Enter subject */}
      <div className="compose-form-group">
        <label htmlFor="subject" className="compose-label">Subject</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
          className="compose-input"
        />
      </div>

      {/* Step 3: Enter email body and generate hash */}
      <div className="compose-form-group">
        <label htmlFor="email-body" className="compose-label">Email Body</label>
        <textarea
          id="email-body"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder="Write your email here"
          className="compose-textarea"
        />
        <button onClick={handleGenerateHash} className="compose-button">Generate Hash</button>
      </div>

      {/* Step 4: Display concatenated email body */}
      {hash && (
        <div className="compose-form-group">
          <label htmlFor="hashed-body" className="compose-label">Hashed Email Body</label>
          <textarea
            id="hashed-body"
            value={emailWithHash}
            readOnly
            className="compose-textarea"
          />
        </div>
      )}

      {/* Step 5: Select AES key and encrypt */}
      {aesKeys.length > 0 && (
        <div className="form-group">
          <label htmlFor="aes-keys" className="form-label">Available AES Keys</label>
          <select
            id="aes-keys"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="form-select"
          >
            <option value="">Select an AES key</option>
            {aesKeys.map((key) => (
              <option key={key.id} value={key.key_data.key_value}>
                {key.key_data.key_value}
              </option>
            ))}
          </select>
          <button
            onClick={handleEncryptEmail}
            className="compose-button"
            disabled={!emailBody || !selectedKey}
          >
            Encrypt Email
          </button>
        </div>
      )}

      {/* Step 6: Display encrypted email */}
      {isEncrypted && (
        <div className="compose-form-group">
          <label htmlFor="encrypted-body" className="compose-label">Encrypted Email</label>
          <textarea
            id="encrypted-body"
            value={encryptedEmail}
            readOnly
            className="compose-textarea"
          />
        </div>
      )}

      {/* Step 7: Send email */}
      <button
        onClick={handleSendEmail}
        className="compose-button"
        disabled={isSending || !isEncrypted || !selectedKey || !subject}
      >
        {isSending ? "Sending..." : "Send Email"}
      </button>
    </div>
  );
};

export default ComposeEmail;
