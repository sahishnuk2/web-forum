import { useState } from "react";
import { signUp } from "../services/api";
import "./Pages.css";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { Button, TextField } from "@mui/material";
import { emptyFields } from "../components/common/Functions";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function notFulfillUsername(): boolean {
    return (
      username.length > 0 && !(username.length >= 3 && username.length <= 50)
    );
  }

  function passwordsNotMatch(): boolean {
    return verifiedPassword.length > 0 && password !== verifiedPassword;
  }

  function notFulfillPasswordRequirement(): boolean {
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
          error={notFulfillUsername()}
          onChange={(e) => setUsername(e.target.value)}
          helperText={
            notFulfillUsername()
              ? "Username length must be between 3 to 50 "
              : ""
          }
          className="auth-input"
          autoFocus
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          error={notFulfillPasswordRequirement()}
          onChange={(e) => setPassword(e.target.value)}
          helperText={
            notFulfillPasswordRequirement()
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
          disabled={
            emptyFields(username, password, verifiedPassword) ||
            notFulfillUsername() ||
            notFulfillPasswordRequirement() ||
            passwordsNotMatch()
          }
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
