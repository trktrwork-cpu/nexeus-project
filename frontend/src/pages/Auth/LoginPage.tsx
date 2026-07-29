import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token,
      );

      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
      }}
    >
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            style={{
              width: "100%",
              padding: "0.5rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            style={{
              width: "100%",
              padding: "0.5rem",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        style={{
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;