// app/api/user/balance/route.js
import { connectDB } from '@/lib/db'; // Adjust path based on your structure
import User from '@/models/user'; // Ensure correct path to the User model
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    // Extract email from the query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400 }
      );
    }

    // Find user by email and select the balance
    const user = await User.findOne({ email }).select('balance');

    if (user) {
      // Return user balance if found
      return NextResponse.json({ balance: user.balance }, { status: 200 });
    } else {
      // Return 404 if user not found
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch balance', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    // Parse the request body to get the email and new balance
    const { email, newBalance } = await request.json();

    if (!email || newBalance === undefined) {
      return NextResponse.json(
        { error: 'Email and newBalance are required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user's balance
    user.balance = newBalance;
    await user.save();

    // Return the updated balance
    return NextResponse.json(
      { message: 'Balance updated successfully', balance: user.balance },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update balance', message: error.message },
      { status: 500 }
    );
  }
}
