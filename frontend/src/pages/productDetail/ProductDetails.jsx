import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/product/useProductStore";
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Plus,
  Minus,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ProductDetails({ onBack, onAddToCart }) {
  const navigate = useNavigate();
  const { getProductById, isLoading } = useProductStore();
  const { _id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (_id) {
        const productData = await getProductById(_id);
        if (productData?.success) {
          setProduct(productData.data);
        }
      }
    };

    fetchProduct();
  }, [_id, getProductById]);

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product._id, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-lg text-muted-foreground">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
          <p className="mb-6 text-muted-foreground">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2 hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative">
            <div className="relative overflow-hidden shadow-lg aspect-square rounded-3xl group">
              <img
                src={product?.image}
                alt={product?.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute flex flex-col gap-3 top-6 left-6">
                {product?.isNew && (
                  <Badge className="bg-green-500 shadow-lg hover:bg-green-600">
                    New Arrival
                  </Badge>
                )}
              </div>

              {/* Heart Button */}
              <Button
                size={"icon"}
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-6 right-6 p-4 rounded-full transition-all duration-300 ${
                  isLiked
                    ? "bg-red-50 text-red-500 scale-110"
                    : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110"
                } backdrop-blur-sm shadow-lg`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Category & Stock */}
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm capitalize"
              >
                {product.category}
              </Badge>
              {product?.inStock !== false && (
                <Badge className="px-4 py-2 text-sm text-green-700 bg-green-100 hover:bg-green-100">
                  In Stock
                </Badge>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground">
                {product?.title}
              </h1>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-foreground">
                  ${product?.price?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {product?.description}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="text-lg font-semibold">Quantity:</span>
                <div className="flex items-center border shadow-sm rounded-xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 hover:bg-gray-50"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="px-6 py-3 min-w-[80px] text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 hover:bg-gray-50"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 text-lg font-semibold transition-all duration-300 shadow-lg h-14 rounded-xl hover:shadow-xl"
                >
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="px-8 transition-all duration-300 border-2 h-14 rounded-xl bg-secondary"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-6 pt-8 border-t sm:grid-cols-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <Truck className="flex-shrink-0 w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Free Shipping</p>
                  <p className="text-sm text-green-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <RotateCcw className="flex-shrink-0 w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">Easy Returns</p>
                  <p className="text-sm text-blue-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <Shield className="flex-shrink-0 w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-800">Warranty</p>
                  <p className="text-sm text-purple-600">2-year coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
