import React from "react";

const PreInfoPage = () => {
  return (
    <div id="preinfo"  className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r text-black min-h-screen px-6 md:px-20 pt-10">
      {/* Sol Taraf İçerik */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-bold  mb-10 md:mb-20">
          Glamorize <span className="bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-transparent bg-clip-text">AI</span> is the next step in digital art.
        </h1>
        <p className="text-base md:text-lg leading-6 md:leading-8 mb-6 md:mb-8 opacity-80">
          <span className="bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-transparent bg-clip-text">Glamorize AI</span> is a software tool that uses neural networks and AI
          algorithms to try on clothes in humanbeings in 1 click.
        </p>
        <p className="text-base md:text-lg leading-6 md:leading-8 opacity-80">
          See an example that was created by <span className="bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-transparent bg-clip-text">Glamorize AI</span> as an example to demonstrate how the yellow t-shirt has been virtually placed onto a model human.
           It serves as a showcase of how effectively our AI project operates..
        </p>
        {/* Purple Box with Left Border */}
        <div className="mt-8 md:mt-10 text-white p-4 rounded-lg shadow-md border-l-4 border-[#b80af8]">
          <p className="text-xs md:text-sm text-black">
            "A bowl of soup that is also a portal to another dimension, digital
            art"
          </p>
        </div>
      </div>

      {/* Sağ Taraf Görsel */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-xs md:max-w-md">
          <img
            src="/examples/garment7.png"
            alt="Example"
            className="rounded-md object-cover w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default PreInfoPage;
