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

  const handleExampleClick = (imageUrl, setImage) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], 'example.jpg', { type: blob.type });
        setImage(file);
      })
      .catch((error) => console.error('Error loading example image:', error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-screen-xl px-8 py-16">
        <h1 className="text-5xl font-extrabold text-center mb-16 mt-5 hover:text-blue-500 transition">
          Glamorize-AI Creative Studio
        </h1>

        <div className="grid grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">AI Images</h2>
            <p className="text-gray-400">Powered by Kolors</p>
            <button className="mt-6 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
              Explore
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">AI Videos</h2>
            <p className="text-gray-400">Powered by KLING</p>
            <button className="mt-6 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
              Explore
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Video Editor</h2>
            <p className="text-gray-400">Coming Soon</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Example Person Images</h3>
            <div className="grid grid-cols-3 gap-4">
              <img
                src="/humans/000.png"
                alt="Example 1"
                className="h-36 object-cover rounded-md cursor-pointer"
                onClick={() => handleExampleClick('/humans/000.png', setSelectedPersonImage)}
              />
              <img
                src="/humans/001.png"
                alt="Example 2"
                className="h-36 object-cover rounded-md cursor-pointer"
                onClick={() => handleExampleClick('/humans/001.png', setSelectedPersonImage)}
              />
              <img
                src="/humans/002.png"
                alt="Example 3"
                className="h-36 object-cover rounded-md cursor-pointer"
                onClick={() => handleExampleClick('/humans/002.png', setSelectedPersonImage)}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Example Garment Images</h3>
            <div className="grid grid-cols-3 gap-4">
              <img
                src="/cloth/00_upper.jpg"
                alt="Example 1"
                className="h-36 object-cover rounded-md cursor-pointer"
                onClick={() => handleExampleClick('/cloth/00_upper.jpg', setSelectedGarmentImage)}
              />
              <img
                src="/cloth/01_upper.jpg"
                alt="Example 2"
                className="h-36 object-cover rounded-md cursor-pointer"
                onClick={() => handleExampleClick('/cloth/01_upper.jpg', setSelectedGarmentImage)}
              />
              <img
                src="/cloth/02_upper.jpg"
                alt="Example 3"
                className="h-36 object-cover rounded-md cursor-pointer"
                onClick={() => handleExampleClick('/cloth/02_upper.jpg', setSelectedGarmentImage)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-16">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-8">Step 1. Upload a Person Image</h2>
            <div className="border-2 border-dashed border-gray-400 rounded-lg h-72 flex items-center justify-center mb-6">
              {selectedPersonImage ? (
                <img src={URL.createObjectURL(selectedPersonImage)} alt="Selected Person" className="h-full object-contain rounded-md" />
              ) : (
                <p className="text-gray-400">Drag & Drop or Click to Upload</p>
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
              className="block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              Choose Image
            </label>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-8">Step 2. Upload a Garment Image</h2>
            <div className="border-2 border-dashed border-gray-400 rounded-lg h-72 flex items-center justify-center mb-6">
              {selectedGarmentImage ? (
                <img src={URL.createObjectURL(selectedGarmentImage)} alt="Selected Garment" className="h-full object-contain rounded-md" />
              ) : (
                <p className="text-gray-400">Drag & Drop or Click to Upload</p>
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
              className="block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-center cursor-pointer"
            >
              Choose Image
            </label>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg mt-16 p-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Get Try-On Results</h2>
          <div className="border-2 border-dashed border-gray-400 rounded-lg h-72 flex items-center justify-center mb-6">
            {resultImage ? (
              <img src={resultImage} alt="Result" className="h-full object-contain rounded-md" />
            ) : (
              <p className="text-gray-400">Results will appear here</p>
            )}
          </div>
          <button
            onClick={handleRunClick}
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-lg font-bold text-lg transition-colors ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Processing...' : 'Run Try-On'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardForm;
