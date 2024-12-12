'use client';

import React, { useState } from 'react';

const DashboardForm = () => {
  const [selectedPersonImage, setSelectedPersonImage] = useState(null);
  const [selectedGarmentImage, setSelectedGarmentImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toBase64WithoutPrefix = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        try {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } catch (error) {
          console.error('Base64 Parsing Error:', error.message);
          reject(new Error('Invalid Base64 data.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read the file.'));
    });
  };

  const validateImage = (file) => {
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validFormats.includes(file.type)) {
      alert('Invalid image format! Only JPG, JPEG, or PNG are allowed.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds the 10MB limit.');
      return false;
    }
    return true;
  };

  const fetchResult = async (taskId) => {
    try {
      const response = await fetch(`/api/try-on-result?taskId=${taskId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (data.success && data.resultImageUrl) {
        setResultImage(data.resultImageUrl);
        setIsLoading(false);
        return true;
      } else if (data.taskStatus === 'in_progress' || data.taskStatus === 'processing') {
        console.log('Task is still processing...');
        return false;
      } else {
        console.error('Error fetching task result:', data.message);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Error fetching task result:', error.message);
      setIsLoading(false);
      return true;
    }
  };

  const handleRunClick = async () => {
    if (!selectedPersonImage || !selectedGarmentImage) {
      alert('Please select both a person and a garment image!');
      return;
    }

    try {
      setIsLoading(true);
      setResultImage(null);

      const personImageBase64 = await toBase64WithoutPrefix(selectedPersonImage);
      const garmentImageBase64 = await toBase64WithoutPrefix(selectedGarmentImage);

      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: personImageBase64,
          garmentImage: garmentImageBase64,
        }),
      });

      const data = await response.json();
      if (data.success && data.taskId) {
        const taskId = data.taskId;
        const pollInterval = setInterval(async () => {
          const isReady = await fetchResult(taskId);
          if (isReady) {
            clearInterval(pollInterval);
          }
        }, 5000);
      } else {
        alert(`API Error: ${data.message}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Processing Error:', error.message);
      alert(`An error occurred: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file && validateImage(file)) {
      setImage(file);
    }
  };

  return (
    <div className="min-h-screen   flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl px-8 py-16">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-900">
          Glamorize{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI
          </span>{' '}
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-lg p-10">
            <h2 className="text-2xl font-semibold text-center mb-6">Step 1. Upload a Person Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-[450px]  flex items-center justify-center mb-6">
              {selectedPersonImage ? (
                <img
                  src={URL.createObjectURL(selectedPersonImage)}
                  alt="Selected Person"
                  className="h-full object-contain rounded-md"
                />
              ) : (
                <p className="text-gray-500 text-lg">Drag & Drop or Click to Upload</p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="person-upload"
              onChange={(e) => handleImageChange(e, setSelectedPersonImage)}
            />
            <label
              htmlFor="person-upload"
              className="block w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-center cursor-pointer"
            >
              Choose Image
            </label>
          </div>

          <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-lg p-10">
            <h2 className="text-2xl font-semibold text-center mb-6">Step 2. Upload a Garment Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-[450px] flex items-center justify-center mb-6">
              {selectedGarmentImage ? (
                <img
                  src={URL.createObjectURL(selectedGarmentImage)}
                  alt="Selected Garment"
                  className="h-full object-contain rounded-md"
                />
              ) : (
                <p className="text-gray-500 text-lg">Drag & Drop or Click to Upload</p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="garment-upload"
              onChange={(e) => handleImageChange(e, setSelectedGarmentImage)}
            />
            <label
              htmlFor="garment-upload"
              className="block w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-center cursor-pointer"
            >
              Choose Image
            </label>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-8">Step 3. Press "Run" to Get Try-On Results</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-[550px]  flex items-center justify-center mb-6">
            {resultImage ? (
              <img src={resultImage} alt="Result" className="h-full object-contain rounded-md" />
            ) : (
              <p className="text-gray-500 text-lg">Result will appear here</p>
            )}
          </div>
          <button
            onClick={handleRunClick}
            disabled={isLoading}
            className={`w-full px-8 py-4 rounded-lg text-lg font-semibold shadow-md transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500  text-white hover:scale-105 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
    <>
      <span className="loader mr-2 text-white"></span>
      Processing,Please wait 10-20 seconds...
    </>
  ) : (
    'Run'
  )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardForm;