// app/api/user/subscription-status/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';    // Kendi DB bağlantı fonksiyonunuz
import User from '@/models/user';       // Kendi Mongoose User modeliniz

export async function GET(request) {
  try {
    await connectDB();

    // URL'den email parametresini al
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email }).select('subscriptionStatus');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // subscriptionStatus burada true/false döndüğünü varsayıyoruz
    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus, 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscription status', message: error.message },
      { status: 500 }
    );
  }
}
