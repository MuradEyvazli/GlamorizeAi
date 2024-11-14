import { useState } from 'react';

const upperBodyOptions = [
  { id: 1, name: 'Dress', image: '/images/tshirt.png' },
  { id: 2, name: 'Jacket', image: '/images/jacket.png' },
  { id: 3, name: 'Shirt', image: '/images/shirt.png' },
];

const lowerBodyOptions = [
  { id: 1, name: 'Jeans', image: '/images/jeans.png' },
  { id: 2, name: 'Skirt', image: '/images/skirt.png' },
  { id: 3, name: 'Trousers', image: '/images/short.png' },
];

export default function OutfitSelector({ onSelectUpper, onSelectLower }) {
  const [selectedUpper, setSelectedUpper] = useState(null);
  const [selectedLower, setSelectedLower] = useState(null);

  const handleSelectUpper = (item) => {
    setSelectedUpper(item);
    onSelectUpper(item);
  };

  const handleSelectLower = (item) => {
    setSelectedLower(item);
    onSelectLower(item);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-10 p-4 md:py-6 rounded-xl overflow-auto">
      {/* Upper Body Selection */}
      <div className="flex flex-wrap space-x-4 w-full md:w-1/2 pb-4 justify-center md:justify-start">
        {upperBodyOptions.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectUpper(item)}
            className={`w-24 h-24 md:w-32 md:h-32 cursor-pointer border-2 border-transparent rounded-lg hover:border-[#ff6f61] transition-all ${
              selectedUpper?.id === item.id ? 'border-[#ff6f61]' : ''
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="text-center mt-2 text-gray-700 text-sm md:text-base">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Lower Body Selection */}
      <div className="flex flex-wrap space-x-4 w-full md:w-1/2 pb-4 justify-center md:justify-start">
        {lowerBodyOptions.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectLower(item)}
            className={`w-24 h-24 md:w-32 md:h-32 cursor-pointer border-2 border-transparent rounded-lg hover:border-[#ff6f61] transition-all ${
              selectedLower?.id === item.id ? 'border-[#ff6f61]' : ''
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="text-center mt-2 text-gray-700 text-sm md:text-base">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
