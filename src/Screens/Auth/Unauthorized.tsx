import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go to the previous page
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🚫 403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={handleGoBack} style={{ marginTop: "1rem" }}>
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
