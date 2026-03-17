import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

import sign from "../assets/images/left.png";

const progressData = [
  { day: "M", value: 20 },
  { day: "T", value: 30 },
  { day: "W", value: 60 },
  { day: "T", value: 45 },
  { day: "F", value: 65 },
  { day: "S", value: 80 },
  { day: "S", value: 95 },
];

const soundData = [
  { day: "M", value: 50 },
  { day: "T", value: 75 },
  { day: "W", value: 80 },
  { day: "T", value: 40 },
  { day: "F", value: 65 },
  { day: "S", value: 82 },
  { day: "S", value: 60 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="bg-white w-full h-full p-8">

        {/* Back button */}
        <button
         onClick={() => navigate("/")}
         className="mb-6 w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#5DADE2] hover:bg-sky-50 transition-all active:scale-90">
         <img src={sign} alt="Back" className="w-7 h-7 object-contain" />

        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">For Therapists or Parents</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Learner */}
          <div className="border-2 border-[#5DADE2] rounded-2xl p-5 flex flex-col items-center gap-2">
            <p className="text-gray-600 text-sm font-medium text-center">ຜູ້ຮຽນ (Learner)</p>
            <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#5DADE2]" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="32" cy="16" r="8" />
              <path d="M16 52 Q16 36 32 36 Q48 36 48 52" />
              <rect x="20" y="42" width="24" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" />
              <line x1="32" y1="42" x2="32" y2="56" />
            </svg>
          </div>

          {/* Avg Score */}
          <div className="border-2 border-[#5DADE2] rounded-2xl p-5 flex flex-col items-center justify-center gap-1">
            <p className="text-gray-600 text-sm font-medium text-center">ຄະແນນສະເລ່ຍ</p>
            <p className="text-gray-600 text-sm">(Avg. Score)</p>
            <p className="text-4xl font-bold text-[#5DADE2] mt-1">78%</p>
          </div>

          {/* Practice Time */}
          <div className="border-2 border-[#5DADE2] rounded-2xl p-5 flex flex-col items-center justify-center gap-1">
            <p className="text-gray-600 text-sm font-medium text-center">ເວລາຝຶກ</p>
            <p className="text-gray-600 text-sm">(Practice Time)</p>
            <p className="text-4xl font-bold text-[#5DADE2] mt-1">30 mins</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Progress Chart */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <p className="text-gray-600 text-sm font-medium mb-4">ຄວາມກ້າວໜ້າ (Progress)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1f2937" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sound Usage Chart */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <p className="text-gray-600 text-sm font-medium mb-4">ການໃຊ້ສຽງ (Sound Usage)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={soundData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2d6a8f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}