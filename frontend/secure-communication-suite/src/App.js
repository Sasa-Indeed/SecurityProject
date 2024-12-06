import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthPage from './pages/authPage';
import Header from './components/header';
import Footer from './components/footer';
import HomePage from './pages/homePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutPage from './pages/aboutPage';



function App() {
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
    <Footer />
  </Router>
  );
}

export default App;
