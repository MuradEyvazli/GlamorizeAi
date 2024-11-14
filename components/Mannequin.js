import React from 'react'

const Mannequin = () => {
  return (
    <div className="relative">
            
            <div className="w-48 h-72 bg-gray-100 rounded-full overflow-hidden shadow-md">
              <img
                src="/images/monique.jpg"
                alt="Mannequin"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Mankenin Arkasındaki Animasyonlu Halka */}
            <div className="absolute top-0 left-0 w-48 h-72 border-4 border-gradient-to-r from-[#f3a683] to-[#f7d794] rounded-full animate-pulse opacity-50"></div>
          </div>
  )
}

export default Mannequin