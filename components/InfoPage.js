import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaRobot, FaMagic, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

const InfoPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Steps data
  const steps = [
    {
      icon: <FaCloudUploadAlt className="text-4xl text-indigo-500" />,
      title: "Upload",
      description: "Start by uploading 1-4 images of your product samples to give you a comprehensive product gallery.",
      color: "from-indigo-500 to-blue-500",
      delay: 0
    },
    {
      icon: <FaRobot className="text-4xl text-purple-500" />,
      title: "AI Photoshoot Generation",
      description: "Our advanced AI gets to work, generating product photoshoots tailored to your product.",
      color: "from-purple-500 to-pink-500",
      delay: 0.1
    },
    {
      icon: <FaMagic className="text-4xl text-pink-500" />,
      title: "Refine with Prompts",
      description: "Generate more photos by uploading your photoshoot concept image or using text prompts.",
      color: "from-pink-500 to-red-500",
      delay: 0.2
    },
    {
      icon: <FaDownload className="text-4xl text-blue-500" />,
      title: "Save & Download",
      description: "Once satisfied, download high-resolution images ready for your marketing campaigns.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.3
    }
  ];

  // Function to handle the button click
  const handleTryNowClick = () => {
    // Scroll to plans section if it exists
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If plans section doesn't exist, redirect to signup or another appropriate page
      window.location.href = '/signup';
    }
  };

  return (
    <section id='about' className="relative py-24 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-1/2 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-50 rounded-full"></div>
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-purple-50 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center"
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="inline-block">
              <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase">How It Works</span>
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mt-2"></div>
            </div>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
              <span className='bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text'>Glamorize</span>{" "}
              your perfect photoshoots
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your product images into professional photoshoots with just a few clicks
            </p>
          </motion.div>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {/* Connecting lines between steps on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[calc(100%_-_8px)] w-full h-0.5 bg-gray-200">
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500"></div>
                  </div>
                )}
                
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-8 h-full border border-gray-100 hover:border-indigo-200 transition-all duration-300">
                  {/* Step number indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Icon container */}
                  <div className="relative inline-flex mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-xl opacity-20 blur-lg transform -rotate-6`}></div>
                    <div className="relative flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-md">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={itemVariants}
            className="mt-20"
          >
            <p className="mt-4 text-gray-500">No credit card required to start</p>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default InfoPage;