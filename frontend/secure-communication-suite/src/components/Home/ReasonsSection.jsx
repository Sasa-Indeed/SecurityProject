import React from "react";

const ReasonsSection = () => (
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
);

export default ReasonsSection;
