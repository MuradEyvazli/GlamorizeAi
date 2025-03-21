'use client'
import "./globals.css";
import Footer from "../components/Footer";
import { AuthProvider } from "./Providers";
import Navbar from "@/components/Navbar";
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on homepage and register page
  const shouldShowNavbarFooter = pathname !== "/" && pathname !== "/register";
  
  return (
    <html lang="en">
      <body className="relative">
        {/* Toast container for notifications across the entire app */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#333333',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '16px',
              borderRadius: '8px',
            },
          }}
        />
        
        <AuthProvider>
          {/* Only show Navbar if not on homepage or register page */}
          {shouldShowNavbarFooter && <Navbar />}
          
          {children}
          
          {/* Only show Footer if not on homepage or register page */}
          {shouldShowNavbarFooter && <Footer />}
          
          {/* Expanding Button */}
        </AuthProvider>
      </body>
    </html>
  );
}