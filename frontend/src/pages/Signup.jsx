import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) {
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
  `${API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Signup Successful");

    navigate("/login");
  } catch (error) {
    console.error("Signup error:", error);
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
          width: "450px",
          padding: "30px",
          background: "white",
          borderRadius: "10px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "20px",
          }}
        >
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
          }}
        />

        <input
          type="email"
          placeholder="Email"
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
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
minLength={6}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
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
         {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default Signup;