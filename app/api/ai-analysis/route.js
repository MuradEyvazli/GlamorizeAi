import { NextResponse } from 'next/server';

export async function POST(req) {
  let controller;  
  try {
    
    const { resultImageBase64, question } = await req.json();

    // 2) Parametre kontrolü
    if (!resultImageBase64 || !question) {
      return NextResponse.json({
        success: false,
        message: 'Lütfen hem "resultImageBase64" hem de "question" parametrelerini gönderin.',
      });
    }

    // 3) Zaman aşımı için AbortController ayarla (örnek: 30 saniye)
    controller = new AbortController();
    const abortTimeout = setTimeout(() => {
      controller.abort();
    }, 30_000);

    // 4) Hugging Face VQA modeline isteği yap
    const vqaResponse = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-vqa-base',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            image: resultImageBase64,
            question,
          },
        }),
        signal: controller.signal, // AbortController
      }
    );

    // 4.1) Eğer süre dolmadıysa timeout’u temizle
    clearTimeout(abortTimeout);

    // 4.2) HTTP durum kodunu kontrol et
    if (!vqaResponse.ok) {
      // Hata durumunda Hugging Face cevabını okumayı deneyelim
      let errorMsg = 'Bilinmeyen hata';
      try {
        const errorJson = await vqaResponse.json();
        if (errorJson.error) {
          // Örneğin: {"error":"Model Salesforce/blip-vqa-base is currently loading"}
          errorMsg = `Hugging Face Hatası: ${errorJson.error}`;
        } else {
          errorMsg = JSON.stringify(errorJson);
        }
      } catch (err) {
        // JSON parse edilemezse, metin olarak okumayı deneyelim
        try {
          const errorText = await vqaResponse.text();
          errorMsg = errorText || errorMsg;
        } catch (e) {
          // Yine de okunamadıysa
          errorMsg = `Sunucudan alınan hata parse edilemedi (${vqaResponse.status})`;
        }
      }

      return NextResponse.json({
        success: false,
        message: `Hugging Face isteği başarısız oldu. Status Code: ${vqaResponse.status}. Detay: ${errorMsg}`,
      });
    }

    // 5) Model yanıtını JSON olarak al
    const vqaResult = await vqaResponse.json();
    console.log('[INFO] VQA Model Yanıtı:', vqaResult);

    // 5.1) Modelin cevap yapısını kontrol et
    if (Array.isArray(vqaResult) && vqaResult.length > 0 && vqaResult[0]?.answer) {
      // Başarılı yanıt
      return NextResponse.json({
        success: true,
        message: vqaResult[0].answer,
      });
    } else {
      // Model beklenmeyen bir çıktı döndürdü
      console.error('[UYARI] Beklenmeyen API Yanıtı:', vqaResult);
      return NextResponse.json({
        success: false,
        message: 'Sorunuza uygun bir cevap oluşturulamadı.',
      });
    }
  } catch (error) {
    // 6) Catch bloğu: Zaman aşımı veya diğer hatalar
    if (error.name === 'AbortError') {
      // fetch abort edildi => isteğimiz zaman aşımına uğradı
      console.error('[HATA] İstek zaman aşımına uğradı.');
      return NextResponse.json({
        success: false,
        message: 'İstek zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin veya daha küçük bir görsel kullanın.',
      });
    }

    // 6.1) Diğer beklenmeyen hatalar
    console.error('[Sunucu Hatası]', error);
    return NextResponse.json({
      success: false,
      message: `Sunucu tarafında bir hata oluştu: ${error.message}`,
    });
  }
}
