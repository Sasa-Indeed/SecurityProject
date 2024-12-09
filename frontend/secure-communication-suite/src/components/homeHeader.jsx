import React, { useState, useEffect } from "react";
import "./../styles/home.css";  

const HomeHeader = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  const typingText = "Welcome to Security Express";

  useEffect(() => {
    if (index < typingText.length) {
      const timer = setTimeout(() => {
        setText((prev) => prev + typingText[index]);
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer); 
    }
  }, [index, typingText]);

  return (
    <header className="home-header">
      <h1>{text}</h1>
      <p data-aos="fade-up" data-aos-delay="200">
        Empowering your data with cutting-edge cryptographic solutions.
      </p>
    </header>
  );
};

export default HomeHeader;
