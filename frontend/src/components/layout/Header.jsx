import { useAuthStore } from "@/store/auth/useAuthStore";
import { useProductStore } from "@/store/product/useProductStore";
import { useTheme } from "@/store/theme";
import {
  LayoutDashboard,
  LogIn,
  Moon,
  ShoppingBag,
  ShoppingCart,
  Sun,
  UserRoundPlus,
} from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { cart, getItemsFromCart } = useProductStore();
  const { isDarkMode, setTheme } = useTheme();

  const isAdmin = user?.role === "admin";

  const cartItemCount =
    cart?.reduce((total, item) => {
      return item?.product ? total + (item.quantity || 0) : total;
    }, 0) || 0;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        await getItemsFromCart();
      }
    };

    fetchCartItems();
  }, [user, getItemsFromCart]);

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
          <span className="text-xl font-bold">
            shop<span className="text-primary">Stream</span>
          </span>
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

          <Button
            asChild
            variant={"secondary"}
            className="relative flex items-center gap-2"
          >
            <Link to="/cart">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {!user ||
                (cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                ))}
            </Link>
          </Button>

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
