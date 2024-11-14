'use client';
import { useState } from 'react';

export default function UploadClothes() {
  const [upperBodyFile, setUpperBodyFile] = useState(null);
  const [lowerBodyFile, setLowerBodyFile] = useState(null);

  const handleUploadUpper = (e) => {
    setUpperBodyFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleUploadLower = (e) => {
    setLowerBodyFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Upload Your Clothes</h2>
      
      {/* Üst Beden Yükleme */}
      <div className="w-full">
        <label className="block text-gray-700 text-lg font-bold mb-2">Upload Upper Body:</label>
        <input
          type="file"
          onChange={handleUploadUpper}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Alt Beden Yükleme */}
      <div className="w-full">
        <label className="block text-gray-700 text-lg font-bold mb-2">Upload Lower Body:</label>
        <input
          type="file"
          onChange={handleUploadLower}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Yüklenen Resimlerin Gösterimi */}
      <div className="w-full flex flex-col space-y-4 mt-6">
        {upperBodyFile && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Uploaded Upper Body:</h3>
            <img src={upperBodyFile} alt="Upper Body" className="w-full h-32 object-cover rounded-lg" />
          </div>
        )}
        {lowerBodyFile && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Uploaded Lower Body:</h3>
            <img src={lowerBodyFile} alt="Lower Body" className="w-full h-32 object-cover rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
