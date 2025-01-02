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
        </AuthProvider>
      </body>
    </html>
  );
}
