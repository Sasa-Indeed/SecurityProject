import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [selectedSection, setSelectedSection] = useState("inbox");
  const [emails, setEmails] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState(true);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // Mr. sakr you have full power over these functions 3ee4 7yatk
  useEffect(() => {
    // Fetching emailss
    axios.get("/api/emails")
      .then((response) => {
        setEmails(response.data);
        setLoadingEmails(false);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
        setLoadingEmails(false);
      });

    // Fetching keys
    axios.get("/api/keys")
      .then((response) => {
        setKeys(response.data);
        setLoadingKeys(false);
      })
      .catch((error) => {
        console.error("Error fetching keys:", error);
        setLoadingKeys(false);
      });
  }, []);

  const handleDeleteKey = (keyId) => {
    axios.delete(`/api/keys/${keyId}`) 
      .then((response) => {
        setKeys(keys.filter(key => key.id !== keyId));
      })
      .catch((error) => {
        console.error("Error deleting key:", error);
      });
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
            <li
              className={selectedSection === "account-settings" ? "active" : ""}
              onClick={() => handleSectionChange("account-settings")}
            >
              Account Settings
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
                  <input type="text" placeholder="Search emails..."/>
                  <button type="submit" className="search-button">
                    <i className="fas fa-search"></i>
                  </button>
              </form>
    

            {loadingEmails ? (
              <p>Loading emails...</p>
            ) : (
              <ul className="email-list">
                {emails.map((email) => (
                  <li className="email-item" key={email.id}>
                    <span className="email-sender">{email.sender}</span>
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
            <p>No sent emails available yet.</p>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key) => (
                    <tr key={key.id}>
                      <td>{key.type}</td>
                      <td>{key.id}</td>
                      <td>
                        <button type="button" className="delete-button" onClick={() => handleDeleteKey(key.id)}>
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

        {selectedSection === "account-settings" && (
          <div className="account-settings-section">
            <h2 className="dash">Account Settings</h2>
            <p>m3rf4 hena hyb2a fe eh lessa</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;

