import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { lessons } from "../data/Lesson"; 

// Import UI icons
import sign from "../assets/images/right (1).png";
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
      console.error(err);
      alert("Please allow microphone/camera access.");
    }
  };

  const stopRecording = (e) => {
    if (e) e.preventDefault();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
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
          className="md:absolute md:left-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 border-[#5DADE2] hover:bg-sky-50 transition-all active:scale-90"
        >
          <img src={sign} alt="Back" className="w-5 h-5 md:w-6 md:h-6 object-contain rotate-180" />
        </button>

        <h1 className="text-[#355872] text-xl md:text-3xl font-bold text-center">
          ການຝຶກຊ້ອມ (Practice Session)
        </h1>

        {/* Next/Finish Button */}
        <div className="md:absolute md:right-6">
          {isFinished && (
            <button 
              onClick={handleNext}
              className="bg-[#5DADE2] text-white px-6 py-2 md:px-10 md:py-3 rounded-2xl text-lg md:text-xl font-bold animate-bounce shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              {currentStep === lessons.length - 1 ? "ສໍາເລັດ (Finish)" : "ຕໍ່ໄປ (Next)"}
            </button>
          )}
        </div>
      </div>

      {/* 2. Middle Content - Responsive Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-center px-4 md:px-10 py-4">
        
        {/* Item A: Lip Reading Video (Order 2 on mobile, 1 on Desktop) */}
        <div className="flex flex-col items-center gap-2 md:gap-4 order-2 lg:order-1">
          <p className="text-[#355872] text-lg md:text-xl font-bold">Lip Reading Video</p>
          <div className="w-full max-w-sm lg:max-w-none aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden border-4 border-[#355872] shadow-xl">
            <video key={currentLesson.video} autoPlay loop muted className="w-full h-full object-cover">
              <source src={currentLesson.video} type="video/mp4" />
            </video>
          </div>
          {/* <p className="text-[#355872] text-lg md:text-xl font-bold">Lip Reading Video</p> */}
          <div className="w-24 h-8 md:w-32 md:h-12 bg-sky-100 rounded-lg flex items-center justify-center text-[10px] md:text-xs text-[#5DADE2]">
            Voice Model Wav
          </div>
        </div>

        {/* Item B: Main Text & Image (Order 1 on mobile, 2 on Desktop) */}
        <div className="flex flex-col items-center order-1 lg:order-2">
          <h2 className="text-[#355872] text-5xl md:text-8xl font-bold mb-1 md:mb-2 leading-none">
            {currentLesson.lao}
          </h2>
          <p className="text-[#355872] text-lg md:text-2xl font-semibold opacity-80 mb-4 md:mb-6">
            ({currentLesson.english})
          </p>
          <img src={currentLesson.image} alt="Lesson Visual" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
        </div>

        {/* Item C: Your Camera (Order 3 on mobile and Desktop) */}
        <div className="flex flex-col items-center gap-2 md:gap-4 order-3">
          <p className="text-[#355872] text-lg md:text-xl font-bold">ສຽງຂອງທ່ານ (Your Voice)</p>
          <button 
            onClick={() => setPrivacyMode(!privacyMode)}
            className="w-full max-w-sm lg:max-w-none aspect-video bg-white rounded-2xl md:rounded-3xl border-2 border-[#5DADE2] flex flex-col items-center justify-center overflow-hidden hover:bg-sky-50 transition-all shadow-sm"
          >
            {privacyMode ? (
              <div className="flex flex-col items-center text-[#5DADE2] opacity-60">
                <img src={privacyIcon} alt="Privacy" className="w-12 h-12 md:w-20 md:h-20 object-contain mb-1" />
                <p className="font-bold text-[10px] uppercase tracking-widest">Privacy Mode</p>
              </div>
            ) : isRecording ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-[#5DADE2]">
                <span className="text-4xl md:text-6xl mb-1">📷</span>
                <p className="font-bold text-[10px] md:text-xs">Camera Open</p>
              </div>
            )}
          </button>
          <div className="w-24 h-8 md:w-32 md:h-12 bg-sky-100 rounded-lg flex items-center justify-center text-[10px] md:text-xs text-[#5DADE2]">
            Real-time Visualizer
          </div>
        </div>
      </div>

      {/* 3. Bottom Controls */}
      <div className="flex flex-row items-center justify-center gap-8 md:gap-20 pb-10 pt-4">
        {/* Listen Column */}
        <div className="flex flex-col items-center gap-2 md:gap-4">
          <button 
            onClick={() => playSound(currentLesson.audio)}
            className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-[#5DADE2] flex items-center justify-center hover:bg-sky-50 transition-all active:scale-95 shadow-sm bg-white"
          >
            <img src={speaker} alt="Listen" className="w-10 h-10 md:w-20 md:h-20 object-contain" />
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
            className={`w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 flex items-center justify-center transition-all shadow-sm bg-white
              ${isRecording ? 'border-red-500 bg-red-50 animate-pulse' : 'border-[#5DADE2] hover:bg-sky-50'}`}
          >
            <img src={mic} alt="Record" className="w-10 h-10 md:w-20 md:h-20 object-contain" />
          </button>
          <div className="text-center text-[#355872]">
            <p className="text-lg md:text-2xl font-bold">ກົດເພື່ອອັດ</p>
            <p className="hidden md:block text-sm">(Tap to Record)</p>
          </div>
        </div>
      </div>
    </div>
  );
}