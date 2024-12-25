import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { validateSession, logout } from '../services/api';
import '../styles/header.css';
import '../styles/auth.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
    const interval = setInterval(() => {
      checkSession();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    const isValid = await validateSession();
    setIsLoggedIn(isValid);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="brand">Aman</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" className="nav-link-custom">Home</Nav.Link>
            <Nav.Link href="/about" className="nav-link-custom">About</Nav.Link>
            {isLoggedIn ? (
              <>
                <Nav.Link href="/dashboard" className="nav-link-custom">Dasboard</Nav.Link>
                <Nav.Link onClick={handleLogout} className="nav-link-custom">Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/auth" className="nav-link-custom">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
