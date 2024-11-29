'use client'
import "./globals.css";
import Footer from "../components/Footer";
import { AuthProvider } from "./Providers";
import Navbar from "@/components/Navbar";
import FakeNavbar from "@/components/FakeNavbar";
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const shouldShowNavbarFooter =
    pathname === "/dashboard" || // Show Navbar and Footer only on the dashboard
    (!pathname.startsWith("/register") &&
     !pathname.startsWith("/") &&
     !pathname.startsWith("/blog/"));

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {shouldShowNavbarFooter && <Navbar />}
          {children}
          {shouldShowNavbarFooter && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
