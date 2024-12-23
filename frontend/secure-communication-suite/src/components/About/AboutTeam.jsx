import React from "react";
import TeamMember from "./TeamMember";

const AboutTeam = () => (
  <section className="about-team">
    <h2 data-aos="fade-down">Meet Our Team</h2>
    <p data-aos="fade-up" data-aos-delay="200">
      A team of passionate individuals committed to delivering secure and
      scalable solutions.
    </p>
    <div className="team-grid">
      <TeamMember
        imgSrc="https://media.licdn.com/dms/image/v2/D4D03AQFzWOelGRVr8g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706294705699?e=1738800000&v=beta&t=88sWCYU2J__tq-JJSz9RScos7nTbJPYAQkVKBWgxFnU"
        name="Ahmed Sakr"
        role="Lead Developer"
        delay="200"
      />
      <TeamMember
        imgSrc="https://media.licdn.com/dms/image/v2/D4D03AQE-893VwORB-Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1666029973632?e=1738800000&v=beta&t=ItholskjRMkMtVvrXRDnweOJoKb60rLdPdmd6s6Dyfc"
        name="Sasa"
        role="CEO & Founder"
        delay="400"
      />
      <TeamMember
        imgSrc="https://media.licdn.com/dms/image/v2/D4D03AQEJ9tl2cw-Jpg/profile-displayphoto-shrink_800_800/B4DZPVUr1iHUAc-/0/1734450790581?e=1740614400&v=beta&t=lHJUSjv9I4-0bRdauTETk88wnkMTZMDqPYjrGOo5DgE"
        name="Norhan Waleed"
        role="Project Manager"
        delay="600"
      />
    </div>
  </section>
);

export default AboutTeam;
