import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PrivacyPolicySection = ({ privacyPolicies }) => (
  <section className="privacy-policy-section" id="privacy" data-aos="fade-up">
    <h2>Our Privacy Policy</h2>
    <div className="policy-network">
      {privacyPolicies.map((policy, index) => (
        <div
          key={index}
          className="policy-node"
          data-aos="zoom-in"
          data-aos-delay={index * 200}
        >
          <FontAwesomeIcon icon={policy.icon} className="policy-icon" size="2x" />
          <h3>{policy.title}</h3>
          <p>{policy.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default PrivacyPolicySection;
