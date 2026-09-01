import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) {
    return;
  }

  setLoading(true);

  try {
   const response = await fetch(
  `${API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Save authentication data
  login(data.user, data.token);

navigate("/");

  } catch (error) {
    console.error("Login error:", error);
    alert("Unable to connect to the server");
  }
  finally {
  setLoading(false);
}
};

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "60px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          background: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#2e7d32",
          }}
        >
          Login
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2e7d32",
            color: "white",
            border: "none",
           cursor: loading ? "not-allowed" : "pointer",
          }}
        >
           {loading ? "Logging in..." : "Login"}
        </button>

        <p
  style={{
    marginTop: "15px",
    textAlign: "center",
  }}
>
  Don't have an account?

  <Link to="/signup">
    Sign Up
  </Link>
</p>

      </form>
    </div>
  );
}

export default Login;