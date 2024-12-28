import { connectDB } from '@/lib/db';
import User from '@/models/user';
import Subscription from '@/models/subscription';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();

    const { userId, subscriptionId } = await request.json();

    // Input validation
    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: 'User ID and Subscription ID are required' },
        { status: 400 }
      );
    }

    // Retrieve user and subscription data
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });

    // Check if the user is already subscribed
    if (user.subscriptionStatus) {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      );
    }

    // Balance check
    if (user.balance < subscription.price) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Update user balance, subscription status, and ID
    user.balance -= subscription.price;
    user.subscriptionStatus = true;
    user.subscriptionId = subscriptionId;

    await user.save();

    return NextResponse.json(
      {
        message: 'Subscription successful',
        userId: user._id,
        subscriptionId: subscription._id,
        balance: user.balance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during subscription:', error);
    return NextResponse.json(
      { error: 'Failed to complete subscription', message: error.message },
      { status: 500 }
    );
  }
}
