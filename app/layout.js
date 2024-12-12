'use client'
import "./globals.css";
import Footer from "../components/Footer";
import { AuthProvider } from "./Providers";
import Navbar from "@/components/Navbar";
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const shouldShowNavbarFooter =
    pathname === "/dashboard" || 
    (!pathname.startsWith("/register") &&
     !pathname.startsWith("/") &&
     !pathname.startsWith("/blog/"));

  return (
    <html lang="en">
      <body className="relative">
        <AuthProvider>
          {shouldShowNavbarFooter && <Navbar />}
          {children}
          {shouldShowNavbarFooter && <Footer />}
          {/* Expanding Button */}
          <motion.div
            className="fixed bottom-6 right-6 flex items-center bg-gradient-to-r from-[#0024301e] to-[#0c0c10] rounded-full shadow-lg cursor-pointer"
            whileHover={{ width: "200px" }} // Sağ tarafa doğru genişleme
            whileTap={{ scale: 0.95 }} // Tıklanma animasyonu
            transition={{ type: "spring", stiffness: 300, damping: 20 }} // Hareket geçişi
            style={{ width: "60px", height: "60px" }} // Varsayılan daire boyutu
          >
            <Link href="/" className="flex items-center justify-center w-full h-full">
              <Image
                src="/images/whiteLogo.png"
                alt="Glamorize"
                width={90}
                height={90}
                className="ml-7"
              />
            </Link>
            <motion.span
              className="text-white opacity-0 whitespace-nowrap ml-8 mr-4"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Glamorize AI
            </motion.span>
          </motion.div>
        </AuthProvider>
      </body>
    </html>
  );
}
