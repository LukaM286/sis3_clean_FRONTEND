import { useEffect, useState } from "react";



export default function Dashboard() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [vlogaId, setVlogaId] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userId, setUserId] = useState(null);

  const [ckzData, setCkzData] = useState([]);


  const [mojKarton, setMojKarton] = useState(null);
  const [mojPoziv, setMojPoziv] = useState([]);

  const [kartonMsg, setKartonMsg] = useState("");

  const [obravnave, setObravnave] = useState([]);
  const [diagnoze, setDiagnoze] = useState([]);
  const [selectedObravnava, setSelectedObravnava] = useState(null);
  const [deleteKartonId, setDeleteKartonId] = useState("");
  const [deleteKartonMsg, setDeleteKartonMsg] = useState("");


  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [mojeObravnave, setMojeObravnave] = useState([]);

  useEffect(() => {
  if (role === "pacient" && userId) {
    fetch(`http://localhost:7555/users/obravnava/${userId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMojeObravnave(data.obravnave);
        }
      })
      .catch(() => console.log("Napaka pri pridobivanju obravnav."));
  }
}, [role, userId]);

  const handleShowDiagnoze = (obravnavaId) => {
    fetch(`/users/obravnava/${obravnavaId}/diagnoze`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDiagnoze(data.diagnoze);
          setSelectedObravnava(obravnavaId);
        } else {
          setDiagnoze([]);
        }
      })
      .catch(() => setDiagnoze([]));
  };

  


  

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedRole = localStorage.getItem("role");
    const savedVlogaId = localStorage.getItem("vloga_id");
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);

    

    if (savedName && savedRole && savedVlogaId) {
      setName(savedName);
      setRole(savedRole);
      setVlogaId(savedVlogaId);
    } else {
      window.location.href = "/";
    }
  }, []);

useEffect(() => {
  if (role === "pacient" && userId) {
    fetch("http://localhost:7555/users/poziv", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMojPoziv(data.pozivi); 
        }
      })
      .catch(() => console.log("Napaka pri pridobivanju pozivov."));
  }
}, [role, userId]);


  useEffect(() => {
  if (role === "pacient" && userId) {
    fetch(`http://localhost:7555/users/karton/${userId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMojKarton(data.karton);
        }
      })
      .catch(() => console.log("Napaka pri pridobivanju kartona."));
  }
}, [role, userId]);


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



const [kartoni, setKartoni] = useState([]);

useEffect(() => {
  if (role === "zdravnik") {
    fetch("http://localhost:7555/users/kartoni", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setKartoni(data.kartoni);
        }
      })
      .catch(() => console.log("Napaka pri pridobivanju kartonov."));
  }
}, [role]);

const [novaObravnava, setNovaObravnava] = useState({
  id: "",
  karton_id: "",
  tip_obravnave: "",
  opis: "",
  datum: "",
  izvajalec_id: "",
  pacient_id: ""
});

const [obravnavaMsg, setObravnavaMsg] = useState("");


const handleAddObravnava = async (e) => {
  e.preventDefault();
  setObravnavaMsg("");

  try {
    const res = await fetch("http://localhost:7555/users/addObravnava", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(novaObravnava)
    });

    const result = await res.json();

    if (result.success) {
      setObravnavaMsg("Obravnava uspešno dodana.");
      setNovaObravnava({
        id: "",
        karton_id: "",
        tip_obravnave: "",
        opis: "",
        datum: "",
        izvajalec_id: "",
        pacient_id: ""
      });
    } else {
      setObravnavaMsg(result.message || "Napaka.");
    }
  } catch {
    setObravnavaMsg("Napaka pri povezavi.");
  }
};




  

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
        <p>ID: {userId}</p>


        {role === "CKZ" && (
          <> <h2>CKZ DELA</h2>
                 </>
        )}

        {role === "zdravnik" && (
          <>
            <h2>Dodaj novega pacienta</h2>
            <form onSubmit={handleAddPatient} style={{ textAlign: "left" }}>
              
              <label>ID:</label>
              <br></br>
              <input name="id" value={formData.id} onChange={handleInputChange} required />
              <br></br>
              <br></br>
              <label>Uporabniško ime:</label>
              <br></br>
              <input name="username" value={formData.username} onChange={handleInputChange} required />
              <br></br>
              <br></br>
              <label>Email:</label>
              <br></br>
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              <br></br>
              <br></br>
              <label>Geslo:</label>
              <br></br>
              <input name="password" type="password" value={formData.password} onChange={handleInputChange} required />
              <br></br>
              
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




<h2 style={{ marginTop: "2rem" }}>Seznam elektronskih kartonov</h2>
<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th style={styles.th}>Karton ID</th>
      <th style={styles.th}>Pacient ID</th>
      <th style={styles.th}>Tezave</th>
      <th style={styles.th}>Samomeritve</th>
      <th style={styles.th}>Zdravila</th>
      
    </tr>
  </thead>
  <tbody>
    {kartoni.map((karton) => (
      <tr key={karton.id}>
        <td style={styles.td}>{karton.id}</td>
        <td style={styles.td}>{karton.pacient_id}</td>
        <td style={styles.td}>{karton.tezave || "-"}</td>
        <td style={styles.td}>{karton.samomeritve || "-"}</td>
         <td style={styles.td}>{karton.zdravila || "-"}</td>
      </tr>
    ))}
  </tbody>

</table>
<br></br>

<h3 style={{ marginTop: "2rem" }}>Izbriši karton po ID-ju</h3>
<form
  onSubmit={async (e) => {
    e.preventDefault();
    setDeleteKartonMsg("");

    try {
      const res = await fetch("http://localhost:7555/users/kartoni/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: deleteKartonId }),
      });

      const result = await res.json();

      if (result.success) {
        setDeleteKartonMsg("✅ Karton uspešno izbrisan.");
        setDeleteKartonId("");

        const refresh = await fetch("http://localhost:7555/users/kartoni", {
          credentials: "include",
        });
        const data = await refresh.json();
        if (data.success) setKartoni(data.kartoni);
      } else {
        setDeleteKartonMsg(result.message || "Napaka.");
      }
    } catch {
      setDeleteKartonMsg("Napaka pri povezavi s strežnikom.");
    }
  }}
>
  <label>ID kartona za izbris:</label>
  <br />
  <input
    type="number"
    required
    value={deleteKartonId}
    onChange={(e) => setDeleteKartonId(e.target.value)}
  />
  <br />
  <button type="submit" style={{ ...styles.button, marginTop: "1rem", background: "#e74c3c" }}>
    Izbriši karton
  </button>
</form>
<p style={{ fontWeight: "bold", color: deleteKartonMsg.includes("✅") ? "green" : "red" }}>
  {deleteKartonMsg}
</p>




<br></br>
<form onSubmit={handleAddObravnava}>
  <br></br>
  <label>ID obravnave:</label>
  <br></br>
  <input required value={novaObravnava.id} onChange={e => setNovaObravnava({ ...novaObravnava, id: e.target.value })} />
<br></br>
  <label>ID kartona (Elektronski Karton):</label>
  <br></br>
  <input required value={novaObravnava.karton_id} onChange={e => setNovaObravnava({ ...novaObravnava, karton_id: e.target.value })} />
<br></br>
  <label>Tip obravnave:</label>
  <br></br>
  <input required value={novaObravnava.tip_obravnave} onChange={e => setNovaObravnava({ ...novaObravnava, tip_obravnave: e.target.value })} />
<br></br>
  <label>Opis:</label>
  <br></br>
  <textarea required rows="4" value={novaObravnava.opis} onChange={e => setNovaObravnava({ ...novaObravnava, opis: e.target.value })}></textarea>
<br></br>
  <label>Datum:</label>
  <br></br>
  <input type="date" required value={novaObravnava.datum} onChange={e => setNovaObravnava({ ...novaObravnava, datum: e.target.value })} />
    <br></br>
  <label>Vaš ID izvajalca (zdravnika):</label>
  <br></br>
  <input required value={novaObravnava.izvajalec_id} onChange={e => setNovaObravnava({ ...novaObravnava, izvajalec_id: e.target.value })} />
<br></br>
  <label>ID pacienta (Tabela Pacientov):</label>
  <br></br>
  <input required value={novaObravnava.pacient_id} onChange={e => setNovaObravnava({ ...novaObravnava, pacient_id: e.target.value })} />
<br></br>

  <button type="submit">Dodaj obravnavo</button>
</form>




<p style={{ marginTop: "1rem", fontWeight: "bold" }}>{obravnavaMsg}</p>


    


          
          
          
          </>
        )}

        {role === "pacient" && mojKarton ? (
  <>
    <h2>Moje obravnave</h2>
    {mojeObravnave.length === 0 ? (
      <p>Ni najdenih obravnav.</p>
    ) : (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Karton ID</th>
            <th style={styles.th}>Tip</th>
            <th style={styles.th}>Opis</th>
            <th style={styles.th}>Datum</th>
            <th style={styles.th}>Izvajalec ID</th>
          </tr>
          
        </thead>
        <tbody>
          {mojeObravnave.map((obravnava) => (
            <tr key={obravnava.id}>
              <td style={styles.td}>{obravnava.id}</td>
              <td style={styles.td}>{obravnava.karton_id}</td>
              <td style={styles.td}>{obravnava.tip_obravnave}</td>
              <td style={styles.td}>{obravnava.opis}</td>
              <td style={styles.td}>{obravnava.datum}</td>
              <td style={styles.td}>{obravnava.izvajalec_id}</td>
            </tr>
          ))}
        </tbody>
      </table>



      
    )}

    <h2>Moji Pozivi</h2>
    {mojPoziv.length === 0 ? (
      <p>Ni najdenih pozivov.</p>
    ) : (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Prejemnik_ID</th>
            <th style={styles.th}>Izdajatelj_ID</th>
            <th style={styles.th}>Datum</th>
            <th style={styles.th}>Razlog</th>
            
          </tr>
          
        </thead>
        <tbody>
          {mojPoziv.map((poziv) => (
            <tr key={poziv.id}>
              <td style={styles.td}>{poziv.id}</td>
              <td style={styles.td}>{poziv.prejemnik_id}</td>
              <td style={styles.td}>{poziv.izdajatelj_id}</td>
              <td style={styles.td}>{poziv.datum}</td>
              <td style={styles.td}>{poziv.razlog}</td>
            </tr>
          ))}
        </tbody>
      </table>



      
    )}




    


        <h2>Moj elektronski karton</h2>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setKartonMsg("");
        try {
          const res = await fetch(`http://localhost:7555/users/karton/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(mojKarton),
          });
          const result = await res.json();
          if (result.success) {
            setKartonMsg("✅ Karton uspešno posodobljen.");
          } else {
            setKartonMsg(result.message || "Napaka.");
          }
        } catch {
          setKartonMsg("Napaka pri povezavi.");
        }
      }}
    >
      <label>Težave:</label>
      <br />
      <textarea
        value={mojKarton.tezave || ""}
        onChange={(e) => setMojKarton({ ...mojKarton, tezave: e.target.value })}
      />
      <br />

      <label>Samomeritve:</label>
      <br />
      <textarea
        value={mojKarton.samomeritve || ""}
        onChange={(e) => setMojKarton({ ...mojKarton, samomeritve: e.target.value })}
      />
      <br />

      <label>Zdravila:</label>
      <br />
      <textarea
        value={mojKarton.zdravila || ""}
        onChange={(e) => setMojKarton({ ...mojKarton, zdravila: e.target.value })}
      />
      <br />


      <button type="submit" style={styles.button}>Shrani spremembe</button>
    </form>
    <p>{kartonMsg}</p>







  </>
) : ( role === "pacient" && <p>Nalaganje kartona...</p>)}

        

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
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  },
  box: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "900px",  
    marginBottom: "2rem",
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
  tableContainer: {
    width: "100%", 
    overflowX: "auto",
    marginBottom: "2rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",  
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    borderBottom: "2px solid #2575fc",
    backgroundColor: "#e8f0fe",
    color: "#2575fc",
    fontWeight: "600",
    whiteSpace: "nowrap",  
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap", 
  },
  trHover: {
    transition: "background-color 0.2s ease",
  },
  trHoverHover: {
    backgroundColor: "#f1f7ff",
  },




};
