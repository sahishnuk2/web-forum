import { useState } from "react";
import { signUp } from "../services/api";
import "./Authentication.css";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

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
          {error && (
            <Alert
              variant="outlined"
              severity="error"
              sx={{
                color: "red",
                borderColor: "red",
                mb: 1,
                "& .MuiAlert-icon": {
                  color: "red",
                },
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              {error}
            </Alert>
          )}
          <button type="submit">SIGN UP</button>
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
