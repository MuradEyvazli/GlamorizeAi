import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { FaCaretDown, FaUserCircle, FaEnvelope, FaTimes, FaRocket } from "react-icons/fa";
import Link from "next/link";
import emailjs from "emailjs-com";
import Image from "next/image";
import FakeNavbar from "@/components/FakeNavbar";
import { motion, AnimatePresence } from "framer-motion";
import SupportChat from "./SupportChat";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showFakeNavbar, setShowFakeNavbar] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  useEffect(() => {
    let balanceInterval;
    if (session) {
      const fetchBalance = async () => {
        try {
          const response = await fetch(
            `/api/user/balance?email=${session.user.email}`
          );
          const data = await response.json();
          if (response.ok) setBalance(data.balance);
          else console.error(data.error);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };

      fetchBalance();
      balanceInterval = setInterval(fetchBalance, 5000); // Update every 5 seconds
    }

    return () => {
      clearInterval(balanceInterval);
    };
  }, [session]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFakeNavbar(window.scrollY > 50); // Show FakeNavbar after 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {showFakeNavbar && (
          <motion.div
            key="fake-navbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full z-50"
          >
            <FakeNavbar />
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-lg top-0 w-full z-40">
        <div className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#66c1f6] to-[#5a5ede]">
          <Link className="ml-10 flex" href="/">
            <Image src="/images/GlamorizeAi.png" alt="Glamorize" width={150} height={100} />
          </Link>
        </div>
        <ul className="hidden md:flex space-x-6 text-sm md:text-base font-medium">
          {["Home", "About", "Plan"].map((item, index) => (
            <li key={index}>
              <button
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-gray-600 hover:text-blue-500 transition duration-300 ease-in-out"
              >
                {item}
              </button>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard/stackingame"
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] animate-gradient"
            >
              Color Game
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleChat}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-white font-semibold py-2 px-4 rounded-lg shadow-lg "
          >
            <FaRocket className="text-xl" />
            <span>Support</span>
          </button>

          {session ? (
            <div className="relative">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleMenu}>
                <FaUserCircle className="text-2xl text-gray-600" />
                <span className="font-bold text-gray-600">{session.user?.name || "User"}</span>
                <FaCaretDown className="text-gray-600" />
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-10 transition duration-300 ease-in-out">
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="font-bold text-lg block text-gray-700">{session.user?.name}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="font-bold text-lg block text-gray-700">{session.user?.email}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">Balance:</span>
                      <span className="font-bold text-lg block text-gray-700">${balance}</span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full mt-4 py-2 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg transition hover:from-purple-600 hover:to-indigo-600"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4 md:flex hidden">
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition hover:from-purple-600 hover:to-indigo-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 rounded-lg w-96 h-96 z-50 flex flex-col"
          >
            <SupportChat />
            <button
              onClick={toggleChat}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
