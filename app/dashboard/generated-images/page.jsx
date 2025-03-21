'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Heart, Share2 } from 'lucide-react';

const GeneratedImagesPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading of images
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (imageSrc, e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);
    link.click();
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const generateImages = () => {
    const images = [];
    for (let i = 1; i <= 11; i++) {
      images.push({
        id: i,
        src: `/examples/garment${i}.png`,
        alt: `Glamorize AI Fashion Design ${i}`,
        title: `AI Fashion Creation ${i}`,
        description: 'Ultra HD fashion concept with adaptive color palette',
        tags: ['fashion', 'AI-generated', 'glamour']
      });
    }
    return images;
  };

  const images = generateImages();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-80 mt-[50px]">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-full bg-purple-600 group-hover:bg-purple-500 transition-all duration-300 shadow-md">
            <ArrowLeft size={18} className="text-white" />
          </div>
        </Link>
      </div>

      {/* Header */}
      <header className="text-center pt-16 pb-12 px-4">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
        >
          Your Creations
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg"
        >
          Discover the boundary-pushing AI-generated fashion designs created exclusively for your collection
        </motion.p>
      </header>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-t-transparent border-r-pink-500 border-b-transparent border-l-blue-500 rounded-full animate-spin-slow"></div>
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 pb-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {images.map((image) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative group"
                onClick={() => handleImageClick(image)}
              >
                <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Action buttons that appear on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white/90 transition-colors">
                          <Heart size={18} className="text-pink-500" />
                        </button>
                        <button className="p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white/90 transition-colors">
                          <Share2 size={18} className="text-blue-500" />
                        </button>
                      </div>
                      <button 
                        className="p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white/90 transition-colors"
                        onClick={(e) => handleDownload(image.src, e)}
                      >
                        <Download size={18} className="text-purple-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">
                      {image.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{image.description}</p>
                    
                    <div className="flex mt-3 gap-2 flex-wrap">
                      {image.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </main>
      )}

      {/* Redesigned Image Modal for enlarged view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-white z-50 flex items-center justify-center backdrop-blur-lg"
          onClick={closeModal}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50"
          ></motion.div>
          
          <div className="absolute top-6 right-6 z-30 flex items-center gap-4">
            <button 
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-300 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedImage.src, e);
              }}
            >
              <Download size={18} />
              <span>Download</span>
            </button>
            
            <button 
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 shadow"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
            className="relative w-full max-w-6xl mx-auto z-20 px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side - Image */}
            <div className="relative w-full md:w-3/5 aspect-square rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent"></div>
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>
            
            {/* Right side - Content */}
            <div className="w-full md:w-2/5 flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                  {selectedImage.title}
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mt-6"
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="h-1 w-12 bg-purple-500 rounded-full"></div>
                  <span className="font-medium uppercase text-sm tracking-wider">Description</span>
                </div>
                <p className="text-gray-600 mt-3 text-lg leading-relaxed">
                  {selectedImage.description}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="h-1 w-12 bg-purple-500 rounded-full"></div>
                  <span className="font-medium uppercase text-sm tracking-wider">Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-gray-500 text-sm">Resolution</p>
                    <p className="font-medium">Ultra HD</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Style</p>
                    <p className="font-medium">Contemporary</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Color Palette</p>
                    <p className="font-medium">Adaptive</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Format</p>
                    <p className="font-medium">PNG</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <div className="h-1 w-12 bg-purple-500 rounded-full"></div>
                  <span className="font-medium uppercase text-sm tracking-wider">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-8 flex gap-4"
              >
                <button 
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition-all duration-300 shadow-sm"
                  onClick={closeModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span>Back to gallery</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GeneratedImagesPage;