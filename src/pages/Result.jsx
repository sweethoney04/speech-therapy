import React from "react";
import { useNavigate } from "react-router-dom";

// Icons
import successIcon from "../assets/images/success.png"; 
import sign from "../assets/images/right (1).png";

export default function Result() {
  const navigate = useNavigate();

  const results = {
    voiceFluency: 65,
    mouthAccuracy: 45,
    feedbackMessage: "ເກັ່ງຫຼາຍ!",
    detailedFeedback: "ຂໍ້ຄວາມການ Feedback"
  };

  return (
    // Changed h-screen to min-h-screen for mobile scrolling
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5] font-lao p-4 md:p-10">
      
      {/* 1. Main Container: Stack vertically on mobile, row on laptop */}
      <div className="relative flex-1 flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-12">
        
        {/* Back Button - Fixed position relative to container */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-4 left-4 md:top-8 md:left-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 border-[#5DADE2] hover:bg-sky-50 transition-all active:scale-90 z-10"
        >
          <img src={sign} alt="Back" className="w-5 h-5 md:w-6 md:h-6 object-contain rotate-180" />
        </button>

        {/* LEFT COLUMN: Summary & Achievement */}
        <div className="flex-1 flex flex-col items-center justify-start border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100 px-4 md:px-10 py-8 lg:pt-12"> 
          
          <h1 className="text-[#355872] text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-center">ຜົນການຝຶກຊ້ອມ</h1>
          <h2 className="text-[#355872] text-lg md:text-2xl opacity-70 mb-6 md:mb-10 text-center">(Session Feedback)</h2>

          {/* Achievement Icon */}
          <div className="flex flex-col items-center mb-6 md:mb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#5DADE2] rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden p-4">
               <img src={successIcon} alt="Success" className="w-full h-full object-contain invert brightness-0" />
            </div>
            <p className="text-[#355872] text-2xl md:text-3xl font-bold">{results.feedbackMessage}</p>
          </div>

          {/* Feedback Box */}
          <div className="w-full max-w-md h-32 md:h-40 border-2 border-[#5DADE2] rounded-2xl flex items-center justify-center p-6 bg-sky-50/10">
             <p className="text-[#355872] text-xl md:text-2xl font-semibold opacity-60 text-center">
               {results.detailedFeedback}
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Progress Bars & Actions */}
        <div className="flex-1 flex flex-col px-4 md:px-10 py-8 lg:pt-12">
          
          {/* Progress Section */}
          <div className="space-y-8 md:space-y-12 mb-8 lg:mb-auto"> 
            <h3 className="text-[#355872] text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center lg:text-left">
              ຜົນໄດ້ຮັບ (Result)
            </h3>

            {/* Voice Fluency */}
            <div className="space-y-2 md:space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[#355872] text-sm md:text-xl font-bold">ການອ່ານອອກສຽງ (Voice Fluency)</p>
                <span className="text-[#355872] text-lg md:text-2xl font-bold">{results.voiceFluency}%</span>
              </div>
              <div className="w-full h-4 md:h-6 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className="h-full bg-[#355872] transition-all duration-1000" 
                  style={{ width: `${results.voiceFluency}%` }}
                ></div>
              </div>
            </div>

            {/* Mouth Accuracy */}
            <div className="space-y-2 md:space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[#355872] text-sm md:text-xl font-bold">ການອ່ານປາກ (Mouth Accuracy)</p>
                <span className="text-[#355872] text-lg md:text-2xl font-bold">{results.mouthAccuracy}%</span>
              </div>
              <div className="w-full h-4 md:h-6 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className="h-full bg-[#355872] transition-all duration-1000" 
                  style={{ width: `${results.mouthAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons & Feelings Rating */}
          <div className="flex flex-col gap-8 md:gap-10 mt-6 md:mt-10">
            <div className="flex flex-col gap-4 md:gap-6 items-center">
              <button 
                onClick={() => navigate("/practice")}
                className="w-full max-w-sm py-3 md:py-4 bg-[#5DADE2] text-white text-xl md:text-2xl font-bold rounded-2xl shadow-[0px_4px_0px_0px_#4682B4] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
              >
                ຝຶກອີກຄັ້ງ (Practice Again)
              </button>
              <button 
                onClick={() => navigate("/")}
                className="w-full max-w-sm py-3 md:py-4 bg-[#5DADE2] text-white text-xl md:text-2xl font-bold rounded-2xl shadow-[0px_4px_0px_0px_#4682B4] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
              >
                ຝຶກບົດຕໍ່ໄປ (Next)
              </button>
            </div>

            {/* Mood Tracking Section */}
            <div className="flex flex-col items-center">
              <p className="text-[#355872] text-sm md:text-lg font-bold mb-3 md:mb-4 text-center">ມື້ນີ້ຮູ້ສຶກແນວໃດ? (How do you feel today?)</p>
              <div className="flex gap-6 md:gap-8">
                 {['😁', '🙂', '😐', '🙁'].map((emoji, index) => (
                   <button key={index} className="text-3xl md:text-4xl grayscale hover:grayscale-0 transition-all active:scale-125">
                     {emoji}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}