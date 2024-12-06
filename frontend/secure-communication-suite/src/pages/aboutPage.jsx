import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./../styles/about.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faUsers, faLightbulb } from "@fortawesome/free-solid-svg-icons";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="about-page">
      <header className="about-header">
        <h1 data-aos="fade-down">About Us</h1>
        <p data-aos="fade-up" data-aos-delay="200">
          Empowering innovation through secure and intuitive solutions.
        </p>
      </header>

      <section className="about-mission">
        <div className="mission-content" data-aos="fade-right">
          <h2>Our Mission</h2>
          <p>
            At Security Express, we aim to provide cutting-edge cryptographic
            solutions that prioritize security, user experience, and reliability.
          </p>
        </div>
        <div className="mission-image" data-aos="fade-left">
          <img
            src='https://blog.centretechnologies.com/hubfs/01-cybersecurity-101-what-is-it-and-why-is-it-important.jpg'
            alt="Our Mission"
            className="responsive-image"
          />
        </div>
      </section>

      <section className="about-values">
        <h2 data-aos="fade-down">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card" data-aos="zoom-in" data-aos-delay="200">
            <FontAwesomeIcon icon={faAward} className="value-icon" />
            <h3>Excellence</h3>
            <p>
              We strive for excellence in everything we do, delivering
              high-quality solutions for our clients.
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
              We embrace change and continuously explore new technologies to
              stay ahead in the industry.
            </p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2 data-aos="fade-down">Meet Our Team</h2>
        <p data-aos="fade-up" data-aos-delay="200">
          A team of passionate individuals committed to delivering secure and
          scalable solutions.
        </p>
        <div className="team-grid">
          <div className="team-member" data-aos="flip-up" data-aos-delay="200">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D03AQFzWOelGRVr8g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706294705699?e=1738800000&v=beta&t=88sWCYU2J__tq-JJSz9RScos7nTbJPYAQkVKBWgxFnU"
              alt="Team Member"
              className="team-photo"
            />
            <h4>Ahmed Sakr</h4>
            <p>Lead Developer</p>
          </div>
          <div className="team-member" data-aos="flip-up" data-aos-delay="400">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D03AQE-893VwORB-Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1666029973632?e=1738800000&v=beta&t=ItholskjRMkMtVvrXRDnweOJoKb60rLdPdmd6s6Dyfc"
              alt="Team Member"
              className="team-photo"
            />
            <h4>Sasa</h4>
            <p>CEO & Founder</p>
          </div>
          <div className="team-member" data-aos="flip-up" data-aos-delay="600">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D03AQGqgoDTqnZWXA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1699627661771?e=1738800000&v=beta&t=jNmfV58cDHy7LNlHP3L-TmgtND4X9vPFPsb1vsoDKJ0"
              alt="Team Member"
              className="team-photo"
            />
            <h4>Norhan Waleed</h4>
            <p>Project Manager</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
