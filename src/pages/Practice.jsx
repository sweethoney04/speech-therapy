import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { lessons } from "../data/Lesson";
import axios from "axios";

// Import UI icons
import sign from "../assets/images/left.png";
import mic from "../assets/images/microphone-black-shape.png";
import speaker from "../assets/images/speaker-filled-audio-tool.png";
import privacyIcon from "../assets/images/hidden.png";
import cameraIcon from "../assets/images/camera.png";

export default function Practice() {
  const navigate = useNavigate();

  // --- States ---
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [lipDetectionReady, setLipDetectionReady] = useState(false);

  // --- Refs ---
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animFrameRef = useRef(null);

  const currentLesson = lessons[currentStep];

  // --- Speech Recognition (Backend) ---
  const handleSpeechRecognition = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const aiResult = response.data.prediction;
      console.log("AI ໄດ້ຍິນວ່າ:", aiResult);
      return aiResult;
    } catch (error) {
      console.error("Error connecting to Backend:", error);
      return null;
    }
  };

  // --- Load MediaPipe scripts on mount ---
  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

    Promise.all([
      loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
      ),
      loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
      ),
    ])
      .then(() => {
        setLipDetectionReady(true);
        console.log("MediaPipe scripts loaded.");
      })
      .catch((err) => {
        console.error("Failed to load MediaPipe scripts:", err);
      });
  }, []);

  // --- Autoplay audio on step change ---
  useEffect(() => {
    if (currentLesson?.audio) {
      playSound(currentLesson.audio);
    }
  }, [currentStep]);

  // --- Helpers ---
  const playSound = (audioSrc) => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.play().catch((err) => {
      console.log("Autoplay blocked. User interaction required.", err);
    });
  };

  // --- Lip Detection ---
  const startLipDetection = useCallback(() => {
    if (!lipDetectionReady || !window.FaceMesh) {
      console.warn("FaceMesh not ready yet.");
      return;
    }
    if (!videoRef.current || !canvasRef.current) return;

    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");

      // Match canvas pixel dimensions to the DISPLAYED size of the video element
      // This ensures landmark coordinates map exactly onto what the user sees
      const rect = video.getBoundingClientRect();
      const displayW = rect.width;
      const displayH = rect.height;

      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
      }

      // Calculate letterbox offsets caused by object-fit: cover
      // The raw video may have different aspect ratio than the display box
      const videoAspect = video.videoWidth / video.videoHeight;
      const displayAspect = displayW / displayH;

      let scaleX, scaleY, offsetX, offsetY;

      if (videoAspect > displayAspect) {
        // Video is wider than display — cropped left/right
        scaleY = displayH / video.videoHeight;
        scaleX = scaleY;
        offsetX = (displayW - video.videoWidth * scaleX) / 2;
        offsetY = 0;
      } else {
        // Video is taller than display — cropped top/bottom
        scaleX = displayW / video.videoWidth;
        scaleY = scaleX;
        offsetX = 0;
        offsetY = (displayH - video.videoHeight * scaleY) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // Outer lip landmark indices (MediaPipe Face Mesh)
        const outerLip = [
          61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314,
          17, 84, 181, 91, 146, 61,
        ];

        // Inner lip landmark indices
        const innerLip = [
          78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402,
          317, 14, 87, 178, 88, 95, 78,
        ];

        const drawLipContour = (indices, strokeColor, lineWidth) => {
          ctx.beginPath();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";

          indices.forEach((idx, i) => {
            const pt = landmarks[idx];
            const x = pt.x * video.videoWidth * scaleX + offsetX;
            const y = pt.y * video.videoHeight * scaleY + offsetY;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });

          ctx.closePath();
          ctx.stroke();
        };

        // Thin blue outer lip outline only — no fill, no dots
        drawLipContour(outerLip, "rgba(93, 173, 226, 0.85)", 1.5);
        // Slightly more transparent inner lip
        drawLipContour(innerLip, "rgba(93, 173, 226, 0.55)", 1);
      }
    });

    faceMeshRef.current = faceMesh;

    const runDetection = async () => {
      try {
        if (
          videoRef.current &&
          videoRef.current.readyState >= 2 &&
          !videoRef.current.paused
        ) {
          await faceMesh.send({ image: videoRef.current });
        }
      } catch (err) {
        console.error("FaceMesh send error:", err);
      }
      animFrameRef.current = requestAnimationFrame(runDetection);
    };

    runDetection();
    console.log("Lip detection started.");
  }, [lipDetectionReady]);

  const stopLipDetection = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (faceMeshRef.current) {
      faceMeshRef.current.close();
      faceMeshRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    console.log("Lip detection stopped.");
  }, []);

  // --- Navigation ---
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsFinished(true);
      setAudioBlob(null);
    }
  };

  // --- Recording ---
  const startRecording = async (e) => {
    if (e) e.preventDefault();
    if (isRecording) return;

    try {
      const constraints = { audio: true, video: !privacyMode };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (!privacyMode && videoRef.current) {
        videoRef.current.srcObject = stream;
        // Start lip detection once video data is flowing
        videoRef.current.onloadeddata = () => {
          startLipDetection();
        };
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Please allow microphone/camera access.");
      console.error(err);
    }
  };

  const stopRecording = (e) => {
    if (e) e.preventDefault();

    // Stop lip detection before stopping stream
    stopLipDetection();

    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
    setIsFinished(true);
  };

  const handleNext = async () => {
    if (currentStep === lessons.length - 1 && audioBlob) {
      try {
        const result = await handleSpeechRecognition(audioBlob);
        navigate("/result", {
          state: {
            transcription: result,
            targetWord: currentLesson.lao,
          },
        });
      } catch (err) {
        console.error("STT Error:", err);
        navigate("/result");
      }
    } else {
      if (currentStep < lessons.length - 1) {
        setCurrentStep(currentStep + 1);
        setIsFinished(false);
        setAudioBlob(null);
      }
    }
  };

  // --- Render ---
  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-[#F5F5F5] font-lao p-4 md:p-6">

      {/* Header */}
      <div className="relative flex flex-col md:flex-row items-center justify-center py-4 md:py-6 px-4 min-h-[80px] md:min-h-[100px] gap-4">
        <button
          onClick={() => navigate(-1)}
          className="md:absolute md:left-6 w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#5DADE2] hover:bg-sky-50 transition-all active:scale-90"
        >
          <img
            src={sign}
            alt="Back"
            className="w-7 h-7 md:w-6 md:h-6 object-contain"
          />
        </button>

        <h1 className="text-[#355872] text-xl md:text-3xl font-bold text-center">
          ການຝຶກຊ້ອມ (Practice Session)
        </h1>
      </div>

      {/* Middle Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-center px-4 md:px-16 py-4">

        {/* Lesson Video */}
        <div className="flex flex-col items-center gap-2 md:gap-4 order-2 lg:order-1">
          <p className="text-[#355872] text-md md:text-lg font-bold">
            Lip Reading Video
          </p>
          <div className="w-full max-w-[280px] md:max-w-[320px] aspect-video bg-black rounded-3xl overflow-hidden border-4 border-[#355872] shadow-xl">
            <video
              key={currentLesson.video}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            >
              <source src={currentLesson.video} type="video/mp4" />
            </video>
          </div>
          <div className="mt-1 bg-sky-100 px-3 py-1 rounded-lg text-[#5DADE2] text-[10px] md:text-xs font-semibold">
            Voice Model Wav
          </div>
        </div>

        {/* Word & Image */}
        <div className="flex flex-col items-center order-1 lg:order-2">
          <h2 className="text-[#355872] text-5xl md:text-6xl font-medium mb-4 leading-none text-center">
            {currentLesson.lao}
          </h2>
          <p className="text-[#355872] text-lg md:text-2xl font-medium opacity-70 mb-4 md:mb-8 text-center">
            ({currentLesson.english})
          </p>
          <img
            src={currentLesson.image}
            alt="Visual"
            className="w-28 h-28 md:w-52 md:h-52 object-contain"
          />
        </div>

        {/* User Camera with Lip Detection Canvas Overlay */}
        <div className="flex flex-col items-center gap-2 md:gap-4 order-3">
          <p className="text-[#355872] text-md md:text-lg font-bold">
            ສຽງຂອງທ່ານ (Your Voice)
          </p>

          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            className="relative w-full max-w-[280px] md:max-w-[320px] aspect-video bg-white rounded-3xl border-2 border-[#5DADE2] flex flex-col items-center justify-center overflow-hidden hover:bg-sky-50 transition-all shadow-md"
          >
            {privacyMode ? (
              /* Privacy Mode — no camera */
              <div className="flex flex-col items-center text-[#5DADE2] opacity-60">
                <img
                  src={privacyIcon}
                  alt="Privacy"
                  className="w-10 h-10 md:w-16 md:h-16 object-contain mb-1"
                />
                <p className="font-bold text-[10px] uppercase">Privacy Mode</p>
              </div>
            ) : (
              <>
                {/* Live camera video */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ display: isRecording ? "block" : "none" }}
                />

                {/* Lip detection canvas overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    pointerEvents: "none",
                    display: isRecording ? "block" : "none",
                  }}
                />

                {/* Idle state — camera not active */}
                {!isRecording && (
                  <div className="flex flex-col items-center text-[#5DADE2]">
                    <img
                      src={cameraIcon}
                      alt="Camera"
                      className="w-10 h-10 md:w-16 md:h-16 object-contain mb-1"
                    />
                    <p className="font-bold text-[10px]">Camera Open</p>
                  </div>
                )}
              </>
            )}
          </button>

          {/* Status badge */}
          <div
            className={`mt-1 px-3 py-1 rounded-lg text-[10px] md:text-xs font-semibold transition-all ${
              isRecording
                ? "bg-red-100 text-red-500 animate-pulse"
                : lipDetectionReady
                ? "bg-sky-100 text-[#5DADE2]"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {isRecording
              ? "🔴 Lip Detection Active"
              : lipDetectionReady
              ? "Lip Detection Ready"
              : "Loading MediaPipe..."}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-row items-center justify-between w-full pb-12 pt-6 px-4 md:px-12 relative">

        {/* Previous */}
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

        {/* Listen & Record */}
        <div className="flex flex-row items-center justify-center gap-8 md:gap-20 pb-10 pt-4">

          {/* Listen */}
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <button
              onClick={() => playSound(currentLesson.audio)}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-5 border-[#5DADE2] flex items-center justify-center hover:bg-sky-50 transition-all active:scale-95 shadow-sm bg-white"
            >
              <img
                src={speaker}
                alt="Listen"
                className="w-10 h-10 md:w-16 md:h-16 object-contain"
              />
            </button>
            <div className="text-center text-[#355872]">
              <p className="text-lg md:text-2xl font-bold">ກົດເພື່ອຟັງ</p>
              <p className="hidden md:block text-sm">(Tap to Listen)</p>
            </div>
          </div>

          {/* Record */}
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 md:border-5 flex items-center justify-center transition-all shadow-sm bg-white
                ${
                  isRecording
                    ? "border-red-500 bg-red-50 animate-pulse"
                    : "border-[#5DADE2] hover:bg-sky-50 active:scale-95"
                }`}
            >
              <img
                src={mic}
                alt="Record"
                className="w-10 h-10 md:w-16 md:h-16 object-contain"
              />
            </button>
            <div className="text-center text-[#355872]">
              <p className="text-lg md:text-2xl font-bold">ກົດເພື່ອອັດ</p>
              <p className="hidden md:block text-sm">(Tap to Record)</p>
            </div>
          </div>
        </div>

        {/* Next */}
        <div className="flex-1 flex justify-end">
          {isFinished && (
            <button
              onClick={handleNext}
              className="bg-[#5DADE2] text-white px-12 py-3 rounded-2xl text-lg md:text-xl font-medium shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              {currentStep === lessons.length - 1
                ? "ສໍາເລັດ (Finish)"
                : "ຕໍ່ໄປ (Next)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}