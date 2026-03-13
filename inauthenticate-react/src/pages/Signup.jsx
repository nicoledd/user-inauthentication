import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMessage("Username cannot be empty.");
      return;
    }

    if (!cleanPassword) {
      setErrorMessage("Password cannot be empty.");
      return;
    }

    if(password !== confirmPassword){
        setErrorMessage("Passwords do not match!");
        return;
    }

    const res = await fetch("https://user-inauthentication.onrender.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) {
      navigate("/");
    }
  };

  const fieldStyle = { marginBottom: "20px" };
  const formWrapperStyle = { marginLeft: "70px" };

  return (
    <div style={formWrapperStyle}>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            />
        </div>

        <div style={fieldStyle}>
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
        </div>

        <div style={fieldStyle}>
            <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            />
        </div>

        <div style={fieldStyle}>
            <button type="submit">Create Account</button>
        </div>
      </form>
      {errorMessage && <div style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</div>}
      <div style={fieldStyle}>
        <Link to="/">Already have an account? Login</Link>
      </div>
    </div>
  );
}

export default Signup;
