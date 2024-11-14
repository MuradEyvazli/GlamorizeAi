'use client'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

import { useState } from 'react';
import DashboardForm from '../../components/DashboardForm';
import OutfitSelector from '../../components/OutfitSelector';
import InfoPage from '../../components/InfoPage';
import SubProccess from '../../components/SubProccess';

export default function Home() {
    
  const [upperBodyImage, setUpperBodyImage] = useState(null);
  const [lowerBodyImage, setLowerBodyImage] = useState(null);


  const handleUpperImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUpperBodyImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleLowerImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setLowerBodyImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpperSelect = (item) => {
    setUpperBodyImage(item.image);
  };

  const handleLowerSelect = (item) => {
    setLowerBodyImage(item.image);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* TryOnForm'a secim bilgilerini gonderiyoruz */}
      
      <DashboardForm 
        upperBodyImage={upperBodyImage} 
        lowerBodyImage={lowerBodyImage} 
        handleUpperImageChange={handleUpperImageChange} 
        handleLowerImageChange={handleLowerImageChange} 
      />
      <div>
      
      </div>
      <OutfitSelector onSelectUpper={handleUpperSelect} onSelectLower={handleLowerSelect} />
      <InfoPage/>
      <SubProccess/>
    </div>
  );
}
