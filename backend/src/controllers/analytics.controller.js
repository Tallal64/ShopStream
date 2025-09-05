import { Order } from "../models/order.model.js";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const getAnalyticsSummary = async (req, res) => {
  try {
    // 1. Date ranges
    const thisMonthStart = startOfMonth(new Date());
    const thisMonthEnd = endOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    // 2. Current month stats
    const currentStats = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // 3. Previous month stats
    const prevStats = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const current = currentStats[0] || { totalRevenue: 0, totalOrders: 0 };
    const previous = prevStats[0] || { totalRevenue: 0, totalOrders: 0 };

    // 4. Calculate changes (%)
    const calcChange = (curr, prev) => {
      if (prev === 0) return 100; // if no data last month → 100% growth
      return ((curr - prev) / prev) * 100;
    };

    const revenueChange = calcChange(
      current.totalRevenue,
      previous.totalRevenue
    );

    const ordersChange = calcChange(current.totalOrders, previous.totalOrders);

    return res.json({
      success: true,
      summary: {
        totalRevenue: current.totalRevenue,
        revenueChange: {
          value: `${revenueChange.toFixed(1)}%`,
          type: revenueChange >= 0 ? "increase" : "decrease",
        },
        totalOrders: current.totalOrders,
        ordersChange: {
          value: `${ordersChange.toFixed(1)}%`,
          type: ordersChange >= 0 ? "increase" : "decrease",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res.status(500).json({ success: false, error: "Failed to fetch summary" });
  }
};

export const getAnalyticsTrends = async (req, res) => {
  try {
    // Last 6 months including current one
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      months.push({
        label: format(monthDate, "MMMM"), // "January"
        start: startOfMonth(monthDate),
        end: endOfMonth(monthDate),
      });
    }

    // Query each month
    const results = await Promise.all(
      months.map(async (m) => {
        const stats = await Order.aggregate([
          {
            $match: {
              status: "paid",
              createdAt: { $gte: m.start, $lte: m.end },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
            },
          },
        ]);

        return {
          month: m.label,
          totalRevenue: stats[0]?.totalRevenue || 0,
          totalOrders: stats[0]?.totalOrders || 0,
        };
      })
    );

    return res.json({ success: true, trends: results });
  } catch (error) {
    console.error("Error fetching analytics trends:", error);
    res.status(500).json({ success: false, error: "Failed to fetch trends" });
  }
};
