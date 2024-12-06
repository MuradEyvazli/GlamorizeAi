import Image from 'next/image';
import React from 'react';

const InfoPage = () => {
  return (
    <div className="bg-gradient-to-r from-[#ffffff] to-[#ffffff] w-full py-12" id='about' >
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800">
          <span className='bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-transparent bg-clip-text'>Glamorize</span> your perfect photoshoots with just a few clicks
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/Upload.svg" alt="Upload" width={80} height={80} />
          <h3 className="mt-4 font-semibold text-lg">Upload</h3>
          <p className="text-sm text-gray-600 mt-2">
            Start by uploading 1-4 images of your product samples to give you a comprehensive product gallery.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Image src="/images/GenerationAi.svg" alt="AI Photoshoot Generation" width={80} height={80} />
          <h3 className="mt-4 font-semibold text-lg">AI Photoshoot Generation</h3>
          <p className="text-sm text-gray-600 mt-2">
            Our advanced AI gets to work, generating product photoshoots tailored to your product.
          </p>
        </div>
        <div className="flex flex-col items-center  text-center">
          <Image src="/images/Prompts.svg" alt="Refine with Prompts" width={80} height={80} />
          <h3 className="mt-4 font-semibold text-lg">Refine with Prompts</h3>
          <p className="text-sm text-gray-600 mt-2">
            Generate more photos by uploading your photoshoot concept image.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Image src="/images/Save.svg" alt="Save & Download" width={80} height={80} />
          <h3 className="mt-4 font-semibold text-lg">Save & Download</h3>
          <p className="text-sm text-gray-600 mt-2">
            Once you are satisfied, generate your product photoshoots and download high-resolution image results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
