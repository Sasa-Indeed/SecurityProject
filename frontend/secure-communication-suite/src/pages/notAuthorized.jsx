import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notFound.css';

const NotAuthPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">401</h1>
        <p className="not-found-subtitle">Oops! You're not authorized to view this page.</p>
        <Link to="/auth" className="btn btn-primary not-found-btn">
          Login
        </Link>
      </div>
    </div>
  );
};

export default NotAuthPage;
