import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth-admin";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const { session, error } = await getAdminSession();
    if (error) return error;

    await connectDB();

    // Get stats
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // Get total revenue using aggregation
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total ?? 0;

    // Get today's revenue using aggregation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const todayRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrowStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total ?? 0;

    // Get total users
    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalRevenue,
        todayRevenue,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
