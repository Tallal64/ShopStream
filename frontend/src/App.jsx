import { useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import { useAuthStore } from "./store/auth/useAuthStore";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { user, getCurrentUser, refreshAccessToken, isLoading } =
    useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && !isLoading) {
      const getUser = async () => {
        hasInitialized.current = true;
        const response = await refreshAccessToken();
        if (response?.success) {
          console.log("User refreshed successfully:", response.message);

          await getCurrentUser();
        } else {
          console.error("Failed to refresh user in app.jsx:", response.error);
        }
      };
      getUser();
    }
  }, [isLoading, getCurrentUser, refreshAccessToken]);

  const isAdmin = user?.role === "admin";

  // TODO: remove this console log in production
  console.log("User from store:", user);

  return (
    <div>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={isAdmin ? <Dashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </div>
  );
}
