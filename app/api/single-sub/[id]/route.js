import Subscription from '@/models/subscription'; // Adjust the path accordingly
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; // Ensure you have a proper MongoDB connection setup

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params; // Extract the subscription id from the request parameters

    // Find the subscription by ID
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Send success response with the subscription details
    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    // Send error response if there's an issue
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
