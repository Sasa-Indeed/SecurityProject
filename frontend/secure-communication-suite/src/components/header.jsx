import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../styles/header.css';
import '../styles/authStyles.css'

const Header = () => {
    return (
        <Navbar expand="lg" className="custom-navbar" sticky="top">
            <Container>
                <Navbar.Brand href="/" className="brand">
                    Aman
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link href="#about" className="nav-link-custom">About</Nav.Link>
                        <Nav.Link href="/signup" className="nav-link-custom">Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
