'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FaRobot, FaLightbulb, FaCode, FaGlobe, FaChartLine, FaMicrochip, FaBrain, FaBalanceScale } from 'react-icons/fa';

const AiFuturesPage = () => {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [activeTab, setActiveTab] = useState('healthcare');

  const caseStudies = [
    {
      id: 1,
      title: "Healthcare Transformation",
      image: "/examples/ai-healthcare.png",
      content:
        "An in-depth look at how AI transformed healthcare systems to improve patient outcomes. Artificial Intelligence has revolutionized the healthcare industry by enabling faster and more accurate diagnosis of diseases through tools like AI-powered imaging and pattern recognition in medical data. AI also aids in personalized medicine, tailoring treatment plans based on an individual's genetic profile. Furthermore, virtual health assistants and chatbots are enhancing patient engagement by providing instant responses to queries and scheduling appointments. AI-driven predictive analytics is helping hospitals optimize resources, manage patient flow, and anticipate potential outbreaks. With continuous advancements, AI is paving the way for more efficient and effective healthcare systems."
    },
    {
      id: 2,
      title: "Financial Revolution",
      image: "/examples/ai-finance.png",
      content:
        "How AI is revolutionizing the finance industry with predictive analytics and fraud detection. The financial sector has embraced AI for its ability to analyze vast amounts of data quickly and accurately. AI algorithms are used to predict market trends, helping investors make informed decisions with higher confidence. Additionally, AI-driven systems can detect fraudulent transactions in real time by identifying unusual patterns in data. Robo-advisors, powered by AI, are democratizing wealth management by offering personalized financial advice at a fraction of traditional costs. Moreover, AI-powered credit scoring systems provide fairer assessments by analyzing non-traditional data points. The integration of AI in finance has not only improved efficiency but also enhanced security and accessibility."
    },
    {
      id: 3,
      title: "Entertainment Evolution",
      image: "/examples/ai-entertainment.png",
      content:
        "Exploring AI's role in creating immersive entertainment experiences and gaming advancements. AI is transforming the entertainment industry by enabling the creation of personalized content recommendations on platforms like Netflix and Spotify, which enhance user experience. In gaming, AI-driven non-playable characters (NPCs) provide more realistic and engaging interactions, adapting their behavior based on player actions. AI is also used in procedural content generation, allowing developers to create expansive game worlds with minimal manual effort. In the film industry, AI is being used for scriptwriting assistance, visual effects automation, and even deepfake technology to resurrect historical figures. As the technology evolves, AI promises to deliver even more immersive and personalized entertainment experiences."
    }
  ];

  const useCases = {
    healthcare: {
      title: "Healthcare",
      description: "AI is revolutionizing healthcare with improved diagnostics, personalized treatment plans, and efficient patient care systems.",
      stats: [
        { label: "Diagnostic Accuracy", value: "92%" },
        { label: "Time Saved", value: "60%" },
        { label: "Patient Satisfaction", value: "87%" }
      ]
    },
    finance: {
      title: "Finance",
      description: "Financial institutions leverage AI for fraud detection, algorithmic trading, and personalized banking experiences.",
      stats: [
        { label: "Fraud Detection", value: "99.6%" },
        { label: "Processing Speed", value: "150x" },
        { label: "Cost Reduction", value: "35%" }
      ]
    },
    entertainment: {
      title: "Entertainment",
      description: "AI creates personalized content recommendations, realistic game characters, and innovative creative tools.",
      stats: [
        { label: "Engagement", value: "+78%" },
        { label: "Content Creation", value: "5x" },
        { label: "User Retention", value: "83%" }
      ]
    },
    education: {
      title: "Education",
      description: "Personalized learning experiences and intelligent tutoring systems are changing how we educate future generations.",
      stats: [
        { label: "Learning Speed", value: "+42%" },
        { label: "Completion Rate", value: "89%" },
        { label: "Knowledge Retention", value: "+57%" }
      ]
    },
    manufacturing: {
      title: "Manufacturing",
      description: "Smart factories use AI for predictive maintenance, quality control, and optimized production processes.",
      stats: [
        { label: "Defect Detection", value: "99.8%" },
        { label: "Downtime Reduction", value: "72%" },
        { label: "Production Efficiency", value: "+43%" }
      ]
    },
    transportation: {
      title: "Transportation",
      description: "From autonomous vehicles to intelligent traffic systems, AI is reshaping how we move and transport goods.",
      stats: [
        { label: "Safety Improvement", value: "73%" },
        { label: "Fuel Efficiency", value: "+28%" },
        { label: "Traffic Congestion", value: "-35%" }
      ]
    }
  };

  const features = [
    {
      icon: <FaRobot size={28} />, 
      title: "AI in Robotics", 
      description: "Explore how AI is revolutionizing automation and robotics with advanced algorithms."
    },
    {
      icon: <FaLightbulb size={28} />, 
      title: "Creative AI", 
      description: "From music to art, AI is pushing the boundaries of human creativity."
    },
    {
      icon: <FaCode size={28} />, 
      title: "AI Development", 
      description: "Learn about frameworks, models, and tools that power modern AI systems."
    },
    {
      icon: <FaGlobe size={28} />, 
      title: "Global Impact", 
      description: "AI's role in addressing global challenges like climate change and healthcare."
    },
    {
      icon: <FaChartLine size={28} />, 
      title: "Predictive Analytics", 
      description: "AI-driven insights for better decision-making in business and science."
    },
    {
      icon: <FaMicrochip size={28} />, 
      title: "AI Hardware", 
      description: "Advancements in AI-specific processors and hardware optimization."
    },
    {
      icon: <FaBrain size={28} />, 
      title: "Neural Networks", 
      description: "The backbone of modern AI technologies and innovations."
    },
    {
      icon: <FaBalanceScale size={28} />, 
      title: "Ethical AI", 
      description: "Building AI systems that are fair, transparent, and ethical."
    }
  ];

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
    <div className="min-h-screen bg-white text-gray-800">
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-full bg-purple-600 group-hover:bg-purple-500 transition-all duration-300 shadow-md">
            <ArrowLeft size={18} className="text-white" />
          </div>
        </Link>
      </div>

      {/* Header Section */}
      <header className="pt-24 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            The Future of AI
          </h1>
          <p className="text-gray-600 mt-6 text-xl max-w-3xl mx-auto">
            Discover the endless possibilities of Artificial Intelligence and how it's shaping our world for a better tomorrow.
          </p>
        </motion.div>
      </header>

      {/* Feature Highlights */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Explore AI Capabilities
          </motion.h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">AI Use Cases</h2>
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.keys(useCases).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                    activeTab === key
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {useCases[key].title}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-purple-700 mb-4">
                  {useCases[activeTab].title}
                </h3>
                <p className="text-gray-600 mb-8">
                  {useCases[activeTab].description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {useCases[activeTab].stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">{stat.value}</div>
                      <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Case Studies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div 
                key={study.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setActiveCaseStudy(study)}
              >
                <div className="aspect-video bg-gray-200 relative">
                  {/* If you have actual images, use next/image component */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {study.content.split(' ').slice(0, 20).join(' ')}...
                  </p>
                  <button className="text-purple-600 font-medium flex items-center">
                    Read Case Study
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Join the AI Revolution</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Be part of the innovation that is changing the way we live, work, and interact with technology.
          </p>
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg rounded-full shadow-lg transition-all font-medium">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Case Study Modal */}
      {activeCaseStudy && (
        <div 
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          onClick={() => setActiveCaseStudy(null)}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50"
          ></motion.div>
          
          <div className="absolute top-6 right-6 z-30">
            <button 
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
              onClick={() => setActiveCaseStudy(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            className="relative max-w-4xl mx-auto z-20 p-8 pt-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-2 bg-gray-200 rounded-full absolute top-6 left-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {activeCaseStudy.title}
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-8">
                {activeCaseStudy.content}
              </p>
            </div>
            
            <button 
              className="mt-6 px-6 py-3 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition-colors"
              onClick={() => setActiveCaseStudy(null)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AiFuturesPage;