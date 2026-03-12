import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn , setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        setErrorMessage("");
        setIsLoggedIn(true);
        setCurrentUser(username);
        navigate("/congrats");
      } else if (data.error === "USERNAME_NOT_FOUND") {
        setErrorMessage("Yikes, that username doesn't exist! Here are some things you can try instead: " + data.username.join(", "));
      } else if (data.error === "INCORRECT_PASSWORD") {
        setErrorMessage("Oops, you don't know your own password! Hint: " + data.password);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const fieldStyle = { marginBottom: "20px" };
  const formWrapperStyle = { marginLeft: "70px" };

  return (
    <div style={formWrapperStyle}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <button type="submit">Login</button>
        </div>
      </form>

      {errorMessage && <div style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</div>}

      <div style={fieldStyle}>
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}

export default Login;