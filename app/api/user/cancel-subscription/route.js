import { connectDB } from '@/lib/db';
import User from '@/models/user';
import Subscription from '@/models/subscription';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user || !user.subscriptionStatus) {
      return NextResponse.json(
        { error: 'User is not subscribed or not found' },
        { status: 404 }
      );
    }

    const subscription = await Subscription.findById(user.subscriptionId);
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    user.balance += subscription.price;
    user.subscriptionStatus = false;
    user.subscriptionId = null;

    await user.save();

    return NextResponse.json(
      { message: 'Subscription canceled successfully', balance: user.balance },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during subscription cancellation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription', message: error.message },
      { status: 500 }
    );
  }
}
