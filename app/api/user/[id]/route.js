import User from '@/models/user'; 
import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    const user = await User.findById(id)
      .select('subscriptionStatus subscriptionId balance role lastLogin isDeleted');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    if (user.isDeleted) {
      return NextResponse.json({ error: "User account is deactivated" }, { status: 403 });
    }

    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus,
      subscriptionId: user.subscriptionId,
      balance: user.balance,
      role: user.role,
      lastLogin: user.lastLogin
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
