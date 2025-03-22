// İyzico Entegrasyonu - Türkiye'de yaygın olarak kullanılan bir ödeme çözümü

// ADIM 1: Gerekli paketleri yükleme
// npm install iyzipay

// ADIM 2: İyzico yapılandırması
// lib/iyzico.js
const Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

module.exports = iyzipay;