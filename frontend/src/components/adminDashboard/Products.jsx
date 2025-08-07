import React, { useEffect } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { useProductAPIs } from "@/store/product/useProductAPIs";

export default function Products() {
  const { adminProducts, getAdminProducts } = useProductAPIs();

  useEffect(() => {
    getAdminProducts();
  }, [getAdminProducts]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10 w-80" />
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {adminProducts.length} products
          </Badge>
        </div>
      </div>

      {/* Products List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Product Rows */}
            {adminProducts.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
              >
                {/* Product Info */}
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate capitalize">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {product._id}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <span className="font-semibold">
                    ${product.price?.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
