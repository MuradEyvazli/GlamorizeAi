/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  
  // Build hatalarını görmezden gel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Statik olmayan sayfa çıktısı
  output: 'standalone',
  
  // Harici resim domainleri
  images: {
    domains: [
      'i.pravatar.cc',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'graph.facebook.com'
    ]
  },
  
  // Server Actions için doğru yapılandırma
  experimental: {
    // serverActions: true yerine
    serverActions: {
      allowedOrigins: ['localhost:3000', 'glamorizeai.netlify.app']
    }
  }
};

export default nextConfig;