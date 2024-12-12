import User from '@/models/user'; 
import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/*************  ✨ Codeium Command ⭐  *************/
/**
 * GET /api/user/:id
 * 
 * Returns the user with the given ID. The response will include the user's
 * subscription status, subscription ID, and balance.
 * 
 * @param {string} id - The ID of the user to retrieve.
 * 
 * @returns {NextResponse} - A JSON response with a 200 status code containing
/******  f8f4fdbc-7a3e-4b02-a1c9-d78cba48148a  *******/
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    // Attempt to find the user by ID
    const user = await User.findById(id).select('subscriptionStatus subscriptionId balance');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
