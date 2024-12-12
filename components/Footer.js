import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-10 px-5 md:px-20" >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] mb-4">
            Glamorize AI
          </h2>
          <p className="text-gray-400 mb-4">
            Revolutionize your wardrobe with AI-powered fashion insights and virtual try-ons.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500">
              <FaFacebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-300">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <FaInstagram size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-700">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-bold mb-3">Quick Links</h3>
          <ul className="text-gray-200 space-y-2">
          {["Home", "About", "Plan"].map((item, index) => (
          <li key={index}>
            <button
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-gray-400 hover:text-blue-500 transition duration-300 ease-in-out"
            >
              {item}
            </button>
          </li>
        ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-bold mb-3">Contact Us</h3>
          <p className="text-gray-400">123 Fashion Street, New York, NY</p>
          <p className="text-gray-400">Email: support@glamorizeai.com</p>
          <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter for the latest fashion insights and offers.
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
        <p>© 2024 Glamorize AI - All rights reserved.</p>
        <p>
          <a href="#privacy-policy" className="hover:text-white">Privacy Policy</a> | 
          <a href="#terms-of-service" className="hover:text-white"> Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
