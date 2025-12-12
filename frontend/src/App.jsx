import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Auth states
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Patient states
  const [patients, setPatients] = useState([]);
  const [pname, setPname] = useState("");
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [editId, setEditId] = useState("");

  // -------------------------
  // Load Patients
  // -------------------------
  const loadPatients = async () => {
    const res = await axios.get("http://localhost:3000/patients", {
      headers: { Authorization: token }
    });
    setPatients(res.data);
  };

  useEffect(() => {
    if (token) loadPatients();
  }, [token]);

  // -------------------------
  // Signup
  // -------------------------
  const signup = async () => {
    await axios.post("http://localhost:3000/signup", {
      name, email, password
    });
    alert("Signup Done. Now Login.");
    setIsLogin(true);
  };

  // -------------------------
  // Login
  // -------------------------
  const login = async () => {
    const res = await axios.post("http://localhost:3000/login", {
      email, password
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } else {
      alert("Invalid login");
    }
  };

  // -------------------------
  // Add or Edit Patient
  // -------------------------
  const savePatient = async () => {
    if (editId) {
      await axios.put(
        `http://localhost:3000/patients/${editId}`,
        { name: pname, age, disease },
        { headers: { Authorization: token } }
      );
      setEditId("");
    } else {
      await axios.post(
        "http://localhost:3000/patients",
        { name: pname, age, disease },
        { headers: { Authorization: token } }
      );
    }

    setPname("");
    setAge("");
    setDisease("");
    loadPatients();
  };

  // -------------------------
  // Delete
  // -------------------------
  const del = async (id) => {
    await axios.delete(`http://localhost:3000/patients/${id}`, {
      headers: { Authorization: token }
    });
    loadPatients();
  };

  // -------------------------
  // Logout
  // -------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  // -------------------------
  // UI
  // -------------------------
  if (!token)
    return (
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {!isLogin && (
          <input
            className="form-control mb-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={isLogin ? login : signup}
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p className="text-center">
          {isLogin ? "No account?" : "Already have account?"}
          <button
            className="btn btn-link p-0 ms-2"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    );

  return (
    <div className="container mt-4">
      
      {/* Navbar */}
      <div className="d-flex justify-content-between p-3 bg-primary text-white rounded align-items-center">
        <h4 className="m-0">Hospital System</h4>
        <div>
          <Link to="/" className="btn btn-light btn-sm me-2">Home</Link>
          <Link to="/app" className="btn btn-light btn-sm me-2">Patients</Link>
          <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Add/Edit */}
      <div className="card p-3 mt-4">
        <h5>{editId ? "Edit Patient" : "Add Patient"}</h5>

        <input className="form-control mb-2" placeholder="Name"
          value={pname} onChange={(e) => setPname(e.target.value)} />

        <input className="form-control mb-2" placeholder="Age"
          value={age} onChange={(e) => setAge(e.target.value)} />

        <input className="form-control mb-2" placeholder="Disease"
          value={disease} onChange={(e) => setDisease(e.target.value)} />

        <button className="btn btn-success" onClick={savePatient}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Patient Table */}
      <table className="table table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>Name</th><th>Age</th><th>Disease</th><th>Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.disease}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditId(p._id);
                    setPname(p.name);
                    setAge(p.age);
                    setDisease(p.disease);
                  }}>
                  Edit
                </button>

                <button className="btn btn-danger btn-sm"
                  onClick={() => del(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default App;
