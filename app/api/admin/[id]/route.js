import { connectMongoDB } from "lib/mongodb";
import Admin from "models/admin";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();
    const admin = await Admin.findOne({ adminId: id });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found." }, { status: 404 });
    }
    return NextResponse.json({ admin }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching the admin." },
      { status: 500 }
    );
  }
}
