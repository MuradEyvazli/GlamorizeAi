import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaMagic, FaTshirt } from "react-icons/fa";

const PreInfoPage = () => {
  return (
    <div id="features" className="relative w-full min-h-screen bg-white py-24 px-6 md:px-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-64 top-0 w-96 h-96 bg-gradient-to-b from-indigo-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -left-64 bottom-0 w-96 h-96 bg-gradient-to-t from-purple-100 to-pink-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 w-16 rounded-full mb-8"></div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Glamorize <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">AI</span> is the next step in digital fashion.
            </h1>
            
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text font-semibold">Glamorize AI</span> uses advanced neural networks and machine learning to create virtual try-on experiences for clothing items in just one click.
              </p>
              
              <p>
                Below is an example that demonstrates how our AI technology can virtually place a yellow t-shirt onto a model, showcasing the effectiveness and precision of our platform.
              </p>
              
              <div className="flex items-center pt-2">
                <div className="mr-4 p-3 bg-indigo-100 rounded-full text-indigo-600">
                  <FaTshirt className="text-xl" />
                </div>
                <span className="font-medium">Virtual Try-On Technology</span>
              </div>
            </div>

            {/* Feature Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-l-4 border-indigo-500 shadow-sm"
            >
              <div className="flex">
                <div className="mr-4 p-3 bg-white rounded-full text-indigo-600 shadow-sm">
                  <FaMagic className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Precision</h3>
                  <p className="text-gray-600">
                    Our technology adapts to different body types, lighting conditions, and garment styles for realistic results.
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ x: 5 }}
                className="mt-4 flex items-center text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
              >
                Learn more about our technology
                <FaArrowRight className="ml-2 text-xs" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -z-10 -right-6 -top-6 w-40 h-40 bg-indigo-100 rounded-full"></div>
              <div className="absolute -z-10 -left-10 -bottom-10 w-32 h-32 bg-purple-100 rounded-full"></div>
              
              <motion.div 
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative p-2 bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <Image 
                  src="/examples/garment8.png" 
                  alt="AI Virtual Try-On Example" 
                  width={600} 
                  height={600}
                  className="rounded-xl"
                />
                
                {/* Overlay label */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <span className="text-sm font-medium text-gray-800">AI Virtual Try-On</span>
                </div>
              </motion.div>
              
              {/* Features tags */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -right-4 top-1/4 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <span className="text-sm font-medium text-indigo-600">Perfect Fit</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -left-4 bottom-1/3 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <span className="text-sm font-medium text-purple-600">Realistic Details</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PreInfoPage;