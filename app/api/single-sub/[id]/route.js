import Subscription from '@/models/subscription';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await connectDB();

    // Doğrudan params.id kullanın, destructuring yapmayın
    const id = params.id;

    // Validate the ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid subscription ID format" },
        { status: 400 }
      );
    }

    // Find the subscription by ID
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Send success response with the subscription details
    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscription:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}