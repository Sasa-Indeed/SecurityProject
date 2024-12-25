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
import DashboardPage from './pages/dashboardPage';
import GenerateKeyPage from './pages/keyGenerationPage';
import ComposeEmailPage from './pages/emailCompositionPage';
import ViewEmailPage from './pages/emailViewerPage';
import NotFound from './pages/notFoundPage';


function App() {
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/generate-key" element={<GenerateKeyPage />} />
      <Route path="/compose-email" element={<ComposeEmailPage />} />
      <Route path="/view-email/:emailId" element={<ViewEmailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </Router>
  );
}

export default App;
