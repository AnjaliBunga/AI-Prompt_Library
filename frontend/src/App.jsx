import { useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faPlus, faRightFromBracket, faUserPen } from "@fortawesome/free-solid-svg-icons";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Create from "./pages/Create";
import Login from "./pages/Login";
import MyPrompts from "./pages/MyPrompts";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [currentUserEmail, setCurrentUserEmail] = useState(localStorage.getItem("userEmail") || "");

  const handleLogin = (email) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    setIsAuthenticated(true);
    setCurrentUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setCurrentUserEmail("");
    navigate("/");
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="app-shell">
      <header className="header">
        <h1>AI Prompt Library</h1>
        {isAuthenticated && (
          <nav>
            <Link to="/library">
              <FontAwesomeIcon icon={faBookOpen} className="inline-icon" />
              Library
            </Link>
            <Link to="/my-prompts">
              <FontAwesomeIcon icon={faUserPen} className="inline-icon" />
              My Prompts
            </Link>
            <Link to="/add">
              <FontAwesomeIcon icon={faPlus} className="inline-icon" />
              Add Prompt
            </Link>
            <button className="logout-btn" onClick={handleLogout} type="button">
              <FontAwesomeIcon icon={faRightFromBracket} className="inline-icon" />
              Logout
            </button>
          </nav>
        )}
      </header>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/library" replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Home currentUserEmail={currentUserEmail} />
              </ProtectedRoute>
            }
          />
          <Route path="/prompts" element={<Navigate to="/library" replace />} />
          <Route
            path="/my-prompts"
            element={
              <ProtectedRoute>
                <MyPrompts currentUserEmail={currentUserEmail} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompts/:id"
            element={
              <ProtectedRoute>
                <Detail currentUserEmail={currentUserEmail} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route path="/add-prompt" element={<Navigate to="/add" replace />} />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/library" : "/"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
