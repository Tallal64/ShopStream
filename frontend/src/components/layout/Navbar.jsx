import { useAuthStore } from "@/store/auth/useAuthStore";
import { useTheme } from "@/store/theme";
import {
  LayoutDashboard,
  LogIn,
  Moon,
  ShoppingBag,
  Sun,
  UserRoundPlus,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, setTheme } = useTheme();
  
  // Check if the user is an admin
  const isAdmin = user?.role === "admin";

  const handleClick = () => {
    setTheme();
  };

  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <header className="">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">eStore</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleClick}>
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {isAdmin && (
            <Button variant="ghost" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          )}

          {!user && (
            <Button variant="default" asChild>
              <Link to="/login">
                <UserRoundPlus className="w-4 h-4" />
                Login
              </Link>
            </Button>
          )}

          {user && (
            <Button variant="default" onClick={logout}>
              <LogIn className="w-4 h-4" />
              logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
