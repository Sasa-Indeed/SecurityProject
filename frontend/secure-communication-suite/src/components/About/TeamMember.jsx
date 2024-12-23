import React from "react";

const TeamMember = ({ imgSrc, name, role, delay }) => (
  <div className="team-member" data-aos="flip-up" data-aos-delay={delay}>
    <img src={imgSrc} alt={name} className="team-photo" />
    <h4>{name}</h4>
    <p>{role}</p>
  </div>
);

export default TeamMember;
