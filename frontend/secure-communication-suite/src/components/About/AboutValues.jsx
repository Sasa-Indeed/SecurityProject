import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faUsers, faLightbulb } from "@fortawesome/free-solid-svg-icons";

const AboutValues = () => (
  <section className="about-values">
    <h2 data-aos="fade-down">Our Core Values</h2>
    <div className="values-grid">
      <div className="value-card" data-aos="zoom-in" data-aos-delay="200">
        <FontAwesomeIcon icon={faAward} className="value-icon" />
        <h3>Excellence</h3>
        <p>
          We strive for excellence in everything we do, delivering high-quality
          solutions for our clients.
        </p>
      </div>
      <div className="value-card" data-aos="zoom-in" data-aos-delay="400">
        <FontAwesomeIcon icon={faUsers} className="value-icon" />
        <h3>Collaboration</h3>
        <p>
          Our team works together and with our clients to ensure the best
          outcomes for every project.
        </p>
      </div>
      <div className="value-card" data-aos="zoom-in" data-aos-delay="600">
        <FontAwesomeIcon icon={faLightbulb} className="value-icon" />
        <h3>Innovation</h3>
        <p>
          We embrace change and continuously explore new technologies to stay
          ahead in the industry.
        </p>
      </div>
    </div>
  </section>
);

export default AboutValues;
