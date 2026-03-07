import { useState } from "react";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand">
          <svg width="40" height="40" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#9bd104ff"/>
            <path d="M7 13l3 3 7-9" stroke="#fff" strokeWidth="1.5"/>
          </svg>

          <div>
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to continue to your dashboard</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>

            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button className="login-btn" type="submit">
            Sign in
          </button>

          <p className="register-text">
            Don't have an account? <a href="/register">Create one</a>

          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
