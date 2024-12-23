import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/home.css";
import HomeHeader from "../components/Home/homeHeader";
import ServicesSection from "../components/Home/ServicesSection";
import ReasonsSection from "../components/Home/ReasonsSection";
import PrivacyPolicySection from "../components/Home/PrivacyPolicySection";
import ContactSection from "../components/Home/ContactSection";
import { 
  faLock, 
  faKey, 
  faFingerprint, 
  faEnvelope, 
  faShieldAlt, 
  faUserCheck 
} from "@fortawesome/free-solid-svg-icons";


const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  const services = [
    {
      title: "Block Cipher Service",
      description:
        "Encrypt your messages securely using AES. Ideal for transmitting sensitive data over insecure channels.",
      details:
        "Our Block Cipher Module provides high-speed encryption for bulk data using industry-standard algorithms.",
      buttonText: "Use Block Cipher",
      icon: faLock,
    },
    {
      title: "Public Key Cryptosystem Service",
      description:
        "Share keys securely with RSA. Enable end-to-end encryption for your communications.",
      details:
        "This module uses public and private key pairs to securely transmit data, ensuring confidentiality.",
      buttonText: "Use Public Key System",
      icon: faKey,
    },
    {
      title: "Hashing Service",
      description:
        "Ensure data integrity with SHA-256. Verify your messages are untampered.",
      details:
        "Hashing ensures that the data remains unaltered by generating unique fingerprints for messages.",
      buttonText: "Use Hashing",
      icon: faFingerprint,
    },
    {
      title: "Key Management Service",
      description:
        "Manage your cryptographic keys securely. Prevent unauthorized access to sensitive data.",
      details:
        "Securely generate, store, and distribute keys with robust algorithms and security measures.",
      buttonText: "Use Key Management",
      icon: faShieldAlt,
    },
    {
      title: "Authentication Service",
      description:
        "Authenticate with password-based or certificate-based mechanisms. Protect your account from unauthorized access.",
      details:
        "Our authentication module uses multi-factor methods to ensure secure access to your accounts and systems.",
      buttonText: "Use Authentication",
      icon: faUserCheck,
    },
    {
      title: "Internet Services Security",
      description:
        "Secure internet services like email using cryptography. Protect sensitive information during transmission.",
      details:
        "Use encryption protocols to ensure your emails, messages, and files remain secure over the internet.",
      buttonText: "Secure Email Services",
      icon: faEnvelope,
    },
  ];

  const privacyPolicies = [
    {
      title: "Data Encryption",
      description: "We encrypt your data to keep it safe from unauthorized access.",
      icon: faLock,
    },
    {
      title: "Secure Authentication",
      description: "Only verified users can access your sensitive information.",
      icon: faKey,
    },
    {
      title: "Data Integrity",
      description: "We ensure your data remains unaltered during transmission.",
      icon: faFingerprint,
    },
    {
      title: "Email Privacy",
      description: "Your email and communications are always confidential.",
      icon: faEnvelope,
    },
    {
      title: "Security Protocols",
      description: "We adhere to the latest security standards to protect your data.",
      icon: faShieldAlt,
    },
    {
      title: "User Consent",
      description: "We collect data only with your explicit consent.",
      icon: faUserCheck,
    },
  ];

  return (
    <div className="home-page">
      <HomeHeader />
      <ServicesSection services={services} />
      <ReasonsSection />
      <PrivacyPolicySection privacyPolicies={privacyPolicies} />
      <ContactSection />
    </div>
  );
};

export default HomePage;
