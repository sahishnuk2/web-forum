import { useEffect, useState } from "react";
import { login, validate } from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { TextField, Button } from "@mui/material";
import "./Pages.css";
import { emptyFields } from "../components/common/Functions";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await login(username, password);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/topics");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    async function runValidation() {
      try {
        const data = await validate();
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/topics");
      } catch {
        // No validation means stay at login page
      }
    }
    runValidation();
  }, []);

  return (
    <div className="authentication">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <ErrorMessage error={error} />}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
          autoFocus
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="auth-button"
          disabled={emptyFields(username, password)}
        >
          LOGIN
        </Button>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
