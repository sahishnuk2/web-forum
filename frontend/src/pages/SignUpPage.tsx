import { useState, useEffect } from "react";
import { signUp } from "../services/api";
import "./Authentication.css";
import { Link, useNavigate } from "react-router-dom";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await signUp(username, password);
      console.log(data);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="authentication">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="input">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="buttons">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Sign Up</button>
          <p>
            Already have an account?
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;
