import { connectMongoDB } from "lib/mongodb";
import User from "models/user";
import Admin from "models/admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { name, email, password, role = 'user', ...additionalData } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await connectMongoDB();

    if (role === 'admin') {
      await Admin.create({
        ...additionalData,
        name,
        email,
        password: hashedPassword,
        adminId :uuidv4()
      });
    }
    else{
    await User.create({
      name,
      email,
      phone: additionalData.phone || '', // Add phone number
      password: hashedPassword,
      role
    })};

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
