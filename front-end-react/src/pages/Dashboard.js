import { useEffect, useState } from "react";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [vlogaId, setVlogaId] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedRole = localStorage.getItem("role");
    const savedVlogaId = localStorage.getItem("vloga_id");

    if (savedName && savedRole && savedVlogaId) {
      setName(savedName);
      setRole(savedRole);
      setVlogaId(savedVlogaId);
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>Dobrodošel, {name}!</h1>
        <p>Vloga: {role}</p>
        <p>ID vloge: {vlogaId}</p>
        <button onClick={handleLogout} style={styles.button}>
          Odjava
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: 0,
    padding: 0,
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  box: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  button: {
    marginTop: "1rem",
    background: "#2575fc",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
