import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./../styles/home.css";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        "Encrypt your messages securely using AES or DES. Ideal for transmitting sensitive data over insecure channels.",
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
        "Ensure data integrity with SHA-256 or MD5. Verify your messages are untampered.",
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
      buttonText: "Secure Internet Services",
      icon: faEnvelope,
    },
  ];

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 data-aos="fade-down">Welcome to Security Express</h1>
        <p data-aos="fade-up" data-aos-delay="200">
          Empowering your data with cutting-edge cryptographic solutions.
        </p>
      </header>

      <section className="services-section" id="services">
        <h2 data-aos="fade-down">Explore Our Services</h2>
        <Carousel interval={4000} indicators={true} controls={true} className="services-carousel">
          {services
            .reduce((acc, service, index) => {
              if (index % 2 === 0) acc.push(services.slice(index, index + 2));
              return acc;
            }, [])
            .map((pair, index) => (
              <Carousel.Item key={index}>
                <div className="carousel-row">
                  {pair.map((service, idx) => (
                    <div
                      className="service-card"
                      key={idx}
                      data-aos="zoom-in"
                      data-aos-delay={idx * 200}
                    >
                      <FontAwesomeIcon
                        icon={service.icon}
                        className="service-icon"
                        size="3x"
                      />
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <p className="details">{service.details}</p>
                      <button>{service.buttonText}</button>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))}
        </Carousel>
      </section>

      <section className="why-choose-us" data-aos="fade-up">
        <h2>Why Choose Security Express?</h2>
        <div className="reasons-grid">
          <div className="reason" data-aos="fade-right" data-aos-delay="200">
            <h3>Trusted Expertise</h3>
            <p>
              With years of experience in cryptography, we provide reliable and innovative solutions tailored to your needs.
            </p>
          </div>
          <div className="reason" data-aos="fade-left" data-aos-delay="400">
            <h3>Comprehensive Solutions</h3>
            <p>
              From encryption to authentication, our modules cover all aspects of security, ensuring complete protection.
            </p>
          </div>
          <div className="reason" data-aos="fade-right" data-aos-delay="600">
            <h3>User-Centric Design</h3>
            <p>
              We prioritize user experience with intuitive tools that make implementing security easy and efficient.
            </p>
          </div>
          <div className="reason" data-aos="fade-left" data-aos-delay="800">
            <h3>Future-Ready</h3>
            <p>
              Stay ahead of threats with our cutting-edge technology, designed to evolve with the ever-changing security landscape.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" data-aos="fade-up">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" placeholder="Your Name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" placeholder="Your Email" required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" placeholder="Your Message" rows="5" required></textarea>

          <button type="submit" className="btn-submit">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
