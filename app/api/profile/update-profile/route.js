// app/api/profile/update-profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const bio = formData.get('bio');
    const profileImage = formData.get('profileImage');

    // Update data object
    const updateData = { name, phone, address, bio };

    // Handle profile image if provided
    if (profileImage && profileImage.size > 0) {
      try {
        // Convert image to base64 format
        const bytes = await profileImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const dataURI = `data:${profileImage.type};base64,${base64Image}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'profile_images',
          public_id: `user_${session.user.id || 'unknown'}_${Date.now()}`,
          overwrite: true,
          resource_type: 'auto'
        });

        // Update database with Cloudinary URL
        updateData.image = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return NextResponse.json({ message: 'Error uploading image' }, { status: 500 });
      }
    }

    // Check if email is changing
    const emailChange = email !== session.user.email;
    if (emailChange) {
      // Check if email already exists for another user
      const existingUser = await User.findOne({ email, _id: { $ne: session.user.id } });
      if (existingUser) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
      }
      updateData.email = email;
    }

    // Update user in database
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return updated profile info
    return NextResponse.json({
      message: 'Profile updated successfully',
      profileImage: user.image,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}