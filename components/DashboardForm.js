'use client'
import React, { useState } from 'react';

const DashboardForm = () => {
  // Generate image paths for /public/humans/ (Person Examples)
  const personImages = Array.from({ length: 12 }, (_, i) => `/humans/${i.toString().padStart(3, '0')}.png`);

  // Generate image paths for /public/cloth/ (Upper/Lower Examples)
  const garmentImages = Array.from({ length: 10 }, (_, i) => `/cloth/${i.toString().padStart(2, '0')}_upper.jpg`);

  // State for selected person and garment images
  const [selectedPersonImage, setSelectedPersonImage] = useState(null);
  const [selectedGarmentImage, setSelectedGarmentImage] = useState(null);

  // Handlers for selecting images from examples
  const handlePersonExampleClick = (src) => {
    setSelectedPersonImage(src);
  };

  const handleGarmentExampleClick = (src) => {
    setSelectedGarmentImage(src);
  };

  return (
    <div className="fullscreen bg-cover bg-center ">
      <div className="bg-white bg-opacity-80 max-w-7xl mx-auto px-6 py-10 rounded-lg" >
        <h1 className="text-2xl font-semibold text-center mb-10">
          Glamorize AI-Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Examples Section */}
          <div className="col-span-1 space-y-8">
            {/* Person Examples */}
            <div className="border border-gray-300 rounded-lg p-6">
              <h2 className="text-lg font-medium text-center mb-4">Person/Models Examples</h2>
              <div className="grid grid-cols-3 gap-4">
                {personImages.map((src, index) => (
                  <div
                    key={index}
                    className="w-full h-20 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => handlePersonExampleClick(src)}
                  >
                    <img src={src} alt={`Person ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Upper/Lower Examples */}
            <div className="border border-gray-300 rounded-lg p-6">
              <h2 className="text-lg font-medium text-center mb-4">Upper/Lower Examples</h2>
              <div className="grid grid-cols-3 gap-4">
                {garmentImages.map((src, index) => (
                  <div
                    key={index}
                    className="w-full h-20 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => handleGarmentExampleClick(src)}
                  >
                    <img src={src} alt={`Garment ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Person Image Upload */}
              <div className="border border-gray-300 rounded-lg p-6">
                <h2 className="text-lg font-medium text-center mb-4">
                  Step 1. Upload a person image
                </h2>
                <div className="border-2 border-dashed border-gray-400 rounded-lg h-48 flex items-center justify-center mb-4">
                  {selectedPersonImage ? (
                    <img src={selectedPersonImage} alt="Selected Person" className="h-full object-contain" />
                  ) : (
                    <p className="text-gray-500">Drag & Drop Image Here</p>
                  )}
                </div>
                <p className="text-center text-gray-500 mb-2">- or -</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="person-upload"
                  onChange={(e) =>
                    setSelectedPersonImage(URL.createObjectURL(e.target.files[0]))
                  }
                />
                <label htmlFor="person-upload" className="block mx-auto px-6 py-2 bg-blue-500 text-white rounded-md text-center cursor-pointer">
                  Click to Upload
                </label>
              </div>

              {/* Garment Image Upload */}
              <div className="border border-gray-300 rounded-lg p-6">
                <h2 className="text-lg font-medium text-center mb-4">
                  Step 2. Upload a garment image
                </h2>
                <div className="border-2 border-dashed border-gray-400 rounded-lg h-48 flex items-center justify-center mb-4">
                  {selectedGarmentImage ? (
                    <img src={selectedGarmentImage} alt="Selected Garment" className="h-full object-contain" />
                  ) : (
                    <p className="text-gray-500">Drag & Drop Image Here</p>
                  )}
                </div>
                <p className="text-center text-gray-500 mb-2">- or -</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="garment-upload"
                  onChange={(e) =>
                    setSelectedGarmentImage(URL.createObjectURL(e.target.files[0]))
                  }
                />
                <label htmlFor="garment-upload" className="block mx-auto px-6 py-2 bg-blue-500 text-white rounded-md text-center cursor-pointer">
                  Click to Upload
                </label>
              </div>
            </div>

            {/* Results Section */}
            <div className="border border-gray-300 rounded-lg p-6 mt-10">
              <h2 className="text-lg font-medium text-center mb-4">
                Step 3. Press "Run" to get try-on results
              </h2>
              <div className="border-2 border-dashed border-gray-400 rounded-lg h-48 flex items-center justify-center mb-4">
                <p className="text-gray-500">Result</p>
              </div>
              <button className="block mx-auto px-6 py-2 bg-green-500 text-white rounded-md">
                Run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardForm;
