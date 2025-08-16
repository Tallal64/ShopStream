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
import Success from "./pages/order/Success";
import Cancel from "./pages/order/Cancel";

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
          await getCurrentUser();
        } else {
          console.warn("refreshAccessToken Failed: ", response.error);
        }
      };
      getUser();
    }
  }, [isLoading, getCurrentUser, refreshAccessToken]);

  const isAdmin = user?.role === "admin";

  return (
    <div>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* auth */}
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

          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </div>
    </div>
  );
}
