import { useState } from "react";
import "../styles/Login.css";

function Register() {

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();

    if(password !== confirmPassword){
      alert("Password not match");
      return;
    }

    console.log("Username:",username);
    console.log("Email:",email);
    console.log("Password:",password);
  }

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="brand">
          <h2>Create Account</h2>
          <p className="subtitle">Register to start using the system</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              className="input-field"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Register
          </button>

          <p className="register-text">
            Already have an account? <a href="/">Login</a>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;
