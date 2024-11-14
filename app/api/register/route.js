import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists!" }, { status: 400 });
    }

    // If user doesn't exist, hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
