// app/api/user/balance/route.js
import connectDB from '@/lib/db';
import User from '@/models/user';
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
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Ensure the balance is properly formatted as a number with 2 decimal places
    const formattedBalance = parseFloat(user.balance || 0).toFixed(2);
    
    // Return user balance if found
    return NextResponse.json({ 
      balance: parseFloat(formattedBalance),
      rawBalance: formattedBalance 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching balance:', error);
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

    // Format the new balance to ensure it's a proper number with 2 decimal places
    const formattedBalance = parseFloat(newBalance).toFixed(2);
    
    // Update the user's balance
    user.balance = parseFloat(formattedBalance);
    await user.save();

    // Verify the balance was updated correctly by fetching the user again
    const updatedUser = await User.findOne({ email }).select('balance');
    const finalBalance = parseFloat(updatedUser.balance || 0).toFixed(2);

    // Return the updated balance
    return NextResponse.json(
      { 
        message: 'Balance updated successfully', 
        balance: parseFloat(finalBalance),
        rawBalance: finalBalance
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating balance:', error);
    return NextResponse.json(
      { error: 'Failed to update balance', message: error.message },
      { status: 500 }
    );
  }
}