// app/api/profile/get-profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user';

export async function GET(request) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Get user email from session
    const userEmail = session.user.email;

    // Fetch user profile from database
    const user = await User.findOne({ email: userEmail, isDeleted: false });

    // If user doesn't exist
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user profile data
    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image || '/default-avatar.png',
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
      balance: user.balance || 0,
      subscriptionStatus: user.subscriptionStatus || false
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}