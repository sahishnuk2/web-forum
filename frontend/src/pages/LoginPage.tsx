import { useEffect, useState } from "react";
import { login } from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
      console.log(data); // remove later
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/topics");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (userId) {
      navigate("/topics");
    }
  }, []);

  return (
    <div className="authentication">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
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
          <button type="submit">LOGIN</button>
          <p>
            Don't have an account?
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
