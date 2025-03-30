import React from "react";

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] text-white">
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6 pt-32">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          CREATE YOUR OWN <br />
          <span className="text-accent">TOKEN PRESALE WEBSITE</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-xl">
          Launch your dApp on NEAR with blazing speed and beautiful Gittu-style UI.
        </p>
        <button className="mt-6 bg-accent hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full transition-all duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
}
