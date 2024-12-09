import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notFound.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary not-found-btn">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

