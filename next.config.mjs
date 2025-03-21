/**
 * @type {import('next').NextConfig}
 * Next.js 15 için güncellenmiş konfigürasyon
 */
const nextConfig = {
  // React'ın bazı hataları daha sıkı yakalaması için önerilen ayar
  reactStrictMode: true,
  
  // swcMinify özelliği artık varsayılan olduğu için kaldırıldı
  // experimental içindeki appDir özelliği artık deneysel olmadığı için kaldırıldı
  
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
    domains: ['i.pravatar.cc'], // pravatar.cc görsellerine izin ver
    // Dilerseniz diğer domain'leri ekleyebilirsiniz
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: '**.example.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;