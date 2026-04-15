import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/axios";

const TEST_CREDENTIALS = {
  name: "test user",
  email: "test@promptlibrary.dev",
  password: "Prompt@123",
};

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const email = loginData.email.trim().toLowerCase();
    const password = loginData.password;

    try {
      const response = await loginUser({ email, password });
      onLogin(response.user.email);
      navigate("/library");
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Invalid credentials.");
    }
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const name = registerData.name.trim();
    const email = registerData.email.trim().toLowerCase();
    const password = registerData.password;

    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await registerUser({ name, email, password });
      setSuccessMessage("Account created successfully. You can now log in.");
      setLoginData({ email, password: "" });
      setRegisterData({ name: "", email: "", password: "" });
      setMode("login");
    } catch (apiError) {
      setError(apiError.response?.data?.error || "Failed to create account.");
    }
  };

  return (
    <section className="login-wrapper">
      <form
        className="form-card login-card"
        onSubmit={mode === "login" ? handleLogin : handleCreateAccount}
      >
        <h2>{mode === "login" ? "Login" : "Create Account"}</h2>
        <div className="login-toggle">
          <button
            type="button"
            className={mode === "login" ? "active-toggle" : ""}
            onClick={() => {
              setMode("login");
              setError("");
              setSuccessMessage("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active-toggle" : ""}
            onClick={() => {
              setMode("register");
              setError("");
              setSuccessMessage("");
            }}
          >
            Create Account
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {mode === "register" && (
          <>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={registerData.name}
              onChange={handleRegisterChange}
              required
            />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={mode === "login" ? loginData.email : registerData.email}
          onChange={mode === "login" ? handleLoginChange : handleRegisterChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={mode === "login" ? loginData.password : registerData.password}
          onChange={mode === "login" ? handleLoginChange : handleRegisterChange}
          required
        />

        <button type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
      </form>

      <aside className="test-credentials-card">
        <h3>Test Credentials</h3>
        <p>
          <strong>Name:</strong> {TEST_CREDENTIALS.name}
        </p>
        <p>
          <strong>Email:</strong> {TEST_CREDENTIALS.email}
        </p>
        <p>
          <strong>Password:</strong> {TEST_CREDENTIALS.password}
        </p>
        <p className="hint-text">
          Use this account for quick testing, or create your own account from the form.
        </p>
      </aside>
    </section>
  );
}

export default Login;
