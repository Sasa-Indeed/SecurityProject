import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ServicesSection = ({ services }) => (
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
);

export default ServicesSection;
