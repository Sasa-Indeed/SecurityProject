import React from "react";

const ContactSection = () => (
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
);

export default ContactSection;
