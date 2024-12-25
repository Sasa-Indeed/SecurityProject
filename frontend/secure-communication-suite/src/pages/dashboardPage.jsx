import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";
import { getInboxEmails, getSentEmails, getKeys, deleteKey } from "../services/api";

const DashboardPage = () => {
  const [selectedSection, setSelectedSection] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [loadingSentEmails, setLoadingSentEmails] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState(true);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inboxData = await getInboxEmails();
        setEmails(inboxData);
        setLoadingEmails(false);

        const sentData = await getSentEmails();
        setSentEmails(sentData);
        setLoadingSentEmails(false);

        const keysData = await getKeys();
        setKeys(keysData);
        setLoadingKeys(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingEmails(false);
        setLoadingSentEmails(false);
        setLoadingKeys(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteKey = async (keyId) => {
    try {
      await deleteKey(keyId);
      setKeys(keys.filter((key) => key.id !== keyId));
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2 className="sidebar-title dash">Dashboard</h2>
        <nav className="sidebar-nav">
          <ul>
            <li
              className={selectedSection === "inbox" ? "active" : ""}
              onClick={() => handleSectionChange("inbox")}
            >
              Inbox
            </li>
            <li
              className={selectedSection === "sent" ? "active" : ""}
              onClick={() => handleSectionChange("sent")}
            >
              Sent
            </li>
            <li
              className={selectedSection === "key-management" ? "active" : ""}
              onClick={() => handleSectionChange("key-management")}
            >
              Key Management
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {selectedSection === "inbox" && (
          <div className="inbox-section">
            <h2 className="dash">Inbox</h2>

            <form className="search-bar">
              <input type="text" placeholder="Search emails..." />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </form>

            {loadingEmails ? (
              <p>Loading emails...</p>
            ) : (
              <ul className="email-list">
                {emails.map((email) => (
                  <li className="email-item" key={email.email_id}>
                    <span className="email-sender">{email.sender_email}</span>
                    <span className="email-subject">{email.subject}</span>
                    <span className="email-timestamp">{email.timestamp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {selectedSection === "sent" && (
          <div className="sent-section">
            <h2 className="dash">Sent Emails</h2>

            {/* Compose Email Button */}
            <Link to="/compose-email">
              <button className="action-button">Compose Email</button>
            </Link>

            {loadingSentEmails ? (
              <p>Loading sent emails...</p>
            ) : sentEmails.length === 0 ? (
              <p>No sent emails available yet.</p>
            ) : (
              <div className="email-tiles">
                {sentEmails.map((email) => (
                  <div className="email-tile" key={email.id}>
                    <span className="email-recipient">{email.recipient}</span>
                    <span className="email-subject">{email.subject}</span>
                    <span className="email-timestamp">{email.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSection === "key-management" && (
          <div className="key-management-section">
            <h2 className="dash">Key Management</h2>
            <div className="key-actions">
              <Link to="/generate-key">
                <button className="action-button">Generate New Key</button>
              </Link>
            </div>

            {loadingKeys ? (
              <p>Loading keys...</p>
            ) : (
              <table className="key-table">
                <thead>
                  <tr>
                    <th>Key Type</th>
                    <th>Key ID</th>
                    <th>Key Data</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key) => (
                    <tr key={key.id}>
                      <td>{key.key_type}</td>
                      <td>{key.id}</td>
                      <td>
                        {key.key_type === "RSA" ? (
                          <span>{key.key_data.public_key.substring(0, 20)}...</span>
                        ) : key.key_type === "AES" ? (
                          <span>{key.key_data.key_value.substring(0, 20)}...</span>
                        ) : (
                          <span>Not available</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDeleteKey(key.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
