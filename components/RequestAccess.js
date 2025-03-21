import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import Link from "next/link";
import Image from "next/image";
import { FaAngleDown, FaChevronDown, FaArrowRight, FaCrown } from "react-icons/fa";
import { useSession } from "next-auth/react";

const RequestAccess = () => {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribedMessage, setShowSubscribedMessage] = useState(false);

  // Check if user is subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          const data = await response.json();
          setIsSubscribed(data.subscriptionStatus);
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      }
    };

    checkSubscription();
  }, [session]);

  // Show subscribed message temporarily
  const handleSubscribedClick = () => {
    setShowSubscribedMessage(true);
    setTimeout(() => {
      setShowSubscribedMessage(false);
    }, 3000);
  };

  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black z-0">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-3xl"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }}></div>
        </div>
      </div>

      {/* Subscribed Message Alert */}
      {showSubscribedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          You already have an active subscription!
        </motion.div>
      )}

      {/* Content Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <button
            onClick={() => scrollToSection("preinfo")}
            className="inline-flex items-center px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 group"
          >
            <span>Discover Our Technology</span>
            <FaChevronDown className="ml-2 group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-8"
        >
          The future of fashion <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">is already here.</span>
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mb-8 text-xl text-white/80"
        >
          Experience virtual try-ons powered by cutting-edge AI technology
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            {isSubscribed ? (
              // If already subscribed, show a message
              <button
                onClick={handleSubscribedClick}
                className="relative bg-black px-8 py-4 rounded-full text-white font-medium flex items-center"
              >
                <FaCrown className="mr-2 text-yellow-400" />
                <span>Active Subscription</span>
              </button>
            ) : (
              // If not subscribed, link to subscription page
              <Link href="">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <button className="relative bg-black px-8 py-4 rounded-full text-white font-medium flex items-center">
                  <FaCrown className="mr-2" />
                  <span>Start Your Trial</span>
                  <span className="ml-2 text-xs font-normal bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded-full">
                    $4.99
                  </span>
                </button>
              </Link>
            )}
          </motion.div>

          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => scrollToSection("plans")}
            className="text-white flex items-center font-medium hover:text-purple-300 transition-colors"
          >
            <span>View All Plans</span>
            <FaArrowRight className="ml-2" />
          </motion.button>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div 
          variants={itemVariants}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
        >
          <button onClick={() => scrollToSection("preinfo")} className="text-white/50 hover:text-white transition-colors">
            <FaAngleDown className="text-2xl" />
          </button>
        </motion.div>

        {/* Logo */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 sm:mt-20 flex justify-center"
        >
          <Link href="/" className="flex items-center">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full">
              <Image src="/images/whiteLogo.png" alt="Glamorize" width={30} height={30} />
            </div>
            <span className="ml-3 text-white text-xl font-medium">Glamorize AI</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating elements for visual interest */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 right-0 w-1/3 h-1/2 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: "url('/images/abstract-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to top left, black, transparent)"
        }}
      ></motion.div>
    </div>
  );
};

export default RequestAccess;