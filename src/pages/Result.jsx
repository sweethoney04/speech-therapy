import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import successIcon from "../assets/images/success.png"; 
import sign from "../assets/images/right (1).png";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const [animatedVoice, setAnimatedVoice] = useState(0);
  const [animatedMouth, setAnimatedMouth] = useState(0);

  const resultsData = [
    {
      word: "ເສືອ",
      heard: "ເຈືອ",
      voiceStatus: "error",
      voiceFeedback: "ຜິດພະຍັນຊະນະຕົ້ນ (ສ ➔ ຈ)",
      mouthStatus: "success",
      mouthFeedback: "ຖືກຕ້ອງ (ວາງຮູບປາກດີແລ້ວ)"
    },
    {
      word: "ປາ",
      heard: "ປາ",
      voiceStatus: "success",
      voiceFeedback: "ອອກສຽງຊັດເຈນດີຫຼາຍ",
      mouthStatus: "error",
      mouthFeedback: "ບໍ່ກວ້າງພໍ (ລອງເປີດປາກໃຫ້ກວ້າງຂຶ້ນອີກ)"
    },
    {
      word: "ແມ່",
      heard: "ແມ່",
      voiceStatus: "success",
      voiceFeedback: "ອອກສຽງໄດ້ຖືກຕ້ອງຫຼາຍ",
      mouthStatus: "success",
      mouthFeedback: "ຖືກຕ້ອງ (ການວາງຮູບປາກ M ເຮັດໄດ້ດີ)"
    },
    {
      word: "ແມວ",
      heard: "ແມວ",
      voiceStatus: "success",
      voiceFeedback: "ອ່ານອອກສຽງໄດ້ຊັດເຈນຫຼາຍ",
      mouthStatus: "warning",
      mouthFeedback: "ປິດປາກໄວເກີນໄປ (ລອງເຮັດຮູບປາກ ວ ໃຫ້ຊັດເຈນ)"
    }
  ];

  const targetVoice = 75;
  const targetMouth = 60;

  const getNextGoals = () => {
    const goals = [];
    const errorWords = resultsData.filter(i => i.voiceStatus === "error").map(i => i.word);
    const mouthIssues = resultsData.filter(i => i.mouthStatus !== "success").map(i => i.word);

    if (errorWords.length > 0) {
      goals.push({
        icon: "🗣️",
        label: "ຄຳທີ່ຕ້ອງຝຶກສຽງຄືນ",
        detail: errorWords.join(", ")
      });
    }
    if (mouthIssues.length > 0) {
      goals.push({
        icon: "👄",
        label: "ຄຳທີ່ຕ້ອງປັບຮູບປາກ",
        detail: mouthIssues.join(", ")
      });
    }
    if (targetVoice < 80) {
      goals.push({
        icon: "🎯",
        label: "ເປົ້າໝາຍຕໍ່ໄປ",
        detail: `ເພີ່ມຄະແນນສຽງໃຫ້ຮອດ 80% (ຕອນນີ້ ${targetVoice}%)`
      });
    }
    if (targetMouth < 80) {
      goals.push({
        icon: "📈",
        label: "ເປົ້າໝາຍປາກ",
        detail: `ເພີ່ມຄະແນນປາກໃຫ້ຮອດ 80% (ຕອນນີ້ ${targetMouth}%)`
      });
    }
    return goals;
  };

  const nextGoals = getNextGoals();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedVoice(targetVoice);
      setAnimatedMouth(targetMouth);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Fix: use Intl.Segmenter to handle Lao grapheme clusters correctly
  const renderHighlightedText = (target, heard) => {
    const segmenter = new Intl.Segmenter("lo", { granularity: "grapheme" });
    const targetChars = [...segmenter.segment(target)].map(s => s.segment);
    const heardChars = [...segmenter.segment(heard)].map(s => s.segment);

    return heardChars.map((char, index) => {
      const isMatch = char === targetChars[index];
      return (
        <span key={index} className={isMatch ? "text-green-600" : "text-red-500 font-bold"}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5] font-lao p-4 md:p-10 text-[#355872]">
      <div className="relative flex-1 flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-12">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#5DADE2] hover:bg-sky-50 transition-colors"
        >
          <img src={sign} alt="Back" className="w-5 h-5 object-contain" />
        </button>

        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100 px-2 md:px-8 py-4"> 
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center lg:text-left">ລາຍລະອຽດການຝຶກ (Feedback Result)</h1>

          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-3 custom-scrollbar">
            {resultsData.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-4 border-l-4 border-[#5DADE2] shadow-sm transition-transform hover:scale-[1.01]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold">{item.word}</span>
                  {item.voiceStatus === "success" && item.mouthStatus === "success" && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg font-bold">Excellent</span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex items-start gap-2">
                    <span className="min-w-[50px]"> ສຽງ:</span>
                    <div>
                      <span className="text-lg">"{renderHighlightedText(item.word, item.heard)}"</span>
                      <p className="text-xs text-gray-500 italic mt-1">{item.voiceFeedback}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-gray-200">
                    <span className="min-w-[50px]"> ປາກ:</span>
                    <span className={item.mouthStatus === 'success' ? "text-green-600 font-medium" : "text-orange-500 font-medium"}>
                      {item.mouthFeedback}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Motivational Summary */}
            <div className="mt-8 p-6 bg-sky-50 rounded-2xl border-2 border-dashed border-sky-200">
              <p className="text-center text-sm md:text-base font-medium leading-relaxed italic">
                "ສະຫຼຸບ, ການພັດທະນາສຽງຂອງທ່ານໄດ້ດີຂຶ້ນຈາກບົດຮຽນຄັ້ງທີ່ແລ້ວຫຼາຍ. ຈົ່ງພັດທະນາຕໍ່ໄປເດີ້! "
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col px-4 md:px-10 py-4 justify-between">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-8">ຜົນໄດ້ຮັບລວມ (Results)</h3>
            
            <div className="space-y-12">
              {/* Voice Bar */}
              <div className="space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>ການອ່ານອອກສຽງ (Voice)</span>
                  <span className="text-[#355872]">{animatedVoice}%</span>
                </div>
                <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-[#355872] transition-all duration-[1500ms] ease-out rounded-full" 
                    style={{ width: `${animatedVoice}%` }}
                  ></div>
                </div>
              </div>

              {/* Mouth Bar */}
              <div className="space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>ການອ່ານປາກ (Mouth)</span>
                  <span className="text-[#5DADE2]">{animatedMouth}%</span>
                </div>
                <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-[#5DADE2] transition-all duration-[1500ms] ease-out rounded-full" 
                    style={{ width: `${animatedMouth}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* ===== NEXT GOAL SECTION ===== */}
            <div className="mt-10 space-y-4">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                <h5 className="font-bold text-base md:text-lg mb-3 text-[#355872]">
                  🎯 ສິ່ງທີ່ຄວນສຸ່ມໃສ່ຄັ້ງຕໍ່ໄປ (Focus Next)
                </h5>
                <ul className="space-y-2">
                  {nextGoals.map((goal, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm md:text-base text-[#355872]">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#5DADE2] flex-shrink-0"></span>
                      <div>
                        <span className="font-semibold">{goal.label}: </span>
                        <span className="text-gray-600">{goal.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 items-center">
            <button 
              onClick={() => navigate("/practice")} 
              className="w-full max-w-sm py-4 bg-white border-2 border-[#5DADE2] text-[#5DADE2] text-xl font-bold rounded-2xl hover:bg-sky-50 transition-all active:scale-95 shadow-sm"
            >
              ຝຶກອີກຄັ້ງ (Practice Again)
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="w-full max-w-sm py-4 bg-[#5DADE2] text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-[#4682B4] transition-all active:scale-95"
            >
              ຝຶກບົດຕໍ່ໄປ (Next Lesson)
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #5DADE2; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #355872; }
      `}</style>
    </div>
  );
}