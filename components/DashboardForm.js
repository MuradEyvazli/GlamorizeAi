'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DashboardForm = () => {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState(null);
  const [selectedPersonImage, setSelectedPersonImage] = useState(null);
  const [selectedGarmentImage, setSelectedGarmentImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const plansRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      setGlobalLoading(true);
      try {
        if (session?.user?.id) {
          const response = await fetch(`/api/user/${session.user.id}`);
          const data = await response.json();
          setIsSubscribed(data.subscriptionStatus);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setGlobalLoading(false);
      }
    };
    fetchUser();
  }, [session]);

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

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file && validateImage(file)) {
      setImage(file);
    }
  };

  const handleExampleClick = async (imageUrl, setImage) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'example.jpg', { type: blob.type });
      setImage(file);
    } catch (error) {
      console.error('Error loading example image:', error);
    }
  };

  const handleRunClick = async () => {
    if (!isSubscribed) {
      alert('You need an active subscription to use this feature.');
      return;
    }
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

  const handleQuestionSubmit = async () => {
    if (!isSubscribed) {
      alert('You need an active subscription to ask AI questions.');
      return;
    }
    if (!resultImage) {
      alert('Please wait for the generated photo before asking questions!');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(resultImage);
      const blob = await response.blob();
      const file = new File([blob], 'result.jpg', { type: blob.type });
      const resultImageBase64 = await toBase64WithoutPrefix(file);

      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultImageBase64, question }),
      });

      if (!res.ok) {
        alert('API request failed.');
        return;
      }

      const data = await res.json();
      if (!data.success) {
        setAnalysisResponse('Analysis failed: ' + data.message);
      } else {
        setAnalysisResponse(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const toBase64WithoutPrefix = async (input) => {
    if (typeof input === 'string') {
      const response = await fetch(input);
      input = await response.blob();
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (input instanceof Blob || input instanceof File) {
        reader.readAsDataURL(input);
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
      } else {
        reject(new Error('Invalid input type. Must be a File, Blob, or valid image URL.'));
      }
      reader.onerror = () => reject(new Error('Failed to read the file.'));
    });
  };

  const fetchResult = async (taskId) => {
    try {
      const response = await fetch(`/api/try-on-result?taskId=${taskId}`);
      const data = await response.json();
      if (data.success && data.resultImageUrl) {
        setResultImage(data.resultImageUrl);
        setIsLoading(false);
        return true;
      } else if (data.taskStatus === 'in_progress' || data.taskStatus === 'processing') {
        return false;
      } else {
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center">
      {/* Global loading ekranı */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-screen-xl px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* Büyük Başlık */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`
            relative
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            font-extrabold
            text-center
            my-6
            // Gradient Text
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-blue-500
            via-cyan-500
            to-green-500
            // Hover Efekti
            transition-transform
            duration-500
            ease-in-out
            hover:scale-110
            cursor-pointer
            // Parlama (Glow) efekti => Tailwind custom animation
            animate-glow-loop
            mt-16
            mb-8
          `}
          style={{
            textShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
          }}
        >
          Glamorize-AI Creative Studio
        </motion.h1>

        {/* 3 Özelliği gösteren kutular */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">AI Images</h2>
            <p className="text-gray-400 text-sm sm:text-base">Powered by Glamorize Ai</p>
            <Link href="/dashboard/generated-images">
              <button className="mt-4 sm:mt-6 bg-blue-500 px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-600 transition">
                Explore
              </button>
            </Link>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">AI Futures</h2>
            <p className="text-gray-400 text-sm sm:text-base">Powered by Glamorize Ai</p>
            <Link href="/dashboard/ai-futures">
              <button className="mt-4 sm:mt-6 bg-blue-500 px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-600 transition">
                Explore
              </button>
            </Link>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Video Editor</h2>
            <p className="text-gray-400 text-sm sm:text-base">Coming Soon..</p>
          </div>
        </div>

        {/* Hoşgeldiniz Açıklaması */}
        <div className="text-center bg-gray-800 rounded-lg p-4 sm:p-8 shadow-lg mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Welcome to Glamorize-AI!</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            Glamorize-AI is a platform that allows you to virtually try on outfits, supports you with smart analytics, and helps you discover your personal style.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="p-4 sm:p-6 bg-gray-700 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">🧑‍🎨 Virtual Try-On</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Upload your own photo and see how different outfits look on you, instantly.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-gray-700 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">🧠 Smart Analysis</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Ask AI-powered questions to gain deeper insights into your style.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-gray-700 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">💎 Subscription Benefits</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Enjoy exclusive features and unlimited usage to elevate your style to the highest level.
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-12">
            <a href="#plans">
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-base sm:text-lg rounded-lg hover:shadow-lg transition">
                {isSubscribed ? 'Delete Subscription' : 'Subscribe Now'}
              </button>
            </a>
          </div>
        </div>

        {/* Eğer abone ise */}
        {isSubscribed && (
          <>
            {/* Kişi resmi (Person Image) ve örnek görseller */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Example Person Images</h3>

                {/* Kullanıcı dosya yükleme alanı */}
                <div className="border-2 border-dashed border-gray-400 rounded-lg h-40 sm:h-56 md:h-72 flex items-center justify-center mb-4 sm:mb-6">
                  {selectedPersonImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(selectedPersonImage)}
                        alt="Selected Person"
                        fill
                        unoptimized
                        style={{ objectFit: 'contain' }}
                        className="rounded-md"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm sm:text-base">Drag & Drop or Click to Upload</p>
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
                  className="block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-center cursor-pointer text-sm sm:text-base"
                >
                  Choose Image
                </label>

                {/* Örnek fotoğraflar */}
                <div className="mt-4 flex gap-2 justify-center">
                  <Image
                    src="/humans/000.png"
                    alt="Example Person 1"
                    className="cursor-pointer w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md hover:opacity-80 transition"
                    width={80}
                    height={120}
                    onClick={() => handleExampleClick('/humans/000.png', setSelectedPersonImage)}
                  />
                  <Image
                    src="/humans/001.png"
                    alt="Example Person 2"
                    className="cursor-pointer w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md hover:opacity-80 transition"
                    width={80}
                    height={120}
                    onClick={() => handleExampleClick('/humans/001.png', setSelectedPersonImage)}
                  />
                  <Image
                    src="/humans/002.png"
                    alt="Example Person 3"
                    className="cursor-pointer w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md hover:opacity-80 transition"
                    width={80}
                    height={120}
                    onClick={() => handleExampleClick('/humans/002.png', setSelectedPersonImage)}
                  />
                </div>
              </div>

              {/* Kıyafet resmi (Garment Image) ve örnek görseller */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Example Garment Images</h3>

                {/* Kullanıcı dosya yükleme alanı */}
                <div className="border-2 border-dashed border-gray-400 rounded-lg h-40 sm:h-56 md:h-72 flex items-center justify-center mb-4 sm:mb-6">
                  {selectedGarmentImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(selectedGarmentImage)}
                        alt="Selected Garment"
                        fill
                        unoptimized
                        style={{ objectFit: 'contain' }}
                        className="rounded-md"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm sm:text-base">Drag & Drop or Click to Upload</p>
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
                  className="block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-center cursor-pointer text-sm sm:text-base"
                >
                  Choose Image
                </label>

                {/* Üç adet örnek kıyafet */}
                <div className="mt-4 flex gap-2 justify-center">
                  <Image
                    src="/cloth/02_upper.jpg"
                    alt="Example Garment 1"
                    className="cursor-pointer w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md hover:opacity-80 transition"
                    width={80}
                    height={120}
                    onClick={() => handleExampleClick('/cloth/02_upper.jpg', setSelectedGarmentImage)}
                  />
                  <Image
                    src="/cloth/03_upper.jpg"
                    alt="Example Garment 2"
                    className="cursor-pointer w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md hover:opacity-80 transition"
                    width={80}
                    height={120}
                    onClick={() => handleExampleClick('/cloth/03_upper.jpg', setSelectedGarmentImage)}
                  />
                  <Image
                    src="/cloth/04_upper.jpg"
                    alt="Example Garment 3"
                    className="cursor-pointer w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-md hover:opacity-80 transition"
                    width={80}
                    height={120}
                    onClick={() => handleExampleClick('/cloth/04_upper.jpg', setSelectedGarmentImage)}
                  />
                </div>
              </div>
            </div>

            {/* Sonuç görseli ve AI analizi */}
            <div className="bg-gray-800 rounded-lg shadow-lg mt-8 sm:mt-16 p-4 sm:p-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">Get Try-On Results</h2>
              <div className="border-2 border-dashed border-gray-400 rounded-lg h-40 sm:h-56 md:h-72 flex items-center justify-center mb-4 sm:mb-6">
                {resultImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={resultImage}
                      alt="Result"
                      fill
                      unoptimized
                      style={{ objectFit: 'contain' }}
                      className="rounded-md"
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm sm:text-base">Results will appear here</p>
                )}
              </div>
              <button
                onClick={handleRunClick}
                disabled={!isSubscribed}
                className={`w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
                }`}
              >
                {isLoading ? 'Processing...' : 'Run Try-On'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mt-8 sm:mt-8 mb-10 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">AI Analysis</h2>
              <textarea
                placeholder="Ask some questions about your outfit? (e.g., 'What color is the shirt?')"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3 sm:p-6 rounded-lg bg-gray-700 text-white mb-4 text-sm sm:text-base"
                rows="3"
              />
              <button
                onClick={handleQuestionSubmit}
                disabled={!isSubscribed}
                className={`w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isLoading ? 'Analyzing...' : 'Ask AI'}
              </button>
              {analysisResponse && (
                <div className="mt-4 bg-gray-700 p-4 rounded-lg text-left text-sm sm:text-base">
                  <p className="text-gray-300">{analysisResponse}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardForm;
