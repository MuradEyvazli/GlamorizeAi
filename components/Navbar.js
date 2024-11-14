import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { FaCaretDown, FaUserCircle, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import emailjs from 'emailjs-com';
import Image from 'next/image';

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let balanceInterval;
    if (session) {
      const fetchBalance = async () => {
        try {
          const response = await fetch(`/api/user/balance?email=${session.user.email}`);
          const data = await response.json();
          if (response.ok) setBalance(data.balance);
          else console.error(data.error);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
      
      // Fetch balance immediately and set interval
      fetchBalance();
      balanceInterval = setInterval(fetchBalance, 5000); // Update every 5 seconds
    }

    // Cleanup interval on component unmount
    return () => clearInterval(balanceInterval);
  }, [session]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    const fromName = session?.user?.name || "Guest User";
    const fromEmail = session?.user?.email || "No email provided";
  
    emailjs.send(
      'service_h8zshbe',
      'template_pzqb7bx',
      { 
        from_name: fromName,
        from_email: fromEmail,
        message,
        to_email: 'muradeyvazli18@gmail.com'
      },
      '_XxGklZ4tMSw1vTta'
    )
    .then(() => {
      alert("Message sent successfully!");
      setMessage('');
      setIsContactOpen(false);
    })
    .catch((error) => console.error("Error sending email:", error));
  };
  
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-lg top-0 w-full z-50">
      <div className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#66c1f6] to-[#5a5ede]">
        <Link className='ml-10 flex' href="/"><Image src="/images/GAILOGO.png" alt="Glamorize" width={40} height={50} /></Link>
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
      </ul>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleContact}
          className="text-gray-600 hover:text-blue-500 transition"
        >
          <FaEnvelope className="text-2xl" />
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
            <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition hover:from-purple-600 hover:to-indigo-600">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {isContactOpen && (
        <div className="absolute right-4 top-20 w-80 bg-white p-4 rounded-lg shadow-lg z-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <button onClick={toggleContact} className="text-gray-600 hover:text-red-500">&times;</button>
          </div>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
