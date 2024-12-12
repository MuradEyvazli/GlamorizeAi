import { generateJWT } from '@/lib/generateJWT';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ success: false, message: 'Task ID is required.' });
    }

    const ak = process.env.NEXT_PUBLIC_API_KEY;
    const sk = process.env.NEXT_PUBLIC_SECRET_KEY;

    const JWT_TOKEN = generateJWT(ak, sk);

    const response = await fetch(`https://api.klingai.com/v1/images/kolors-virtual-try-on/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    });

    const data = await response.json();

    if (data.code === 0) {
      const taskStatus = data.data?.task_status;

      if (taskStatus === 'completed' || taskStatus === 'succeed') {
        const imageUrl = data.data?.task_result?.images?.[0]?.url;
        if (imageUrl) {
          return NextResponse.json({
            success: true,
            resultImageUrl: imageUrl,
          });
        } else {
          return NextResponse.json({
            success: false,
            message: 'Task succeeded, but no image URL found.',
          });
        }
      } else if (taskStatus === 'in_progress' || taskStatus === 'processing') {
        return NextResponse.json({
          success: false,
          taskStatus: 'processing',
          message: 'Task is still processing.',
        });
      } else {
        return NextResponse.json({
          success: false,
          taskStatus,
          message: `Unexpected task status: ${taskStatus}`,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'Unexpected API response.',
      });
    }
  } catch (error) {
    console.error('Error fetching task result:', error.message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' });
  }
}
