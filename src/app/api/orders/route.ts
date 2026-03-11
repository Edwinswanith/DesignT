import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Payment } from "@/models/Payment";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Generate order number
    const orderNumber = `TS${Date.now().toString().slice(-8)}`;

    // Create order document
    const order = new Order({
      orderNumber,
      ...body,
    });

    const savedOrder = await order.save();

    // Create payment record
    if (body.customerEmail || body.userEmail) {
      const userEmail = body.userEmail || body.customerEmail;

      const payment = new Payment({
        orderId: savedOrder._id,
        orderNumber,
        amount: body.totalAmount,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus || "pending",
        userEmail,
      });
      await payment.save();

      // Only increment totalOrders if user already exists (logged in before)
      // Don't create new users from order emails
      await User.updateOne(
        { email: userEmail },
        { $inc: { totalOrders: 1 } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: savedOrder._id.toString(),
        orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage || "Failed to create order" },
      { status: 500 }
    );
  }
}
