import { generateJWT } from '@/lib/generateJWT';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';

export async function POST(req) {
  try {
    const { personImage, garmentImage, userId } = await req.json();

    if (!personImage || !garmentImage || !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Person image, garment image, and user ID are required.' 
      });
    }

    // Kullanıcıyı bul ve kalan istek sayısını kontrol et
    await connectDB();
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    // Kullanıcının aboneliği var mı kontrol et
    if (!user.subscriptionStatus) {
      return NextResponse.json({ 
        success: false, 
        message: 'You need an active subscription to use this feature.' 
      });
    }

    // Kalan istek sayısını kontrol et
    if (user.remainingRequests <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have used all your requests. Please upgrade your subscription for more.' 
      });
    }

    const ak = process.env.NEXT_PUBLIC_API_KEY;
    const sk = process.env.NEXT_PUBLIC_SECRET_KEY;

    const JWT_TOKEN = generateJWT(ak, sk);

    if (!JWT_TOKEN) {
      console.error('JWT Token could not be generated.');
      return NextResponse.json({ success: false, message: 'JWT Token creation failed.' });
    }

    const response = await fetch('https://api.klingai.com/v1/images/kolors-virtual-try-on', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      body: JSON.stringify({
        model_name: 'kolors-virtual-try-on-v1',
        human_image: personImage,
        cloth_image: garmentImage,
      }),
    });

    const data = await response.json();

    if (data.code === 0 && data.data?.task_id) {
      // İsteğin başarılı olduğunu teyit et ve kalan istek sayısını azalt
      user.remainingRequests -= 1;
      await user.save();
      
      return NextResponse.json({
        success: true,
        taskId: data.data.task_id,
        remainingRequests: user.remainingRequests // Güncel kalan istek sayısını döndür
      });
    } else {
      console.error('API Error:', data.message || 'Unexpected API response.');
      return NextResponse.json({
        success: false,
        message: data.message || 'Unexpected API response.',
      });
    }
  } catch (error) {
    console.error('Unexpected Error:', error.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' });
  }
}