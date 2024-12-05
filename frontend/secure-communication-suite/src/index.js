import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthPage from './pages/authPage';
import Header from './components/header';
import Footer from './components/footer';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <Header/>
    <AuthPage />
    <Footer/>
    </>
);

