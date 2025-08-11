import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, Edit, Loader2, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { useProductAPIs } from "@/store/product/useProductAPIs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import UpdateProductForm from "./UpdateProductForm";

export default function Products() {
  const [deletingProduct, setDeletingProduct] = useState(null | "");
  const [open, setOpen] = useState(false);

  const { adminProducts, getAdminProducts, deleteProduct } = useProductAPIs();

  useEffect(() => {
    getAdminProducts();
  }, [getAdminProducts]);

  const handleDeleteProduct = async (productId) => {
    const response = await deleteProduct(productId);
    setDeletingProduct(productId);

    if (!response.success) {
      setDeletingProduct(null);
    }
    getAdminProducts();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
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
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium bg-muted/50 text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Product Rows */}
            {adminProducts?.map((product) => (
              <div
                key={product._id}
                className="grid items-center grid-cols-12 gap-4 p-4 transition-colors hover:bg-muted/30"
              >
                {/* Product Info */}
                <div className="flex items-center col-span-6 gap-3">
                  <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium capitalize truncate">
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
                <div className="flex items-center justify-end col-span-1 gap-1">
                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setOpen(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  {/* Edit modal */}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent
                      className="max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 overflow-y-auto max-h-[95vh]"
                      aria-describedby="edit-product-description"
                    >
                      <DialogHeader className="sr-only">
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      <div className="p-3 sm:p-4 md:p-6">
                        <UpdateProductForm
                          _id={product._id}
                          title={product.title}
                          price={product.price}
                          category={product.category}
                          description={product.description}
                          onCancel={() => setOpen(false)}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Delete  */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingProduct === product._id}
                      >
                        {deletingProduct === product._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-destructive/20">
                      <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center p-4 rounded-full bg-destructive/10">
                            <AlertTriangle className="w-6 h-6 text-destructive" />
                          </div>
                          <div>
                            <AlertDialogTitle className="text-destructive">
                              Delete Product?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-2">
                              Are you sure you want to delete{" "}
                              <span className="font-medium">
                                "{product.title}"
                              </span>
                              ? This action cannot be undone.
                            </AlertDialogDescription>
                          </div>
                        </div>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deletingProduct === product._id}
                        >
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Product
                          </>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
