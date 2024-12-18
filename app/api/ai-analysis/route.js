import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { resultImageBase64, question } = await req.json();

    // Hugging Face VQA modeli kullanarak istek gönder
    const vqaResponse = await fetch('https://api-inference.huggingface.co/models/Salesforce/blip-vqa-base', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: resultImageBase64,
          question: question,
        },
      }),
    });

    const vqaResult = await vqaResponse.json();

    console.log("VQA Model Yanıtı:", vqaResult);

    if (vqaResponse.ok && vqaResult.length > 0 && vqaResult[0]?.answer) {
      return NextResponse.json({ success: true, message: vqaResult[0].answer });
    } else {
      console.error("Beklenmeyen API Yanıtı:", vqaResult);
      return NextResponse.json({ success: false, message: 'Sorunuza uygun bir cevap oluşturulamadı.' });
    }
  } catch (error) {
    console.error("Sunucu Hatası:", error);
    return NextResponse.json({ success: false, message: 'Sunucu tarafında bir hata oluştu.' });
  }
}
