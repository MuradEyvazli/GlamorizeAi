'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ColorCatcher = () => {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [bonusPositions, setBonusPositions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [speed, setSpeed] = useState(1000);
  const [size, setSize] = useState(64);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      setPosition({
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
      });

      setBonusPositions(
        Array.from({ length: 3 }, () => ({
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 90}%`,
        }))
      );
    }, speed);

    return () => clearInterval(interval);
  }, [speed, isPaused, gameOver]);

  const handleClick = () => {
    if (gameOver || isPaused) return;
    setScore(score + 1);

    if (score + 1 === 10) {
      setGameOver(true);
    }
  };

  const handleBonusClick = (index) => {
    if (isPaused || gameOver) return;
    setScore(score + 3);
    setBonusPositions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setBonusPositions([]);
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    if (level === 'easy') {
      setSpeed(1200);
      setSize(80);
    } else if (level === 'medium') {
      setSpeed(800);
      setSize(60);
    } else if (level === 'hard') {
      setSpeed(500);
      setSize(40);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r text-white">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="absolute top-4 left-4 px-4 py-2  text-black rounded-lg shadow hover:bg-gray-200 transition"
      >
        ←
      </button>

      <h1
        className="text-5xl font-bold mb-6 mt-6 animate-pulse"
        style={{
          background: 'linear-gradient(to right, #66c1f6, #5a5ede)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        🎨 Color Catcher 🎮
      </h1>
      <p
        className="text-lg mb-4 italic"
        style={{
          background: 'linear-gradient(to right, #7ed6df, #22a6b3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Catch the moving block and score 10 to win!
      </p>

      {/* Kontrol Kutusu */}
      <button
        onClick={toggleControls}
        className="px-6 py-2 mb-4 rounded-lg text-lg font-bold bg-blue-500 hover:bg-blue-600 shadow-md transition transform hover:scale-110"
      >
        {showControls ? 'Hide Controls ✖️' : 'Show Controls ⚙️'}
      </button>

      {showControls && (
        <div className="flex flex-col items-center space-y-4 bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg transition-all duration-500">
          {/* Zorluk Seviyesi Butonları */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleDifficultyChange('easy')}
              className={`px-4 py-2 rounded-lg shadow-lg text-lg font-medium transition ${
                difficulty === 'easy' ? 'bg-green-500' : 'bg-gray-700 hover:bg-green-400'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => handleDifficultyChange('medium')}
              className={`px-4 py-2 rounded-lg shadow-lg text-lg font-medium transition ${
                difficulty === 'medium' ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-yellow-400'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => handleDifficultyChange('hard')}
              className={`px-4 py-2 rounded-lg shadow-lg text-lg font-medium transition ${
                difficulty === 'hard' ? 'bg-red-500' : 'bg-gray-700 hover:bg-red-400'
              }`}
            >
              Hard
            </button>
          </div>

          {/* Duraklat ve Devam Butonu */}
          <button
            onClick={togglePause}
            className="px-6 py-2 rounded-lg text-lg font-bold bg-blue-500 hover:bg-blue-600 shadow-md transition transform hover:scale-110"
          >
            {isPaused ? 'Resume Game ▶️' : 'Pause Game ⏸'}
          </button>

          {/* Restart Butonu */}
          <button
            onClick={handleRestart}
            className="px-6 py-2 rounded-lg text-lg font-bold bg-green-500 hover:bg-green-600 shadow-md transition transform hover:scale-110"
          >
            Restart Game 🔄
          </button>
        </div>
      )}

      <div className="relative w-full h-full">
        {/* Ana Kutucuk */}
        {!gameOver && (
          <div
            onClick={handleClick}
            className={`absolute bg-yellow-400 rounded-full shadow-lg transform transition-all duration-300 cursor-pointer ${
              isPaused ? 'opacity-50 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              top: position.top,
              left: position.left,
              width: `${size}px`,
              height: `${size}px`,
            }}
          ></div>
        )}

        {/* Bonus Kutular */}
        {bonusPositions.map((pos, index) => (
          <div
            key={index}
            onClick={() => handleBonusClick(index)}
            className={`absolute bg-green-500 rounded-full shadow-lg transform transition-all duration-300 cursor-pointer ${
              isPaused ? 'opacity-50 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              top: pos.top,
              left: pos.left,
              width: `${size / 1.5}px`,
              height: `${size / 1.5}px`,
            }}
          ></div>
        ))}
      </div>

      <div className="absolute bottom-10 text-center">
        <p className="text-2xl font-semibold text-red-500">Score: {score}</p>
        {gameOver && (
          <div className="mt-4">
            <p className="text-3xl font-bold">🎉 You Win! 🎉</p>
            <button
              onClick={handleRestart}
              className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg shadow text-white text-lg"
            >
              Restart Game 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorCatcher