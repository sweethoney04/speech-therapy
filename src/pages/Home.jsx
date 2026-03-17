import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Bell, Play, ChevronRight, Check, Star, Lock } from "lucide-react";

export default function Home() {
  const navigator = useNavigate();

  const completedSessions = 2;
  const totalSessions = 5;
  const progress = (completedSessions / totalSessions) * 100;

  // Circle config - all values derived from radius
  const radius = 120;
  const svgSize = radius * 2 + 20; // 260
  const center = svgSize / 2;      // 130
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white w-full h-screen overflow-hidden border border-gray-200">

        {/* Header bar */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-sm text-blue-500 font-medium">
          Main page
        </div>

        <div className="flex flex-col md:flex-row h-full">

          {/* Left Panel */}
          <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center">

            {/* User info */}
            <div className="flex items-center gap-3 self-start mb-8">
              <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-gray-500 fill-current">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-medium text-sm">ສະບາຍດີ, ນ້ຳເພັງ</p>
                <p className="text-gray-500 text-sm">Hello, Nampherng</p>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative flex items-center justify-center mb-4">
              <svg width={svgSize} height={svgSize} className="-rotate-90">
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="14"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#5DADE2"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-700">
                  {completedSessions}/{totalSessions}
                </span>
                <span className="text-gray-500 text-sm">Completed</span>
              </div>
            </div>

            {/* Daily Goal Label */}
            <div className="text-center">
              <p className="text-gray-700 font-medium text-lg">ເປົ້າໝາຍປະຈຳອັບ</p>
              <p className="text-gray-500 text-sm">Daily Goal</p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-6 flex flex-col gap-5">

            {/* Top icons */}
            <div className="flex justify-end gap-3">
              <div className="relative">
                <Bell className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">1</span>
              </div>
              {/* Settings icon navigates to Dashboard */}
              <Settings
                className="w-7 h-7 text-gray-500 cursor-pointer hover:text-[#5DADE2] transition-colors"
                onClick={() => navigator("/dashboard")}
              />
            </div>

            {/* Daily Practice Label */}
            <p className="text-gray-600 text-sm font-medium text-center">
              ຝຶກຊ້ອມປະຈຳວັນ (Daily Practice)
            </p>

            {/* Practice Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigator("/practice")}
                className="flex items-center gap-3 bg-[#5DADE2] hover:brightness-105 active:scale-95 transition-all text-white px-4 py-3 rounded-xl shadow-sm"
              >
                <div className="bg-white/20 rounded-full p-1.5">
                  <Play className="w-4 h-4 fill-white text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-base">ສຽງ "ສ"</p>
                  <p className="text-sm opacity-90">(Sound /s/)</p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-80" />
              </button>

              <button
                onClick={() => navigator("/practice")}
                className="flex items-center gap-3 bg-[#5DADE2] hover:brightness-105 active:scale-95 transition-all text-white px-4 py-3 rounded-xl shadow-sm"
              >
                <div className="bg-white/20 rounded-full p-1.5">
                  <Play className="w-4 h-4 fill-white text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-base">ສຽງ "ລ"</p>
                  <p className="text-sm opacity-90">(Sound /l/)</p>
                </div>
                <ChevronRight className="w-5 h-5 opacity-80" />
              </button>
            </div>

            {/* Learning Level */}
            <div>
              <p className="text-gray-600 text-sm font-medium text-center mb-3">
                ລະດັບຄວາມຮູ້ຂອງເຈົ້າ (Your Learning Level)
              </p>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-0 mb-5">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full border-2 border-[#5DADE2] bg-white flex items-center justify-center">
                    <Check className="w-5 h-5 text-[#5DADE2] stroke-[3]" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Sound</span>
                </div>
                <div className="w-12 h-0.5 bg-[#5DADE2] mb-4" />
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full border-2 border-[#5DADE2] bg-white flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#5DADE2] fill-[#5DADE2]" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Word</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300 mb-4" />
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-400 mt-1">Phase</span>
                </div>
              </div>

              {/* Start Session Button */}
              <button
                onClick={() => navigator("/practice")}
                className="w-full flex flex-col items-center justify-center 
                           bg-[#5DADE2] text-white px-6 py-3 rounded-2xl 
                           shadow-[0_4px_0px_0_rgba(53,88,114,0.6)]
                           transition-all hover:brightness-110 active:scale-95"
              >
                <span className="text-xl font-semibold leading-tight">ເລີ່ມຕົ້ນຝຶກມື້ນີ້</span>
                <span className="text-sm font-medium opacity-90">Start Today's Session</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}