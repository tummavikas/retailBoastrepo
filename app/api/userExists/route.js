import { connectMongoDB } from "lib/mongodb";
import User from "models/user";
import Admin from "models/admin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectMongoDB();
    
    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });
    
    return NextResponse.json({ 
      exists: !!(user || admin) 
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while checking user." },
      { status: 500 }
    );
  }
}
