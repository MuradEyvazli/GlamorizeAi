// app/api/user/subscribe/route.js
import connectDB from '@/lib/db';
import User from '@/models/user';
import Subscription from '@/models/subscription';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { userId, subscriptionId } = await request.json();

    // Giriş doğrulama
    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: 'User ID and Subscription ID are required' },
        { status: 400 }
      );
    }

    // Kullanıcı ve abonelik verilerini al
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
    }

    // Kullanıcının zaten aboneliği var mı kontrol et
    if (user.subscriptionStatus) {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      );
    }

    // Bakiye ve fiyatı sayılara dönüştür
    const currentBalance = parseFloat(user.balance || 0).toFixed(2);
    const subscriptionPrice = parseFloat(subscription.price || 0).toFixed(2);

    // Bakiye kontrolü
    if (parseFloat(currentBalance) < parseFloat(subscriptionPrice)) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        currentBalance: parseFloat(currentBalance),
        requiredAmount: parseFloat(subscriptionPrice) 
      }, { status: 400 });
    }

    // Kullanıcı bakiyesini güncelle
    const newBalance = (parseFloat(currentBalance) - parseFloat(subscriptionPrice)).toFixed(2);
    
    // Kullanıcı belgesini güncelle
    user.balance = parseFloat(newBalance);
    user.subscriptionStatus = true;
    user.subscriptionId = subscriptionId;
    // Kalan istek sayısını abonelik planına göre ayarla
    user.remainingRequests = subscription.allowedRequests || 0;
    await user.save();

    // Güncellenmiş kullanıcı bilgilerini döndür
    return NextResponse.json(
      {
        message: 'Subscription successful',
        userId: user._id,
        subscriptionId: subscription._id,
        balance: parseFloat(user.balance).toFixed(2),
        subscriptionStatus: user.subscriptionStatus,
        remainingRequests: user.remainingRequests // Kalan istek sayısını ekle
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during subscription:', error);
    return NextResponse.json(
      { error: 'Failed to complete subscription', message: error.message },
      { status: 500 }
    );
  }
}