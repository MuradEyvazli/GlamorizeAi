import { generateJWT } from '@/lib/generateJWT';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { personImage, garmentImage } = await req.json();

    if (!personImage || !garmentImage) {
      return NextResponse.json({ success: false, message: 'Both images are required.' });
    }

    const ak = '05c5c2d52e5047c0a06dde42cded46c6';
    const sk = '47f94fe882de4c6fa1399ede10628c9a';

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
      return NextResponse.json({
        success: true,
        taskId: data.data.task_id,
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
