import React from "react";

const InputField = ({ label, type, placeholder }) => {
  return (
    <div className="mb-3">
      <label className="form-label" style={{ color: "#8C6F5E" }}>
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        style={{
          backgroundColor: "#BFAC95",
          border: "1px solid #8C6F5E",
          color: "#191826",
        }}
      />
    </div>
  );
};

export default InputField;

