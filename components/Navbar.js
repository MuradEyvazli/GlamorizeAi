import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { 
  FaRegBell, 
  FaRegQuestionCircle, 
  FaChevronDown,
  FaUserCircle,
  FaCrown,
  FaRegUser,
  FaSignOutAlt,
  FaCog,
  FaWallet,
  FaTachometerAlt,
  FaBrain
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SupportChat from "./SupportChat";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState(null);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleNavMenu = () => setNavMenuOpen(!navMenuOpen);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;

      try {
        // Fetch user profile data first
        const profileRes = await fetch('/api/profile/get-profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          console.log("Loaded profile data:", profileData); // Debugging log
          setUserData(profileData);
        }

        // Fetch balance
        const balanceRes = await fetch(`/api/user/balance?email=${session.user.email}`);
        const balanceData = await balanceRes.json();
        if (balanceRes.ok) {
          setBalance(balanceData.balance);
        }

        // Fetch subscription status
        const subRes = await fetch(`/api/user/subscription-status?email=${session.user.email}`);
        const subData = await subRes.json();
        if (subRes.ok) {
          setIsSubscribed(subData.subscriptionStatus);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status]);

  // Handle logout with proper redirect
  const handleLogout = () => {
    setUserMenuOpen(false);
    const currentOrigin = window.location.origin;
    signOut({ callbackUrl: currentOrigin });
  };

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" }
  ];

  // Use user data from our fetch or fallback to session data
  const userName = userData?.name || session?.user?.name || "User";
  const userEmail = userData?.email || session?.user?.email || "";
  
  // Use image from userData or session
  // DÜZELTME: profileImage -> image 
  const userImage = userData?.image || session?.user?.image || null;

  return (
    <>
      <header 
        className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white shadow-sm py-2" 
            : "bg-white py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-9 h-9 mr-3 flex-shrink-0">
                <Image className="flex w-10 h-10 " src="/images/GAILOGO.png" alt="Logo" width={36} height={36} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-gray-600">
                  Glamorize-AI
                </span>
                <span className="text-xs leading-tight text-gray-500">
                  AI Fashion Stylist
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side items */}
            <div className="flex items-center space-x-2">
              {/* Support button */}
              <button
                onClick={toggleChat}
                className="p-2 rounded-full transition-all text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                aria-label="Support"
              >
                <FaBrain className="text-lg" />
              </button>
              
              {/* User section - only show when logged in */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 py-1.5 px-3 rounded-full transition-all bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
                  >
                    <div className="relative">
                      {userImage ? (
                        <Image 
                          src={userImage} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="rounded-full w-8 h-8 object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600">
                          <FaUserCircle className="text-xl" />
                        </div>
                      )}
                      {isSubscribed && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-4 h-4 flex items-center justify-center border border-white">
                          <FaCrown className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:inline font-medium truncate max-w-[100px]">
                      {userName.split(' ')[0] || "User"}
                    </span>
                    <FaChevronDown className="text-xs opacity-70" />
                  </button>

                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-10"
                      >
                        <div className="divide-y divide-gray-100">
                          {/* Header section with user info */}
                          <div className="px-4 py-4">
                            <div className="flex items-center space-x-3">
                              {userImage ? (
                                <Image
                                  src={userImage}
                                  alt="Profile"
                                  width={48}
                                  height={48}
                                  className="rounded-full w-12 h-12 object-cover border-2 border-purple-100"
                                />
                              ) : (
                                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                                  <FaUserCircle className="text-purple-600 text-2xl" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {userName || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {userEmail}
                                </p>
                                {isSubscribed && (
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs bg-gradient-to-r from-amber-500 to-amber-300 text-white px-2 py-0.5 rounded-full font-medium flex items-center">
                                      <FaCrown className="mr-1 text-xs" /> Premium
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Account details */}
                          <div className="px-4 py-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                  <FaWallet className="text-purple-500 mr-2" />
                                  <p className="text-xs text-gray-500">Balance</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">${balance}</p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                  <FaCrown className={`mr-2 ${isSubscribed ? 'text-amber-500' : 'text-gray-400'}`} />
                                  <p className="text-xs text-gray-500">Status</p>
                                </div>
                                <p className={`text-sm font-semibold ${isSubscribed ? 'text-amber-500' : 'text-gray-500'}`}>
                                  {isSubscribed ? "Premium" : "Free Plan"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="py-1">
                            
                            <Link 
                              href="/profile" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <FaRegUser className="mr-3 text-gray-400" />
                              Profile Settings
                            </Link>
                            {isSubscribed ? (
                              <Link 
                                href="#pricing" 
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <FaCog className="mr-3 text-gray-400" />
                                Manage Subscription
                              </Link>
                            ) : (
                              <Link 
                                href="#pricing" 
                                className="flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <FaCrown className="mr-3 text-purple-500" />
                                Upgrade to Premium
                              </Link>
                            )}
                            <button
                              onClick={handleLogout}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <FaSignOutAlt className="mr-3 text-red-400" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/register"
                    className="py-1.5 px-4 text-sm font-medium rounded-full transition-all text-purple-600 hover:bg-purple-50 border border-transparent"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/"
                    className="py-1.5 px-4 text-sm font-medium rounded-full transition-all bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden ml-1 p-2 rounded-lg transition-all text-gray-600 hover:bg-purple-50"
                onClick={toggleNavMenu}
                aria-label="Toggle menu"
              >
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2" 
                  stroke="currentColor"
                >
                  {navMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation menu */}
        <AnimatePresence>
          {navMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pt-2 pb-3 space-y-1 shadow-lg bg-white border-t border-gray-100">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    onClick={() => setNavMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Support chat */}
      <AnimatePresence>
        {isChatOpen && <SupportChat onClose={toggleChat} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;