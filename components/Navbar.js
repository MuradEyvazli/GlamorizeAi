"use client";

import React, { useState, useEffect, useRef } from "react";
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
  FaBrain,
  FaPlus,
  FaSync
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Store interval ID and previous values in refs to persist across renders
  const intervalRef = useRef(null);
  const prevBalanceRef = useRef(balance);
  const prevSubscriptionRef = useRef(isSubscribed);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleUserMenu = () => {
    // Refresh data when opening menu to ensure it's up to date
    if (!userMenuOpen) {
      fetchUserData(true);
    }
    setUserMenuOpen(!userMenuOpen);
  };
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

  // Function to fetch user data
  const fetchUserData = async (force = false) => {
    if (!session?.user?.email) return;
    
    if (force) {
      // Set refreshing state for UI feedback
      setIsRefreshing(true);
    }

    try {
      // Generate a unique cache-busting parameter
      const timestamp = Date.now();
      
      // Fetch profile data
      const profileRes = await fetch('/api/profile/get-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        console.log("✅ Profile data loaded:", profileData);
        setUserData(profileData);
      }

      // Fetch balance - use direct URL with nocache parameter
      const balanceRes = await fetch(`/api/user/balance?email=${session.user.email}&nocache=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        console.log("💰 Balance data loaded:", balanceData.balance);
        
        // Only update if the value actually changed
        if (balanceData.balance !== prevBalanceRef.current) {
          console.log(`Balance updated from ${prevBalanceRef.current} to ${balanceData.balance}`);
          setBalance(balanceData.balance);
          prevBalanceRef.current = balanceData.balance;
        }
      }

      // Fetch subscription status with similar cache-busting approach
      const subRes = await fetch(`/api/user/subscription-status?email=${session.user.email}&nocache=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (subRes.ok) {
        const subData = await subRes.json();
        console.log("👑 Subscription data loaded:", subData.subscriptionStatus);
        
        // Only update if the value actually changed
        if (subData.subscriptionStatus !== prevSubscriptionRef.current) {
          console.log(`Subscription updated from ${prevSubscriptionRef.current} to ${subData.subscriptionStatus}`);
          setIsSubscribed(subData.subscriptionStatus);
          prevSubscriptionRef.current = subData.subscriptionStatus;
        }
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    } finally {
      if (force) {
        setIsRefreshing(false);
      }
    }
  };

  // Initial data load and setup polling
  useEffect(() => {
    if (status === 'authenticated') {
      // Load data immediately
      fetchUserData();
      
      // Set up aggressive polling (every 5 seconds)
      intervalRef.current = setInterval(() => {
        fetchUserData();
      }, 5000);
    }
    
    return () => {
      // Clean up interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session, status]);

  // Listen for balance and subscription update events
  useEffect(() => {
    const handleBalanceUpdate = (event) => {
      console.log("🔄 Balance update event received:", event.detail);
      if (event.detail && typeof event.detail.balance === 'number') {
        console.log(`Setting balance from ${balance} to ${event.detail.balance}`);
        setBalance(event.detail.balance);
        prevBalanceRef.current = event.detail.balance;
        
        // Trigger immediate data refresh to ensure everything is in sync
        fetchUserData(true);
      }
    };

    const handleSubscriptionUpdate = (event) => {
      console.log("🔄 Subscription update event received:", event.detail);
      if (event.detail && typeof event.detail.subscriptionStatus === 'boolean') {
        console.log(`Setting subscription from ${isSubscribed} to ${event.detail.subscriptionStatus}`);
        setIsSubscribed(event.detail.subscriptionStatus);
        prevSubscriptionRef.current = event.detail.subscriptionStatus;
        
        // Trigger immediate data refresh to ensure everything is in sync
        fetchUserData(true);
      }
    };

    // Listen to url changes for immediate refresh
    const handleRouteChange = () => {
      console.log("📍 Route changed, refreshing data");
      fetchUserData(true);
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate);
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [balance, isSubscribed]);

  // Manually trigger refresh
  const handleRefresh = (e) => {
    e.stopPropagation();
    fetchUserData(true);
  };

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
              <div className="relative w-9 h-9 mr-4 mb-2 flex-shrink-0">
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
              
              {/* Refresh button */}
              {session && (
                <button
                  onClick={handleRefresh}
                  className={`p-2 rounded-full transition-all ${isRefreshing 
                    ? 'animate-spin text-purple-600' 
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'}`}
                  aria-label="Refresh data"
                  disabled={isRefreshing}
                >
                  <FaSync className="text-lg" />
                </button>
              )}
              
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
                              <div className="bg-gray-50 p-3 rounded-lg relative group">
                                <div className="flex items-center">
                                  <FaWallet className="text-purple-500 mr-2" />
                                  <p className="text-xs text-gray-500">Balance</p>
                                </div>
                                <div className="flex flex-col ">
                                  <p className="text-lg font-semibold text-gray-900">
                                    {typeof balance === 'number' ? `$${balance.toFixed(2)}` : '$0.00'}
                                  </p>
                                  <Link
                                    href="/balance/topup"
                                    onClick={() => setUserMenuOpen(false)}
                                    className="text-xs flex items-center text-purple-600 hover:text-purple-700"
                                  >
                                    <FaPlus className="" size={10} />
                                    Add
                                  </Link>
                                </div>
                                {/* Visual indicator for fresh data */}
                                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={handleRefresh} 
                                    className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200"
                                    title="Refresh balance"
                                  >
                                    <FaSync className="text-purple-600 text-xs" />
                                  </button>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg relative group">
                                <div className="flex items-center">
                                  <FaCrown className={`mr-2 ${isSubscribed ? 'text-amber-500' : 'text-gray-400'}`} />
                                  <p className="text-xs text-gray-500">Status</p>
                                </div>
                                <p className={`text-sm font-semibold ${isSubscribed ? 'text-amber-500' : 'text-gray-500'}`}>
                                  {isSubscribed ? "Premium" : "Free Plan"}
                                </p>
                                {/* Visual indicator for fresh data */}
                                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={handleRefresh} 
                                    className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200"
                                    title="Refresh subscription status"
                                  >
                                    <FaSync className="text-purple-600 text-xs" />
                                  </button>
                                </div>
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
                            <Link 
                              href="/balance/topup" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <FaWallet className="mr-3 text-gray-400" />
                              Top Up Balance
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