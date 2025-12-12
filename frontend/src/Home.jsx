import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5" style={{ maxWidth: "720px" }}>
      <div className="card p-4">
        <h1 className="mb-3">Welcome to Hospital System</h1>
        <p className="mb-3">This is a simple patient management demo built with React and Express.</p>
        <ul>
          <li>Signup / Login to manage patients</li>
          <li>Add, edit, and delete patient records</li>
          
        </ul>
        <div className="mt-4">
          <Link to="/app" className="btn btn-primary me-2">Open App</Link>
          
        </div>
      </div>
    </div>
  );
}
