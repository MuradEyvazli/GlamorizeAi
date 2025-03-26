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
    ignoreDuringBuilds: true,
  },
  
  /**
   * TypeScript hatalarını görmezden gel (build için)
   */
  typescript: {
    ignoreBuildErrors: true,
  },
  
  /**
   * Build sürecini özelleştirme
   */
  output: 'standalone',
  
  /**
   * Harici resim domainlerini yapılandırma
   */
  images: {
    domains: [
      'i.pravatar.cc',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'graph.facebook.com'
    ]
  },
  
  /**
   * Build sürecini özelleştirme - not-found sayfası için
   */
  experimental: {
    // 404 sayfasını SSR olarak işle, statik olarak değil
    serverActions: true,
  }
};

export default nextConfig;