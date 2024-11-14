'use client'
import { useState } from "react";
import Image from "next/image";
import Mannequin from "./Mannequin";
import Navbar from "./Navbar";
import AllButton from './AllButton';

export default function DashboardForm({ lowerBodyImage, upperBodyImage, handleUpperImageChange, handleLowerImageChange }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAskQuestion = async () => {
    const mockAnswer = "This outfit looks great! 8/10";
    setAnswer(mockAnswer);
  };

  return (
    <div id="home" className="min-h-screen w-full bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] relative">
      <div className="min-h-screen w-full bg-center flex items-center justify-center">
        <Image 
          src="/images/Apple-Tv.png" 
          alt="Glamorize" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 z-0 w-full h-full filter " // Arka planı karartmak için
        />
        <div className="relative z-10 py-8 px-4 md:py-12 md:px-12 bg-white shadow-2xl rounded-3xl w-11/12 sm:w-4/5 lg:w-1/2 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 md:mb-8">
            Glamorize <span className="bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-transparent bg-clip-text">AI</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6">
            {/* Upper Part Selection */}
            <div className="flex flex-col items-center">
              <div className="text-md sm:text-lg md:text-xl font-light mb-4">Selected Upper Part</div>
              {upperBodyImage ? (
                <img src={upperBodyImage} alt="Upper Body" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg" />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-center text-sm">No upper body image selected</p>
                </div>
              )}
              <label className="mt-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleUpperImageChange}
                />
                <div className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform duration-300 mt-4">
                  Upload Upper Part
                </div>
              </label>
            </div>
            
            <Mannequin />
            
            {/* Lower Part Selection */}
            <div className="flex flex-col items-center">
              <div className="text-md sm:text-lg md:text-xl font-light mb-4">Selected Lower Part</div>
              {lowerBodyImage ? (
                <img src={lowerBodyImage} alt="Lower Body" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg" />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-center text-sm">No lower body image selected</p>
                </div>
              )}
              <label className="mt-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleLowerImageChange}
                />
                <div className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform duration-300 mt-4">
                  Upload Lower Part
                </div>
              </label>
            </div>
          </div>

          {/* Question Section */}
          <div className="pt-10">
            <AllButton title="Try-On" />
          </div>

          <div className="mt-8">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask how the outfit looks..."
              className="border border-blue-200 rounded-lg px-4 py-2 w-full text-lg"
            />
            <button
              onClick={handleAskQuestion}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-[#2f2f2f] to-[#000000] text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-300 ease-in-out"
            >
              Ask AI
            </button>

            {answer && (
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <p className="text-gray-700">{answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
