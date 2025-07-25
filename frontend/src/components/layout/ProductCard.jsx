import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("clicked");
    // Add your cart logic here
  };
  return (
    <Link to={`/product/${product._id}`}>
      <Card
        className="relative overflow-hidden transition-all duration-500 transform border-0 shadow-sm cursor-pointer group hover:shadow-2xl hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-square rounded-t-xl">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
          />

          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg bg-white/90 backdrop-blur-sm">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-semibold leading-tight transition-colors duration-300 text-foreground line-clamp-2 group-hover:text-primary">
            {product.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs tracking-wide uppercase text-muted-foreground">
                Best Price
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-2"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ${
            isHovered ? "w-full" : "w-0"
          }`}
        />
      </Card>
    </Link>
  );
}
