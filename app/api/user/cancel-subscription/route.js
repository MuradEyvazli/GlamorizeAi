// app/api/user/cancel-subscription/route.js
import connectDB from '@/lib/db';
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
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (!user.subscriptionStatus) {
      return NextResponse.json(
        { error: 'User does not have an active subscription' },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findById(user.subscriptionId);
    if (!subscription) {
      // If subscription plan not found but user has subscription status, 
      // still reset the status but can't refund properly
      user.subscriptionStatus = false;
      user.subscriptionId = null;
      await user.save();
      
      return NextResponse.json(
        { 
          message: 'Subscription canceled, but original plan not found. No refund processed.',
          balance: parseFloat(user.balance || 0).toFixed(2)
        },
        { status: 200 }
      );
    }

    // Format values to ensure proper numeric handling
    const currentBalance = parseFloat(user.balance || 0).toFixed(2);
    const refundAmount = parseFloat(subscription.price || 0).toFixed(2);
    
    // Calculate new balance with precision
    const newBalance = (parseFloat(currentBalance) + parseFloat(refundAmount)).toFixed(2);

    // Update user document
    user.balance = parseFloat(newBalance);
    user.subscriptionStatus = false;
    user.subscriptionId = null;
    await user.save();

    // Verify the update by getting the latest data
    const updatedUser = await User.findById(userId);
    const finalBalance = parseFloat(updatedUser.balance || 0).toFixed(2);

    return NextResponse.json(
      {
        message: 'Subscription canceled successfully',
        refundedAmount: parseFloat(refundAmount),
        previousBalance: parseFloat(currentBalance),
        currentBalance: parseFloat(finalBalance),
        rawBalance: finalBalance
      },
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