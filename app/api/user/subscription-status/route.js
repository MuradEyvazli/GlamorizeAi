// app/api/user/subscription-status/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get email parameter from URL
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user and include both subscription status and ID
    const user = await User.findOne({ email }).select('subscriptionStatus subscriptionId');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return boolean value explicitly to ensure proper type
    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus === true,
      subscriptionId: user.subscriptionId || null
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status', message: error.message },
      { status: 500 }
    );
  }
}