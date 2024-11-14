import Subscription from '../../../models/subscription'; // Adjust the path accordingly
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, name, title, price, creditspermonth, details } = body;
    await connectDB();

    // Check if all required fields are provided
    if (!name || !title || !price || !creditspermonth || !details || !type) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create new subscription
    const newSubscription = new Subscription({
        type,
        name,
        title,
      price,
      creditspermonth,
      details,
    });

    // Save subscription to the database
    const savedSubscription = await newSubscription.save();

    // Send success response
    return NextResponse.json(savedSubscription, { status: 201 });
  } catch (error) {
    // Send error response
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
