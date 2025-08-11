import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TrendingUp, Package, Plus } from "lucide-react";
import CreateProductForm from "./CreateProductForm";
import Products from "./Products";
import Analytics from "./Analytics";

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border shadow-sm">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Product
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <Analytics />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Products />
          </TabsContent>

          {/* Create Product Tab */}
          <TabsContent value="create" className="space-y-6">
            <CreateProductForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
