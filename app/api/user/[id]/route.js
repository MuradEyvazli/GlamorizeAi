// app/api/user/[id]/route.js 
import connectDB from '@/lib/db';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Kullanıcıyı ID ile bul ve gereken tüm alanları seç
    const user = await User.findById(userId)
      .select('name email balance subscriptionStatus subscriptionId remainingRequests');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sayısal değerleri tutarlı formatta
    const formattedBalance = parseFloat(user.balance || 0).toFixed(2);

    return NextResponse.json({
      name: user.name,
      email: user.email,
      balance: parseFloat(formattedBalance),
      subscriptionStatus: user.subscriptionStatus === true,
      subscriptionId: user.subscriptionId || null,
      remainingRequests: user.remainingRequests || 0 // Kalan istek sayısını dahil et
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', message: error.message },
      { status: 500 }
    );
  }
}