import { useEffect, useState } from "react";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [vlogaId, setVlogaId] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

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

  useEffect(() => {
  if (role === "zdravnik") {
    fetch("http://localhost:7555/users/list", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAllUsers(data.users);
        }
      })
      .catch(() => console.log("Napaka pri pridobivanju pacientov."));
  }
}, [role]);

  

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:7555/users/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("✅ Pacient uspešno dodan.");
        setFormData({ id: "", username: "", email: "", password: "" });
      } else {
        setMessage(result.message || "Napaka pri dodajanju pacienta.");
      }
    } catch (error) {
      setMessage("Napaka pri povezavi s strežnikom.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>Dobrodošel, {name}!</h1>
        <p>Vloga: {role}</p>

        {role === "zdravnik" && (
          <>
            <h2>Dodaj novega pacienta</h2>
            <form onSubmit={handleAddPatient} style={{ textAlign: "left" }}>
              <label>ID:</label>
              <input name="id" value={formData.id} onChange={handleInputChange} required />

              <label>Uporabniško ime:</label>
              <input name="username" value={formData.username} onChange={handleInputChange} required />

              <label>Email:</label>
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />

              <label>Geslo:</label>
              <input name="password" type="password" value={formData.password} onChange={handleInputChange} required />

              <button type="submit" style={{ ...styles.button, marginTop: "1rem" }}>
                Dodaj pacienta
              </button>
            </form>
            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
          
<h2 style={{ marginTop: "2rem" }}>Seznam pacientov</h2>
<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th style={styles.th}>ID</th>
      <th style={styles.th}>Ime</th>
      <th style={styles.th}>Priimek</th>
      <th style={styles.th}>Email</th>
      <th style={styles.th}>Vloga</th>
    </tr>
  </thead>
  <tbody>
    {allUsers.map((user) => (
      <tr key={user.id}>
        <td style={styles.td}>{user.id}</td>
        <td style={styles.td}>{user.ime}</td>
        <td style={styles.td}>{user.priimek}</td>
        <td style={styles.td}>{user.email}</td>
        <td style={styles.td}>{user.vloga_id}</td>
      </tr>
    ))}
  </tbody>
</table>



          
          
          
          </>
        )}
        

        <button onClick={handleLogout} style={{ ...styles.button, background: "#e74c3c" }}>
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
    maxWidth: "450px",
  },
  button: {
    background: "#2575fc",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  th: {
  textAlign: "left",
  padding: "8px",
  borderBottom: "2px solid #ccc",
},
td: {
  padding: "8px",
  borderBottom: "1px solid #eee",
},

};
