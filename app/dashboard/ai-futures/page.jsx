'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaRobot, FaLightbulb, FaCode, FaGlobe, FaChartLine, FaMicrochip, FaBrain } from 'react-icons/fa';

const AiFuturesPage = () => {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);

  const caseStudies = [
    {
      id: 1,
      title: "Case Study 1",
      content:
        "An in-depth look at how AI transformed healthcare systems to improve patient outcomes. Artificial Intelligence has revolutionized the healthcare industry by enabling faster and more accurate diagnosis of diseases through tools like AI-powered imaging and pattern recognition in medical data. AI also aids in personalized medicine, tailoring treatment plans based on an individual’s genetic profile. Furthermore, virtual health assistants and chatbots are enhancing patient engagement by providing instant responses to queries and scheduling appointments. AI-driven predictive analytics is helping hospitals optimize resources, manage patient flow, and anticipate potential outbreaks. With continuous advancements, AI is paving the way for more efficient and effective healthcare systems."
    },
    {
      id: 2,
      title: "Case Study 2",
      content:
        "How AI is revolutionizing the finance industry with predictive analytics and fraud detection. The financial sector has embraced AI for its ability to analyze vast amounts of data quickly and accurately. AI algorithms are used to predict market trends, helping investors make informed decisions with higher confidence. Additionally, AI-driven systems can detect fraudulent transactions in real time by identifying unusual patterns in data. Robo-advisors, powered by AI, are democratizing wealth management by offering personalized financial advice at a fraction of traditional costs. Moreover, AI-powered credit scoring systems provide fairer assessments by analyzing non-traditional data points. The integration of AI in finance has not only improved efficiency but also enhanced security and accessibility."
    },
    {
      id: 3,
      title: "Case Study 3",
      content:
        "Exploring AI's role in creating immersive entertainment experiences and gaming advancements. AI is transforming the entertainment industry by enabling the creation of personalized content recommendations on platforms like Netflix and Spotify, which enhance user experience. In gaming, AI-driven non-playable characters (NPCs) provide more realistic and engaging interactions, adapting their behavior based on player actions. AI is also used in procedural content generation, allowing developers to create expansive game worlds with minimal manual effort. In the film industry, AI is being used for scriptwriting assistance, visual effects automation, and even deepfake technology to resurrect historical figures. As the technology evolves, AI promises to deliver even more immersive and personalized entertainment experiences."
    }
  ];
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-10 relative">
      {activeCaseStudy && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl text-center shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">{activeCaseStudy.title}</h3>
            <p className="text-gray-400 mb-6">{activeCaseStudy.content}</p>
            <button
              onClick={() => setActiveCaseStudy(null)}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className='absolute top-10 left-10'>
        <Link href="/dashboard" className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300">
          ←
        </Link>
      </div>

      {/* Header Section */}
      <header className="text-center mb-16">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          The Future of AI
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Discover the endless possibilities of Artificial Intelligence and how it's shaping our world.
        </p>
      </header>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          {
            icon: <FaRobot size={50} />, 
            title: "AI in Robotics", 
            description: "Explore how AI is revolutionizing automation and robotics with advanced algorithms."
          },
          {
            icon: <FaLightbulb size={50} />, 
            title: "Creative AI", 
            description: "From music to art, AI is pushing the boundaries of human creativity."
          },
          {
            icon: <FaCode size={50} />, 
            title: "AI Development", 
            description: "Learn about frameworks, models, and tools that power modern AI systems."
          },
          {
            icon: <FaGlobe size={50} />, 
            title: "Global Impact", 
            description: "AI's role in addressing global challenges like climate change and healthcare."
          },
          {
            icon: <FaChartLine size={50} />, 
            title: "Predictive Analytics", 
            description: "AI-driven insights for better decision-making in business and science."
          },
          {
            icon: <FaMicrochip size={50} />, 
            title: "AI Hardware", 
            description: "Advancements in AI-specific processors and hardware optimization."
          },
          {
            icon: <FaBrain size={50} />, 
            title: "Neural Networks", 
            description: "The backbone of modern AI technologies and innovations."
          },
          {
            icon: <FaGlobe size={50} />, 
            title: "Ethical AI", 
            description: "Building AI systems that are fair, transparent, and ethical."
          }
        ].map((feature, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-blue-400 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Interactive Section */}
      <section className="bg-gray-800 rounded-lg shadow-lg max-w-5xl mx-auto p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">AI Use Cases</h2>
        <p className="text-gray-400 mb-8">
          Discover practical applications of AI in various industries, from healthcare to entertainment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Healthcare', 'Finance', 'Entertainment', 'Education', 'Manufacturing', 'Transportation'].map((useCase, index) => (
            <button
              key={index}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition"
            >
              {useCase}
            </button>
          ))}
        </div>
      </section>

      {/* Case Study Section */}
      <section className="bg-gradient-to-b from-black to-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">Case Studies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-white mb-3">{caseStudy.title}</h3>
                <p className="text-gray-400 mb-4">
                  {caseStudy.content.slice(0, 50)}...
                </p>
                <button
                  onClick={() => setActiveCaseStudy(caseStudy)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-16">
        <h2 className="text-4xl font-bold mb-6">Join the AI Revolution</h2>
        <p className="text-gray-400 mb-8">
          Be part of the innovation that is changing the way we live, work, and interact with technology.
        </p>
        <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg shadow-lg transition">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500">
        <p>&copy; 2024 AI Futures - All Rights Reserved.</p>
        <p>
          <a href="#privacy-policy" className="hover:text-white">Privacy Policy</a> |
          <a href="#terms-of-service" className="hover:text-white"> Terms of Service</a>
        </p>
      </footer>
    </div>
  );
};

export default AiFuturesPage;
