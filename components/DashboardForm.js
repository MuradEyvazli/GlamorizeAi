'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const DashboardForm = () => {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPersonImage, setSelectedPersonImage] = useState(null);
  const [selectedGarmentImage, setSelectedGarmentImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const [activeTab, setActiveTab] = useState('tryOn');
  // Yeni state: Kalan istek sayısı
  const [remainingRequests, setRemainingRequests] = useState(0);
  useEffect(() => {
    const fetchUser = async () => {
      setGlobalLoading(true);
      try {
        if (session?.user?.id) {
          const response = await fetch(`/api/user/${session.user.id}`);
          const data = await response.json();
          setIsSubscribed(data.subscriptionStatus);
          // Kalan istek sayısını da getir
          setRemainingRequests(data.remainingRequests || 0);
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
      showNotification('Invalid image format! Only JPG, JPEG, or PNG are allowed.', 'error');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      showNotification('Image size exceeds the 10MB limit.', 'error');
      return false;
    }
    return true;
  };

  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file && validateImage(file)) {
      setImage(file);
      showNotification('Image uploaded successfully!', 'success');
    }
  };

  const handleExampleClick = async (imageUrl, setImage) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'example.jpg', { type: blob.type });
      setImage(file);
      showNotification('Example image selected!', 'success');
    } catch (error) {
      console.error('Error loading example image:', error);
      showNotification('Failed to load example image.', 'error');
    }
  };

  // Add download image function
  const handleDownloadImage = async () => {
    if (!resultImage) {
      showNotification('No image to download!', 'error');
      return;
    }

    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the download filename
      link.download = 'glamorize-ai-result.jpg';
      
      // Append the link to the document body
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      showNotification('Image downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download Error:', error);
      showNotification(`Error downloading image: ${error.message}`, 'error');
    }
  };

  const handleRunClick = async () => {
    if (!isSubscribed) {
      showNotification('You need an active subscription to use this feature.', 'error');
      return;
    }
    // Kalan istek sayısını kontrol et
    if (remainingRequests <= 0) {
      showNotification('You have used all your requests. Please upgrade your subscription for more.', 'error');
      return;
    }
    if (!selectedPersonImage || !selectedGarmentImage) {
      showNotification('Please select both a person and a garment image!', 'error');
      return;
    }

    try {
      setIsLoading(true);
      setResultImage(null);
      showNotification('Processing your images...', 'info');

      const personImageBase64 = await toBase64WithoutPrefix(selectedPersonImage);
      const garmentImageBase64 = await toBase64WithoutPrefix(selectedGarmentImage);

      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: personImageBase64,
          garmentImage: garmentImageBase64,
          userId: session.user.id // Kullanıcı ID'sini de gönder
        }),
      });

      const data = await response.json();
      if (data.success && data.taskId) {
        const taskId = data.taskId;
        showNotification('Processing started. This may take a moment...', 'info');
        
        // API'den dönen güncel kalan istek sayısını güncelle
        if (data.remainingRequests !== undefined) {
          setRemainingRequests(data.remainingRequests);
        } else {
          // API kalan istek sayısını dönmezse, varsayılan olarak azalt
          setRemainingRequests(prev => prev - 1);
        }
        
        const pollInterval = setInterval(async () => {
          const isReady = await fetchResult(taskId);
          if (isReady) {
            clearInterval(pollInterval);
            showNotification('Your virtual try-on is ready!', 'success');
          }
        }, 5000);
      } else {
        showNotification(`API Error: ${data.message}`, 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Processing Error:', error.message);
      showNotification(`An error occurred: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!isSubscribed) {
      showNotification('You need an active subscription to ask AI questions.', 'error');
      return;
    }
    if (!resultImage) {
      showNotification('Please wait for the generated photo before asking questions!', 'error');
      return;
    }
    if (!question.trim()) {
      showNotification('Please enter a question.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showNotification('Analyzing your outfit...', 'info');

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
        showNotification('API request failed.', 'error');
        return;
      }

      const data = await res.json();
      if (!data.success) {
        setAnalysisResponse('Analysis failed: ' + data.message);
        showNotification('Analysis failed.', 'error');
      } else {
        setAnalysisResponse(data.message);
        showNotification('Analysis complete!', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('An error occurred during analysis.', 'error');
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

  const featureCards = [
    {
      title: "AI Images",
      description: "Create stunning AI-powered fashion images",
      link: "/dashboard/generated-images",
      icon: "✨",
      color: "from-violet-500 to-indigo-600"
    },
    {
      title: "AI Futures",
      description: "Explore upcoming fashion trends with AI",
      link: "/dashboard/ai-futures",
      icon: "🔮",
      color: "from-fuchsia-500 to-pink-600"
    },
    {
      title: "Video Editor",
      description: "Coming Soon - Create fashion videos with AI",
      link: "#",
      icon: "🎬",
      disabled: true,
      color: "from-gray-400 to-gray-600"
    }
  ];

  return (
    <div id='home' className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Notification system */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-xl backdrop-blur-sm ${
              notification.type === 'error' 
                ? 'bg-red-500/90 text-white' 
                : notification.type === 'success'
                ? 'bg-emerald-500/90 text-white'
                : 'bg-blue-500/90 text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {notification.type === 'error' ? '⚠️' : notification.type === 'success' ? '✓' : 'ℹ️'}
              </span>
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global loading screen */}
      {globalLoading && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 border-violet-200 animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Background design elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-100/60 via-violet-100/60 to-fuchsia-100/60 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-rose-100/60 via-pink-100/60 to-fuchsia-100/60 rounded-full blur-3xl"></div>
        <svg className="absolute top-0 right-0 w-full h-full z-0 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="url(#grid)" strokeWidth="0.2"></path>
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M5,0 L0,0 L0,5" fill="none" stroke="currentColor" strokeWidth="0.2"></path>
            </pattern>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block"
          >
            
          </motion.div>
          <div className="flex flex-col items-center">
            <h1 className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-800 via-fuchsia-700 to-indigo-800 tracking-tight relative z-10 mt-10 leading-tight">
              GLAMORIZE-AI
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full mx-auto mt-4"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
              Redefine your style journey with AI-powered fashion innovation
            </p>
          </div>
        </motion.header>

        {/* Feature Cards */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
                className={`relative overflow-hidden rounded-xl ${
                  card.disabled ? 'opacity-70' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 z-0"></div>
                <div className="absolute inset-0 backdrop-blur-sm bg-white/70 z-0"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br opacity-25 z-0 blur-xl"></div>
                
                <div className="p-8 backdrop-blur-sm relative z-10 h-full flex flex-col border border-gray-100/50 rounded-xl bg-white/50 shadow-lg shadow-gray-100/50">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br text-white flex items-center justify-center mb-6">
                    <div className={`w-full h-full rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{card.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{card.description}</p>
                  <Link href={card.link}>
                    <button 
                      disabled={card.disabled}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        card.disabled 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-white text-gray-800 hover:shadow-md border border-gray-200 hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      {card.disabled ? 'Coming Soon' : 'Explore'}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Welcome Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <div className="relative rounded-2xl overflow-hidden border border-gray-100/80 shadow-xl shadow-gray-100/40">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-fuchsia-50/50 z-0"></div>
            <div className="absolute inset-0 backdrop-blur-sm bg-white/60 z-0"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-300/10 to-violet-300/10 rounded-full transform translate-x-1/3 -translate-y-1/3 z-0"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-fuchsia-300/10 to-rose-300/10 rounded-full transform -translate-x-1/3 translate-y-1/3 z-0"></div>
            
            <div className="p-10 sm:p-12 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-fuchsia-800 mb-6">Welcome to Glamorize-AI</h2>
              <p className="text-gray-700 mb-10 max-w-3xl text-lg leading-relaxed">
                Discover the future of fashion with our AI-powered platform. Try on outfits virtually, get style recommendations, and explore your personal style with smart analytics.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100/60 transform transition-transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    <span className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl mr-4 shadow-sm">👕</span>
                    <h3 className="font-bold text-gray-800 text-lg">Virtual Try-On</h3>
                  </div>
                  <p className="text-gray-600">
                    See how clothes look on you without physically trying them on.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100/60 transform transition-transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    <span className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 text-xl mr-4 shadow-sm">🧠</span>
                    <h3 className="font-bold text-gray-800 text-lg">AI Analysis</h3>
                  </div>
                  <p className="text-gray-600">
                    Get smart feedback about your outfit choices and style.
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100/60 transform transition-transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    <span className="w-12 h-12 rounded-xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 text-xl mr-4 shadow-sm">✨</span>
                    <h3 className="font-bold text-gray-800 text-lg">Premium Features</h3>
                  </div>
                  <p className="text-gray-600">
                    Unlock unlimited try-ons and advanced recommendations with a subscription.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="#pricing"
                  className={`px-8 py-4 rounded-xl font-medium text-base transition-all ${
                    isSubscribed
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:shadow-lg border border-gray-200'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-xl hover:translate-y-[-2px]'
                  } shadow-md`}
                >
                  {isSubscribed ? 'Manage Subscription' : 'Subscribe Now'}
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {isSubscribed && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-20"
          >
            {/* Subscription Status & Remaining Requests Panel */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/60 mb-8 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
                <h3 className="font-bold text-lg">Your Subscription Status</h3>
              </div>
              <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 text-xl mr-4 shadow-sm">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Remaining Requests</h4>
                    <p className="text-sm text-gray-600">Your subscription allowance</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">{remainingRequests}</div>
                  <div className="bg-gray-100 rounded-xl px-3 py-1 ml-3 text-xs text-gray-600">requests left</div>
                </div>
              </div>
            </div>

            {/* Tabs navigation */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/60 mb-8 p-2">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('tryOn')}
                  className={`flex-1 py-3 px-5 text-center font-medium rounded-xl transition-all ${
                    activeTab === 'tryOn'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">👕</span>
                    Virtual Try-On
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-1 py-3 px-5 text-center font-medium rounded-xl transition-all ${
                    activeTab === 'analysis'
                      ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🧠</span>
                    AI Analysis
                  </span>
                </button>
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === 'tryOn' && (
                <motion.div
                  key="tryOn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Person Image */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/60 overflow-hidden">
                      <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                          <span className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-xl mr-3 shadow-sm">👤</span>
                          Select Person
                        </h3>
                        
                        <div 
                          className={`relative border-2 border-dashed rounded-xl h-72 flex items-center justify-center mb-6 overflow-hidden transition-all ${
                            selectedPersonImage ? 'border-violet-400 bg-violet-50/50' : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30'
                          }`}
                        >
                          {selectedPersonImage ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={URL.createObjectURL(selectedPersonImage)}
                                alt="Selected Person"
                                fill
                                unoptimized
                                style={{ objectFit: 'contain' }}
                                className="rounded-lg"
                              />
                              <button 
                                onClick={() => setSelectedPersonImage(null)}
                                className="absolute top-3 right-3 bg-white/90 text-red-500 p-1 rounded-lg w-9 h-9 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <div className="w-20 h-20 mx-auto rounded-xl bg-violet-50 flex items-center justify-center text-violet-300 text-4xl mb-5 shadow-sm">
                                👤
                              </div>
                              <p className="text-gray-500">
                                Drag & drop or click to upload
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-center mb-8">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="person-upload"
                            onChange={(e) => handleImageChange(e, setSelectedPersonImage)}
                          />
                          <label
                            htmlFor="person-upload"
                            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg cursor-pointer transition-all font-medium text-sm shadow-md"
                          >
                            Upload Image
                          </label>
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-500 mb-4 text-center">
                          Or choose from examples:
                        </h4>
                        
                        <div className="flex justify-center space-x-4">
                          {['/humans/000.png', '/humans/001.png', '/humans/002.png'].map((src, idx) => (
                            <div 
                              key={idx} 
                              className="cursor-pointer relative group"
                              onClick={() => handleExampleClick(src, setSelectedPersonImage)}
                            >
                              <div className="w-16 h-24 overflow-hidden rounded-lg border border-gray-100 shadow-md group-hover:shadow-lg transition-all">
                                <Image
                                  src={src}
                                  alt={`Example Person ${idx}`}
                                  width={80}
                                  height={120}
                                  className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                />
                              </div>
                              <div className="absolute inset-0 bg-violet-500 bg-opacity-0 group-hover:bg-opacity-20 transition-colors rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Garment Image */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/60 overflow-hidden">
                      <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                          <span className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl mr-3 shadow-sm">👕</span>
                          Select Garment
                        </h3>
                        
                        <div 
                          className={`relative border-2 border-dashed rounded-xl h-72 flex items-center justify-center mb-6 overflow-hidden transition-all ${
                            selectedGarmentImage ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                          }`}
                        >
                          {selectedGarmentImage ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={URL.createObjectURL(selectedGarmentImage)}
                                alt="Selected Garment"
                                fill
                                unoptimized
                                style={{ objectFit: 'contain' }}
                                className="rounded-lg"
                              />
                              <button 
                                onClick={() => setSelectedGarmentImage(null)}
                                className="absolute top-3 right-3 bg-white/90 text-red-500 p-1 rounded-lg w-9 h-9 flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <div className="w-20 h-20 mx-auto rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-300 text-4xl mb-5 shadow-sm">
                                👕
                              </div>
                              <p className="text-gray-500">
                                Drag & drop or click to upload
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-center mb-8">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="garment-upload"
                            onChange={(e) => handleImageChange(e, setSelectedGarmentImage)}
                          />
                          <label
                            htmlFor="garment-upload"
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg cursor-pointer transition-all font-medium text-sm shadow-md"
                          >
                            Upload Image
                          </label>
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-500 mb-4 text-center">
                          Or choose from examples:
                        </h4>
                        
                        <div className="flex justify-center space-x-4">
                          {['/cloth/02_upper.jpg', '/cloth/03_upper.jpg', '/cloth/04_upper.jpg'].map((src, idx) => (
                            <div 
                              key={idx} 
                              className="cursor-pointer relative group"
                              onClick={() => handleExampleClick(src, setSelectedGarmentImage)}
                            >
                              <div className="w-16 h-24 overflow-hidden rounded-lg border border-gray-100 shadow-md group-hover:shadow-lg transition-all">
                                <Image
                                  src={src}
                                  alt={`Example Garment ${idx}`}
                                  width={80}
                                  height={120}
                                  className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                />
                              </div>
                              <div className="absolute inset-0 bg-indigo-500 bg-opacity-0 group-hover:bg-opacity-20 transition-colors rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Result Image */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/60 overflow-hidden">
                      <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                          <span className="w-10 h-10 rounded-lg bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 text-xl mr-3 shadow-sm">✨</span>
                          Generated Result
                        </h3>
                        
                        <div 
                          className={`relative border-2 border-dashed rounded-xl h-72 flex items-center justify-center mb-6 overflow-hidden transition-all ${
                            resultImage ? 'border-fuchsia-400 bg-fuchsia-50/50' : 'border-gray-200'
                          }`}
                        >
                          {resultImage ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={resultImage}
                                alt="Result"
                                fill
                                unoptimized
                                style={{ objectFit: 'contain' }}
                                className="rounded-lg"
                              />
                              
                              {/* Download button */}
                              <button
                                onClick={handleDownloadImage}
                                className="absolute top-3 right-3 bg-white/90 text-indigo-600 p-1 rounded-lg w-9 h-9 flex items-center justify-center shadow-md hover:bg-indigo-600 hover:text-white transition-colors"
                                title="Download Image"
                              >
                                ↓
                              </button>
                              
                              {/* Decoration for the result */}
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-fuchsia-200/40 to-violet-200/40 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-indigo-200/40 to-violet-200/40 rounded-full blur-xl"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <div className="w-20 h-20 mx-auto rounded-xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-300 text-4xl mb-5 shadow-sm">
                                🖼️
                              </div>
                              <p className="text-gray-500">
                                Generated image will appear here
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={handleRunClick}
                          disabled={isLoading || !selectedPersonImage || !selectedGarmentImage || remainingRequests <= 0}
                          className={`w-full px-6 py-4 rounded-lg font-medium transition-all flex items-center justify-center shadow-md ${
                            isLoading
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : !selectedPersonImage || !selectedGarmentImage
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : remainingRequests <= 0
                              ? 'bg-red-100 text-red-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:shadow-xl'
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                              Processing...
                            </>
                          ) : remainingRequests <= 0 ? (
                            'No requests left'
                          ) : (
                            'Generate Try-On'
                          )}
                        </button>
                        
                        {remainingRequests <= 0 && (
                          <div className="mt-3 text-center">
                            <Link href="#pricing" className="text-sm text-fuchsia-600 hover:text-fuchsia-700 font-medium">
                              Upgrade your subscription for more requests
                            </Link>
                          </div>
                        )}
                        
                        {resultImage && (
                          <div className="mt-5 flex justify-end">
                            <button
                              onClick={() => setActiveTab('analysis')}
                              className="text-fuchsia-600 font-medium flex items-center hover:text-fuchsia-700 transition-colors"
                            >
                              Ask AI about this outfit
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Result Display for Analysis */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/60 overflow-hidden">
                      <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                          <span className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 text-xl mr-3 shadow-sm">🖼️</span>
                          Your Outfit
                        </h3>
                        
                        <div className="relative border-2 border-dashed border-gray-200 rounded-xl h-80 flex items-center justify-center mb-6 overflow-hidden shadow-inner">
                          {resultImage ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={resultImage}
                                alt="Your outfit"
                                fill
                                unoptimized
                                style={{ objectFit: 'contain' }}
                                className="rounded-lg"
                              />
                              
                              {/* Download button in analysis view too */}
                              <button
                                onClick={handleDownloadImage}
                                className="absolute top-3 right-3 bg-white/90 text-indigo-600 p-1 rounded-lg w-9 h-9 flex items-center justify-center shadow-md hover:bg-indigo-600 hover:text-white transition-colors"
                                title="Download Image"
                              >
                                ↓
                              </button>
                              
                              {/* Decorative elements for the analysis image */}
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-rose-200/30 to-fuchsia-200/30 rounded-full blur-xl"></div>
                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-full blur-xl"></div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <div className="w-20 h-20 mx-auto rounded-xl bg-rose-50 flex items-center justify-center text-rose-300 text-4xl mb-5 shadow-sm">
                                ⚠️
                              </div>
                              <p className="text-gray-500 mb-6">
                                Please generate an outfit in the Try-On tab first
                              </p>
                              <button
                                onClick={() => setActiveTab('tryOn')}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium shadow-md"
                              >
                                Go to Try-On
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Analysis */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100/60 overflow-hidden">
                      <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                          <span className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-xl mr-3 shadow-sm">🧠</span>
                          AI Stylist Analysis
                        </h3>
                        
                        <div className="mb-8">
                          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-3">
                            Ask about your outfit:
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              id="question"
                              placeholder="e.g., Does this color suit me? What accessories would go well?"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              className="flex-1 px-5 py-4 rounded-l-lg border border-gray-200 bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
                              disabled={!resultImage || isLoading}
                            />
                            <button
                              onClick={handleQuestionSubmit}
                              disabled={!resultImage || isLoading || !question.trim()}
                              className={`px-6 py-4 rounded-r-lg font-medium transition-all ${
                                !resultImage || isLoading || !question.trim()
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg shadow-md'
                              }`}
                            >
                              {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                'Ask'
                              )}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {['Does this color suit me?', 'What accessories would go well?', 'Is this outfit suitable for work?'].map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => setQuestion(q)}
                                disabled={!resultImage || isLoading}
                                className={`text-xs px-4 py-2 rounded-lg transition-all ${
                                  !resultImage || isLoading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 shadow-sm'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className={`rounded-xl overflow-hidden ${analysisResponse ? 'border border-gray-200 shadow-md' : ''}`}>
                          {analysisResponse ? (
                            <div className="p-6 bg-gradient-to-br from-white to-violet-50/40 backdrop-blur-sm max-h-72 overflow-y-auto">
                              <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                                {analysisResponse}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center p-8 bg-white/70 border border-dashed border-gray-200 rounded-xl shadow-inner">
                              <div className="w-20 h-20 mx-auto rounded-xl bg-violet-50 flex items-center justify-center text-violet-300 text-4xl mb-5">
                                💬
                              </div>
                              <p className="text-gray-500">
                                AI analysis will appear here
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default DashboardForm;