import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:7555/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("name", username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("vloga_id", data.vloga_id);
        localStorage.setItem("userId", data.id);

        

        navigate("/dashboard");
      } else {
        setMessage(data.message || "Napaka pri prijavi.");
      }
    } catch (err) {
      setMessage("Napaka pri povezavi na strežnik.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p style={{ color: "red", marginTop: "1rem" }}>{message}</p>
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
    maxWidth: "350px",
  },
};
