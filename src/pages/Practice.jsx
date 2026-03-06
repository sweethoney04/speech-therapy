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
        video: !privacyMode // Only request camera if privacy is OFF
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
    <div className="w-full h-screen flex flex-col justify-between bg-[#F5F5F5] font-lao p-6">
      
      {/* 1. Header Section */}
      <div className="relative flex items-center justify-center py-6 px-4 min-h-[100px]">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-6 w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#5DADE2] hover:bg-sky-50 transition-all active:scale-90"
        >
          <img src={sign} alt="Back" className="w-6 h-6 object-contain" />
        </button>

        <h1 className="text-[#355872] text-3xl font-bold">
          ການຝຶກຊ້ອມ (Practice Session)
        </h1>

        <div className="absolute right-6">
          {isFinished && (
            <button 
              onClick={handleNext}
              className="bg-[#5DADE2] text-white px-10 py-3 rounded-2xl text-xl font-bold animate-bounce shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              {currentStep === lessons.length - 1 ? "ສໍາເລັດ (Finish)" : "ຕໍ່ໄປ (Next)"}
            </button>
          )}
        </div>
      </div>

      {/* 2. Middle Content - 3 Columns */}
      <div className="flex-1 grid grid-cols-3 gap-8 items-center px-10">
        
        {/* Left: Lip Reading Video */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden border-4 border-[#355872] shadow-xl">
            <video key={currentLesson.video} autoPlay loop muted className="w-full h-full object-cover">
              <source src={currentLesson.video} type="video/mp4" />
            </video>
          </div>
          <p className="text-[#355872] text-xl font-bold">Lip Reading Video</p>
          {/* Visualizer Placeholder for Model */}
          <div className="w-32 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-xs text-[#5DADE2]">
            Voice Model Wav
          </div>
        </div>

        {/* Center: Sound & Tiger */}
        <div className="flex flex-col items-center">
          <h2 className="text-[#355872] text-8xl font-bold mb-2 leading-none">
            {currentLesson.lao}
          </h2>
          <p className="text-[#355872] text-2xl font-semibold opacity-80 mb-6">
            ({currentLesson.english})
          </p>
          <img src={currentLesson.image} alt="Tiger" className="w-48 h-48 object-contain" />
        </div>

        {/* Right: Interactive Camera (Click to toggle Privacy) */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[#355872] text-xl font-bold">ສຽງຂອງທ່ານ (Your Voice)</p>
          <button 
            onClick={() => setPrivacyMode(!privacyMode)}
            className="w-full aspect-video bg-white rounded-3xl border-2 border-[#5DADE2] flex flex-col items-center justify-center overflow-hidden hover:bg-sky-50 transition-all shadow-sm"
          >
            {privacyMode ? (
              <div className="flex flex-col items-center text-[#5DADE2] opacity-60">
               <img 
          src={privacyIcon} // Use the imported image
          alt="Privacy Mode" 
          className="w-20 h-20 object-contain opacity-60" // Adjust size and opacity
        />
                <p className="font-bold text-xs uppercase tracking-widest">Privacy Mode</p>
                <p className="text-[10px] mt-1">Camera Hidden</p>
              </div>
            ) : isRecording ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-[#5DADE2]">
                <span className="text-6xl mb-1">📷</span>
                <p className="font-bold text-xs">Camera Open</p>
              </div>
            )}
          </button>
          
          {/* Real-time Voice Visualizer Placeholder */}
          <div className="w-32 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-xs text-[#5DADE2]">
            Real-time Visualizer
          </div>
        </div>
      </div>

      {/* 3. Bottom Controls */}
      <div className="flex flex-row items-center justify-center gap-20 pb-12">
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={() => playSound(currentLesson.audio)}
            className="w-40 h-40 rounded-full border-8 border-[#5DADE2] flex items-center justify-center hover:bg-sky-50 transition-all active:scale-95 shadow-sm"
          >
            <img src={speaker} alt="Listen" className="w-20 h-20 object-contain" />
          </button>
          <div className="text-center text-[#355872]">
            <p className="text-2xl font-bold">ກົດເພື່ອຟັງ</p>
            <p className="text-sm">(Tap to Listen)</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={`w-40 h-40 rounded-full border-8 flex items-center justify-center transition-all shadow-sm
              ${isRecording ? 'border-red-500 bg-red-50 animate-pulse' : 'border-[#5DADE2] hover:bg-sky-50'}`}
          >
            <img src={mic} alt="Record" className="w-20 h-20 object-contain" />
          </button>
          <div className="text-center text-[#355872]">
            <p className="text-2xl font-bold">ກົດເພື່ອອັດ</p>
            <p className="text-sm">(Tap to Record)</p>
          </div>
        </div>
      </div>
    </div>
  );
}