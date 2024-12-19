import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { FaCaretDown, FaUserCircle, FaRocket, FaBars } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SupportChat from "./SupportChat";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [balance, setBalance] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdownMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setShowShadow(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/user/balance?email=${session.user.email}`);
          const data = await response.json();
          if (response.ok) {
            setBalance(data.balance);
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [session]);

  return (
    <>
      <div
        className={`fixed top-[-20px] left-0 w-full z-50 transition-shadow  ${
          showShadow ? "shadow-lg" : ""
        }`}
      >
        <nav
          className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-black/70 to-gray-800/70 backdrop-blur-md"
          style={{
            backgroundImage: `url('/images/navbar-background.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Link href="/" className="flex items-center justify-center md:justify-start w-10 h-12 mt-4">
            <Image
              src="/images/whiteLogo.png"
              alt="Glamorize"
              width={90}
              height={90}
              className="ml-7"
            />
          </Link>

          <div className="flex items-center space-x-4 mt-4 ml-auto">
            <button
              onClick={toggleChat}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#0980a81e] to-[#1a1a2b] text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
            >
              <FaRocket />
              <span>Support</span>
            </button>
            

            {session ? (
              <div className="relative">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleMenu}>
                  <FaUserCircle className="text-2xl text-white" />
                  <span className="font-bold text-white">{session.user?.name || "User"}</span>
                  <FaCaretDown className="text-white" />
                </div>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg z-10"
                  >
                    <div className="p-4">
                      <p className="text-sm text-gray-600">Name:</p>
                      <p className="font-bold text-lg">{session.user?.name}</p>
                      <p className="text-sm text-gray-600 mt-2">Email:</p>
                      <p className="font-bold text-lg">{session.user?.email}</p>
                      <p className="text-sm text-gray-600 mt-2">Balance:</p>
                      <p className="font-bold text-lg">${balance}</p>
                      <button
                        onClick={() => signOut()}
                        className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg transition hover:from-purple-500 hover:to-indigo-500"
                      >
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div></div>
            )}
            <div className="relative">
              <button
                onClick={toggleDropdownMenu}
                className="text-white text-2xl hover:text-blue-500 transition"
              >
                <FaBars />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-16 right-0 bg-white rounded-lg shadow-lg z-20 py-4 w-48"
                  >
                    <ul>
                      {["Home", "About", "Plans"].map((item, index) => (
                        <li key={index} className="px-6 py-2 hover:bg-gray-200">
                          <Link href={`#${item.toLowerCase()}`}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isChatOpen && (
            <SupportChat />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
