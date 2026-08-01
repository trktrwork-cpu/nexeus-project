import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../services/authService";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await register({
                full_name: fullName,
                email,
                password,
            });

            alert(
                "Registration successful! Please log in.",
            );

            navigate("/login");
        } catch (err: any) {
            const detail = err.response?.data?.detail;

            if (
                Array.isArray(detail) &&
                detail.some(
                    (e: any) =>
                        e.loc?.includes("password") &&
                        e.type?.includes("string_too_short")
                )
            ) {
                setError(
                    "Registration failed. Password needs to be at least 8 characters."
                );
            } else if (detail === "Email already registered") {
                setError("Registration failed. Email is already registered.");
            } else {
                setError("Registration failed.");
            }
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
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Full Name</label>

                    <input
                        type="text"
                        value={fullName}
                        onChange={(event) =>
                            setFullName(event.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                        }}
                    />
                </div>

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
                    {loading
                        ? "Creating account..."
                        : "Register"}
                </button>
            </form>

            <p
                style={{
                    marginTop: "1rem",
                    textAlign: "center",
                }}
            >
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;