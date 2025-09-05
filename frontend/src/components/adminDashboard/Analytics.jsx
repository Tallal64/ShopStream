import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAdminAnalyticsAPIs } from "@/store/auth/useAdminAnalyticsAPIs";
import { useEffect } from "react";

export default function Analytics() {
  const { summary, trends, fetchAnalyticsSummary, fetchAnalyticsTrends } =
    useAdminAnalyticsAPIs();

  useEffect(() => {
    fetchAnalyticsSummary();
    fetchAnalyticsTrends();
  }, [fetchAnalyticsSummary, fetchAnalyticsTrends]);

  // ✅ Convert trends into chart-friendly format
  const chartData = trends.map((t) => ({
    month: t.month,
    revenue: t.totalRevenue,
    orders: t.totalOrders,
  }));

  // ✅ Config for the chart legend + colors
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-1)",
    },
    orders: {
      label: "Orders",
      color: "var(--chart-2)",
    },
  };

  // ✅ Stats for header cards
  const statsData = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: summary?.totalRevenue,
      icon: DollarSign,
      change: summary?.revenueChange?.value,
      changeType: summary?.revenueChange?.type,
    },
    {
      id: "orders",
      title: "Total Orders",
      value: summary?.totalOrders,
      icon: ShoppingBag,
      change: summary?.ordersChange?.value,
      changeType: summary?.ordersChange?.type,
    },
  ];

  return (
    <>
      {/* header stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsData.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden border bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div
              className={`absolute inset-0 ${
                item.title === "Total Revenue"
                  ? "bg-gradient-to-br from-blue-500/10"
                  : "bg-gradient-to-br from-green-500/10"
              }  to-transparent`}
            />
            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <item.icon
                  className={`w-5 h-5 ${
                    item.title === "Total Revenue"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-foreground">
                {item.value}
              </div>
              <p
                className={`text-sm ${
                  item.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                }  font-medium flex items-center gap-1.5 mt-1`}
              >
                {item.changeType === "increase" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {item.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* chart stats */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <CardDescription>
              Showing growth for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  type="category"
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)} // Jan, Feb, etc.
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#fillRevenue)"
                  stroke="var(--chart-1)"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Area
                  dataKey="orders"
                  type="monotone"
                  fill="url(#fillOrders)"
                  stroke="var(--chart-2)"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Data refreshed monthly <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  Last 6 months
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
