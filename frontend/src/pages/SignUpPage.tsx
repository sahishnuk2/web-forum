import { useState } from "react";
import { signUp } from "../services/api";
import "./Pages.css";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { Button, TextField } from "@mui/material";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function passwordsNotMatch(): boolean {
    return verifiedPassword.length > 0 && password !== verifiedPassword;
  }

  function checkPasswordRequirement(): boolean {
    return password.length > 0 && password.length < 8;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signUp(username, password);
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
          error={checkPasswordRequirement()}
          onChange={(e) => setPassword(e.target.value)}
          helperText={
            checkPasswordRequirement()
              ? "Password must be at least 8 characters"
              : ""
          }
          className="auth-input"
        />

        <TextField
          label="Verify Password"
          type="password"
          variant="outlined"
          fullWidth
          value={verifiedPassword}
          error={passwordsNotMatch()}
          onChange={(e) => setVerifiedPassword(e.target.value)}
          helperText={passwordsNotMatch() ? "Password does not match" : ""}
          className="auth-input"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="auth-button"
          disabled={checkPasswordRequirement() || passwordsNotMatch()}
        >
          SIGN UP
        </Button>

        <p className="auth-link">
          Already have an account?
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpPage;
