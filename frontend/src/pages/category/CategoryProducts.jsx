import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductAPIs } from "@/store/product/useProductAPIs";
import { ProductCard } from "@/components/layout/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function CategoryProducts() {
  const { category } = useParams();
  const { categoryProducts, isLoading, getProductsByCategory } =
    useProductAPIs();

  useEffect(() => {
    if (category) {
      getProductsByCategory(category);
    }
  }, [category, getProductsByCategory]);

  // Capitalize first letter of category for display
  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "";

  if (isLoading) {
    // replace with loading skeleton or spinner
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <div className="h-8 bg-muted rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 animate-pulse"
                >
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2">
              {displayCategory} Collection
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our curated selection of {displayCategory.toLowerCase()}{" "}
              fashion
            </p>
          </div>

          {/* Products Grid */}
          {categoryProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any products in the{" "}
                {displayCategory.toLowerCase()} category.
              </p>
              <Link to="/">
                <Button>Browse All Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
