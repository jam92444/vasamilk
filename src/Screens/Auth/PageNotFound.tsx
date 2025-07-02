import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>404 - Page Not Found</h1>
        <p style={styles.description}>
          Sorry, the page you are looking for does not exist.
        </p>
        <button onClick={handleGoBack} style={styles.button}>
          Go Back
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "2rem",
  },
  card: {
    textAlign: "center",
    padding: "3rem 2rem",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "480px",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#343a40",
  },
  description: {
    fontSize: "1rem",
    color: "#6c757d",
    marginBottom: "2rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#1890ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default PageNotFound;
