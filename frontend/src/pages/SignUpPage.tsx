import { useState } from "react";
import { signUp } from "../services/api";
import "./Pages.css";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { Button, CircularProgress, TextField } from "@mui/material";
import { emptyFields } from "../components/common/Functions";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (password.length > 0) {
      const hasMinLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
      return !(hasMinLength && hasUppercase && hasSpecialChar);
    } else {
      return false; // None -> will be blocked by the button
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await signUp(username, password);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
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
              ? "Password must be at least 8 characters, include 1 uppercase & 1 special character"
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
          {loading ? <CircularProgress sx={{ color: "white" }} /> : "SIGN UP"}
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
