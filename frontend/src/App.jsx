import { useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Header";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/home";
import { useAuthStore } from "./store/auth/useAuthStore";
import Dashboard from "./pages/dashboard";
import CategoryProducts from "./pages/category/CategoryProducts";
import { ProductDetails } from "./pages/productDetail/ProductDetails";
import { Cart } from "./components/layout/cart/Cart";

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
          console.warn("refreshAccessToken Failed: ", response.error);
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

          <Route path="/:category" element={<CategoryProducts />} />
          <Route path="/product/:_id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </div>
  );
}
