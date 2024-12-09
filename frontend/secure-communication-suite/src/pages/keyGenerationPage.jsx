import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import "../styles/keyGen.css";

const GenerateKeyPage = () => {
  const [keyType, setKeyType] = useState("");

  useEffect(() => {
    AOS.init();
  }, []);

  const handleKeyTypeChange = (e) => setKeyType(e.target.value);

  // function to generate key the resulting entry should be added in the key table
  const handleGenerateKey = async () => {
    if (!keyType) {
      alert("Please select a key type before generating!");
      return;
    }
    try {
      console.log(`Request to generate a ${keyType.toUpperCase()} key...`);
      alert(`${keyType.toUpperCase()} key generated successfully!`);
    } catch (error) {
      console.error("Error generating key:", error);
      alert("An error occurred while generating the key. Please try again.");
    }
  };

  return (
    <div className="generate-key-page">
      <div className="key-card" data-aos="fade-up">
        <h1 className="key-card-title">Generate a New Key</h1>

        <div className="form-group">
          <label htmlFor="keyType" className="form-label">
            Select Key Type
          </label>
          <select
            id="keyType"
            className="form-select"
            value={keyType}
            onChange={handleKeyTypeChange}
          >
            <option value="" disabled>
              Select key type
            </option>
            <option value="rsa">RSA</option>
            <option value="aes">AES</option>
          </select>
        </div>

        <div className="steps-container" data-aos="fade-right">
          <h2>Steps to Generate the Key</h2>
          <ol>
            <li>Choose the key type from the dropdown above.</li>
            <li>Click the "Generate Key" button below.</li>
            <li>The system will securely generate and save the key.</li>
            <li>You can view the new key in the Key Management section.</li>
          </ol>
        </div>

        <button className="generate-key-button" onClick={handleGenerateKey}>
          Generate Key
        </button>
      </div>
    </div>
  );
};

export default GenerateKeyPage;

