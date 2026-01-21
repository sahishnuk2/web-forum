import { useState } from "react";
import { resetPassword } from "../services/api";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { Button, CircularProgress, TextField } from "@mui/material";
import { emptyFields } from "../components/common/Functions";

function ResetPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function passwordsNotMatch(): boolean {
    return verifiedPassword.length > 0 && newPassword !== verifiedPassword;
  }

  function notFulfillPasswordRequirement(): boolean {
    if (newPassword.length > 0) {
      const hasMinLength = newPassword.length >= 8;
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);
      return !(hasMinLength && hasUppercase && hasSpecialChar);
    } else {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await resetPassword(oldPassword, newPassword);
      navigate("/topics");
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
        <h1>Reset Password</h1>
        {error && <ErrorMessage error={error} />}

        <TextField
          label="Old Password"
          type="password"
          variant="outlined"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="auth-input"
          autoFocus
        />

        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={newPassword}
          error={notFulfillPasswordRequirement()}
          onChange={(e) => setNewPassword(e.target.value)}
          helperText={
            notFulfillPasswordRequirement()
              ? "Password must be at least 8 characters, include 1 uppercase & 1 special character"
              : ""
          }
          className="auth-input"
        />

        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={verifiedPassword}
          error={passwordsNotMatch()}
          onChange={(e) => setVerifiedPassword(e.target.value)}
          helperText={passwordsNotMatch() ? "Password does not match" : ""}
          className="auth-input"
        />
        <div className="submissions">
          <Button type="button" onClick={() => navigate(`/topics`)}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={
              emptyFields(oldPassword, newPassword, verifiedPassword) ||
              notFulfillPasswordRequirement() ||
              passwordsNotMatch()
            }
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Reset"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
