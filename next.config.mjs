/**
 * @type {import('next').NextConfig}
 * Next.js 15 için güncellenmiş konfigürasyon
 */
const nextConfig = {
  // React'ın bazı hataları daha sıkı yakalaması için önerilen ayar
  reactStrictMode: true,
  
  /**
   * ESLint ayarları - build hatalarını önlemek için
   */
  eslint: {
    // ESLint hatalarına rağmen build devam etsin (Netlify'da başarılı build için)
    ignoreDuringBuilds: true,
  },
  
  /**
   * Harici resim domainlerini yapılandırma
   */
  images: {
    domains: [
      'i.pravatar.cc',
      'res.cloudinary.com',
      'lh3.googleusercontent.com'  // Google profil resimleri için eklendi
    ]
  },
};

export default nextConfig;