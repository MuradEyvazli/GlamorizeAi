import React from "react";
import { motion } from 'framer-motion'
import Link from "next/link";
import Image from "next/image";

const RequestAccess = () => {
  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#000103] text-white px-3">
      {/* Section 1 */}
      <div
        id="main-section"
        className="flex justify-center items-center h-screen"
      >
        <div className="text-center space-y-6">
          <button
            onClick={() => scrollToSection("preinfo")}
            className="border border-white rounded-full px-6 py-2 text-sm hover:bg-white hover:text-[#6c63ff] transition duration-300"
          >
            What next?
          </button>
          <h1 className="text-4xl font-bold leading-tight">
            The future is here. <br />
            Start your trial with starter plan and try it for $4.99.
          </h1>
          <button
            onClick={() => scrollToSection("plan")}
            className="bg-white text-black hover:bg-[#6c63ff] hover:text-white rounded-full px-8 py-3 text-lg hover:scale-105 transition duration-300 mb-10"
          >
            Request Access
          </button>
          <motion.div className="flex justify-center items-center ">
        <Link className='mt-8 flex' href="/"><Image src="/images/whiteLogo.png" alt="Glamorize" width={40} height={50} /></Link>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
