import React from "react";

const SubmitButton = ({ label }) => {
  return (
    <button
      type="submit"
      className="btn w-100"
      style={{
        backgroundColor: "#A61B26",
        color: "#D9D7BF",
        fontWeight: "bold",
        border: "none",
      }}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
