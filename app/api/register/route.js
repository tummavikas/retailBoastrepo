import { connectMongoDB } from "lib/mongodb";
import User from "models/user";
import Admin from "models/admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { name, email, password, role, ...additionalData } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await connectMongoDB();
    
    const userId = uuidv4();
    const adminId = role === 'admin' ? uuidv4() : null;

    if (role === 'admin') {
      await Admin.create({
        ...additionalData,
        name,
        email,
        adminId,
        password: hashedPassword,
        role,
        userId
      });
    }
    
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      userId,
      ...(role === 'admin' && { adminId })
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
