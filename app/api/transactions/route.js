import { connectMongoDB } from "lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Transaction from "models/transaction";
import Admin from "models/admin";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectMongoDB();
    const transactions = await Transaction.find({}).sort({ createdAt: -1 })
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  console.log('API Route Session:', session);
  console.log('API Route User:', session?.user);
  console.log('API Route User ID:', session?.user?.id);
  console.log('API Route User userId:', session?.user?.userId);
  console.log('API Route User name:', session?.user?.name);
  
  if (!session?.user?.userId) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  let requestBody;
  try {
    requestBody = await request.json();
    if (!requestBody.amount || !requestBody.adminId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { amount, userName, adminId } = requestBody;

  try {
    await connectMongoDB();

    // Get admin details from session
    const admin = await Admin.findOne({adminId});
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found." },
        { status: 404 }
      );
    }

    const discount = amount * 0.1;
    const finalAmount = amount - discount;

    const transaction = await Transaction.create({
      adminId,
      userId: session.user.id || session.user.userId,
      userName,
      amount,
      discount,
      finalAmount,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(
      { success: true, message: "Transaction created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
