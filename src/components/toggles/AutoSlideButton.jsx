import React from "react";

export const AutoSlideButton = ({ autoSlide, toggleAutoSlide }) => (
<button
    onClick={() => toggleAutoSlide(!autoSlide)}
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium 
                text-sm sm:text-base shadow-md transition-all duration-200
                focus:outline-none
                ${autoSlide
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-800 hover:bg-gray-900 text-gray-200"}`}
  >
    <span
      className={`inline-block w-3 h-3 rounded-full border
                  ${autoSlide ? "bg-white border-white" : "bg-gray-400 border-gray-300"}`}
    ></span>
    {autoSlide ? "Auto Slide On" : "Auto Slide Off"}
  </button>
);
