// app/api/profile/update-profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import crypto from 'crypto';  // Node.js built-in module, a safer alternative

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
      // Ensure uploads directory exists
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      
      // Create unique filename with crypto instead of uuid
      const uniqueId = crypto.randomBytes(16).toString('hex');
      const ext = profileImage.type.split('/')[1];
      const filename = `${uniqueId}.${ext}`;
      
      // Convert to buffer and save
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save file
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      // Update database with image path
      const imagePath = `/uploads/${filename}`;
      updateData.image = imagePath;
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