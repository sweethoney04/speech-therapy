import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { lessons } from "../data/Lesson"; 

// Import UI icons
import sign from "../assets/images/left.png";
import mic from "../assets/images/microphone-black-shape.png";
import speaker from "../assets/images/speaker-filled-audio-tool.png";
import privacyIcon from "../assets/images/hidden.png"; 

export default function Practice() {
  const navigate = useNavigate();

  // --- States ---
  const [currentStep, setCurrentStep] = useState(0); 
  const [isRecording, setIsRecording] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false); 
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);

  const currentLesson = lessons[currentStep];

  // --- Logic Helpers ---
  const playSound = (audioSrc) => {
    const audio = new Audio(audioSrc);
    audio.play();
  };

  // --- Navigation ---
  const handleNext = () => {
    if (currentStep < lessons.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsFinished(false); 
    } else {
      navigate("/result"); 
    }
  };

  // Added missing handlePrevious function
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsFinished(true); // Allow them to see navigation for completed steps
    }
  };

  // --- Audio/Video Logic ---
  const startRecording = async (e) => {
    if (e) e.preventDefault(); 
    if (isRecording) return;
    try {
      const constraints = { 
        audio: true, 
        video: !privacyMode 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (!privacyMode && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Please allow microphone/camera access.");
    }
  };

  const stopRecording = (e) => {
    if (e) e.preventDefault();
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsFinished(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-[#F5F5F5] font-lao p-4 md:p-6">
      
      {/* 1. Header Section */}
      <div className="relative flex flex-col md:flex-row items-center justify-center py-4 md:py-6 px-4 min-h-[80px] md:min-h-[100px] gap-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="md:absolute md:left-6 w-12 h-12 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 border-[#5DADE2] hover:bg-sky-50 transition-all active:scale-90"
        >
          <img src={sign} alt="Back" className="w-7 h-7 md:w-6 md:h-6 object-contain" />
        </button>

        <h1 className="text-[#355872] text-xl md:text-3xl font-bold text-center">
          ການຝຶກຊ້ອມ (Practice Session)
        </h1>
      </div>

      {/* 2. Middle Content - Balanced 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-center px-4 md:px-16 py-4">
        
        {/* Left Column: Video */}
        <div className="flex flex-col items-center gap-2 md:gap-4 order-2 lg:order-1">
          <p className="text-[#355872] text-md md:text-lg font-bold">Lip Reading Video</p>
          <div className="w-full max-w-[280px] md:max-w-[320px] aspect-video bg-black rounded-3xl overflow-hidden border-4 border-[#355872] shadow-xl">
            <video key={currentLesson.video} autoPlay loop muted className="w-full h-full object-cover">
              <source src={currentLesson.video} type="video/mp4" />
            </video>
          </div>
          <div className="mt-1 bg-sky-100 px-3 py-1 rounded-lg text-[#5DADE2] text-[10px] md:text-xs font-semibold">
            Voice Model Wav
          </div>
        </div>

        {/* Center Column: Word & Image */}
        <div className="flex flex-col items-center order-1 lg:order-2">
          <h2 className="text-[#355872] text-5xl md:text-8xl font-medium mb-4 leading-none text-center">
            {currentLesson.lao}
          </h2>
          <p className="text-[#355872] text-lg md:text-2xl font-medium opacity-70 mb-4 md:mb-8 text-center">
            ({currentLesson.english})
          </p>
          <img src={currentLesson.image} alt="Visual" className="w-28 h-28 md:w-52 md:h-52 object-contain" />
        </div>

        {/* Right Column: Camera */}
        <div className="flex flex-col items-center gap-2 md:gap-4 order-3">
          <p className="text-[#355872] text-md md:text-lg font-bold">ສຽງຂອງທ່ານ (Your Voice)</p>
          <button 
            onClick={() => setPrivacyMode(!privacyMode)}
            className="w-full max-w-[280px] md:max-w-[320px] aspect-video bg-white rounded-3xl border-2 border-[#5DADE2] flex flex-col items-center justify-center overflow-hidden hover:bg-sky-50 transition-all shadow-md"
          >
            {privacyMode ? (
              <div className="flex flex-col items-center text-[#5DADE2] opacity-60">
                <img src={privacyIcon} alt="Privacy" className="w-10 h-10 md:w-16 md:h-16 object-contain mb-1" />
                <p className="font-bold text-[10px] uppercase">Privacy Mode</p>
              </div>
            ) : isRecording ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-[#5DADE2]">
                <span className="text-3xl md:text-5xl mb-1">📷</span>
                <p className="font-bold text-[10px]">Camera Open</p>
              </div>
            )}
          </button>
          <div className="mt-1 bg-sky-100 px-3 py-1 rounded-lg text-[#5DADE2] text-[10px] md:text-xs font-semibold">
            Real-time Visualizer
          </div>
        </div>
      </div>

      {/* 3. Bottom Controls - Realigned for UI balance */}
      <div className="flex flex-row items-center justify-between w-full pb-12 pt-6 px-4 md:px-12 relative">
        
        {/* Left: Previous Button Container */}
        <div className="flex-1 flex justify-start">
          {currentStep > 0 && (
            <button 
              onClick={handlePrevious}
              className="bg-[#5DADE2] text-white px-8 py-3 rounded-2xl text-lg md:text-xl font-medium shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              ຍ້ອນກັບ (Previous)
            </button>
          )}
        </div>

        {/* Center: Audio/Recording Controls Section */}
        <div className="flex flex-row items-center justify-center gap-8 md:gap-20 pb-10 pt-4">
        {/* Listen Column */}
        <div className="flex flex-col items-center gap-2 md:gap-4">
          <button 
            onClick={() => playSound(currentLesson.audio)}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-5 border-[#5DADE2] flex items-center justify-center hover:bg-sky-50 transition-all active:scale-95 shadow-sm bg-white"
          >
            <img src={speaker} alt="Listen" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
          </button>
          <div className="text-center text-[#355872]">
            <p className="text-lg md:text-2xl font-bold">ກົດເພື່ອຟັງ</p>
            <p className="hidden md:block text-sm">(Tap to Listen)</p>
          </div>
        </div>

        {/* Record Column */}
        <div className="flex flex-col items-center gap-2 md:gap-4">
          <button 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-5 flex items-center justify-center transition-all shadow-sm bg-white
              ${isRecording ? 'border-red-500 bg-red-50 animate-pulse' : 'border-[#5DADE2] hover:bg-sky-50'}`}
          >
            <img src={mic} alt="Record" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
          </button>
          <div className="text-center text-[#355872]">
            <p className="text-lg md:text-2xl font-bold">ກົດເພື່ອອັດ</p>
            <p className="hidden md:block text-sm">(Tap to Record)</p>
          </div>
        </div>
      </div>

        {/* Right: Next Button Container */}
        <div className="flex-1 flex justify-end">
          {isFinished && (
            <button 
              onClick={handleNext}
              className="bg-[#5DADE2] text-white px-12 py-3 rounded-2xl text-lg md:text-xl font-medium shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              {currentStep === lessons.length - 1 ? "ສໍາເລັດ (Finish)" : "ຕໍ່ໄປ (Next)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}