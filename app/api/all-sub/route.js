import Subscription from '@/models/subscription'; // Adjust the path according to your project structure
import connectDB from '@/lib/db';// Ensure this connects to your MongoDB
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB(); // Connect to the database

    // Fetch all subscriptions from the database
    const subscriptions = await Subscription.find();

    // Return the subscriptions as JSON
    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    // If there's an error, return a 500 status with an error message
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions', message: error.message },
      { status: 500 }
    );
  }
}
