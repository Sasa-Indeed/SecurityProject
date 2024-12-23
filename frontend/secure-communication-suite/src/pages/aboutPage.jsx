import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AboutHeader from "../components/About/AboutHeader";
import AboutMission from "../components/About/AboutMission";
import AboutValues from "../components/About/AboutValues";
import AboutTeam from "../components/About/AboutTeam";
import "../styles/about.css";

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
      <AboutHeader />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
    </div>
  );
};

export default AboutPage;
