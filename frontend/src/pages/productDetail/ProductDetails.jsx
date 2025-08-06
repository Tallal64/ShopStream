import AddToCartBtn from "@/components/layout/cart/AddToCartBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductAPIs } from "@/store/product/useProductAPIs";
import {
  Heart,
  Share2,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ProductDetails({ onBack }) {
  const navigate = useNavigate();
  const { getProductById, isLoading } = useProductAPIs();
  const { _id } = useParams();
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Button>
              <div className="text-sm text-muted-foreground">
                Home / {product.category} / {product.title}
              </div>
            </div>
            <Button variant="ghost" size="icon">
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
            <div className="relative overflow-hidden border shadow-lg aspect-square bg-card rounded-3xl group">
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute flex flex-col gap-3 top-6 left-6">
                {product.isNew && (
                  <Badge className="shadow-lg">New Arrival</Badge>
                )}
              </div>

              {/* Heart Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-6 right-6 p-4 rounded-full transition-all duration-300 ${
                  isLiked
                    ? "bg-red-50 text-red-500 scale-110 dark:bg-red-950"
                    : "bg-card/90 text-muted-foreground hover:text-red-500 hover:scale-110"
                } backdrop-blur-sm shadow-lg border`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
              </button>
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
              {product.inStock !== false && (
                <Badge className="px-4 py-2 text-sm">In Stock</Badge>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="mb-4 text-4xl font-bold leading-tight capitalize text-foreground">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </div>

            {/* Description */}
            <div className="p-6 bg-muted rounded-2xl">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <AddToCartBtn
                  product={product}
                  icon={true}
                  size={"lg"}
                  className={
                    "flex-1 h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  }
                />
                <Button
                  variant="outline"
                  className="px-8 transition-all duration-300 h-14 rounded-xl"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-6 pt-8 border-t sm:grid-cols-3">
              <div className="flex items-center gap-3 p-4 border bg-green-50 dark:bg-green-950/20 rounded-xl">
                <Truck className="flex-shrink-0 w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-400">
                    Free Shipping
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    On orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                <RotateCcw className="flex-shrink-0 w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-400">
                    Easy Returns
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-500">
                    30-day return policy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                <Shield className="flex-shrink-0 w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-800 dark:text-purple-400">
                    Warranty
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-500">
                    2-year coverage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
