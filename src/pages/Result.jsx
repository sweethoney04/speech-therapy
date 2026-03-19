import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Icons (ໃຫ້ກວດເບິ່ງ Path ຮູບຂອງທ່ານຄືນ)
import successIcon from "../assets/images/success.png"; 
import sign from "../assets/images/right (1).png";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. ຮັບຂໍ້ມູນ STT ຈາກໜ້າ Practice
  const sttResult = location.state?.transcription || "ລໍຖ້າຜົນ...";
  const targetWord = location.state?.targetWord || "ຍັງບໍ່ມີຂໍ້ມູນ";

  // 2. Logic ການຄິດໄລ່ (ສຳລັບໂຊໃນ Progress Bar)
  const isCorrect = sttResult.trim() === targetWord.trim();
  const voiceScore = isCorrect ? 100 : 45; // ຖ້າຖືກໃຫ້ 100%, ຖ້າຜິດໃຫ້ 45% (ຫຼື ຕາມຄວາມເໝາະສົມ)
  const mouthScore = isCorrect ? 90 : 30;  // ຄ່າສົມມຸດ Mouth Accuracy

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F5F5F5] font-lao p-4 md:p-10">
      <div className="relative flex-1 flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-12">
        
        {/* Back Button */}
        <button onClick={() => navigate("/")} className="absolute top-4 left-4 md:top-8 md:left-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 border-[#5DADE2]">
          <img src={sign} alt="Back" className="w-5 h-5 object-contain rotate-180" />
        </button>

        {/* LEFT COLUMN: Achievement & AI Heard */}
        <div className="flex-1 flex flex-col items-center justify-start border-b-2 lg:border-b-0 lg:border-r-2 border-gray-100 px-4 md:px-10 py-8"> 
          <h1 className="text-[#355872] text-2xl md:text-4xl font-bold mb-1">ຜົນການຝຶກຊ້ອມ</h1>
          <p className="text-[#355872] opacity-70 mb-6">(Session Feedback)</p>

          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#5DADE2] rounded-full flex items-center justify-center mb-4 shadow-lg p-4">
               <img src={successIcon} alt="Success" className="w-full h-full object-contain invert brightness-0" />
            </div>
            <p className="text-[#355872] text-2xl md:text-3xl font-bold">
               {isCorrect ? "ເກັ່ງຫຼາຍ!" : "ພະຍາຍາມອີກ!"}
            </p>
          </div>

          {/* Feedback Box: ໂຊ STT ທີ່ AI ໄດ້ຍິນແທ້ໆ */}
          <div className="w-full max-w-md border-2 border-[#5DADE2] rounded-2xl p-6 bg-sky-50/10">
             <p className="text-gray-400 text-xs font-bold uppercase mb-2">AI ໄດ້ຍິນວ່າ (STT Result):</p>
             <p className={`text-2xl md:text-3xl font-bold ${isCorrect ? 'text-green-600' : 'text-orange-500'}`}>
               "{sttResult}"
             </p>
             <p className="mt-4 text-[#355872] opacity-60 text-sm">
               {isCorrect ? "ທ່ານອອກສຽງໄດ້ຊັດເຈນດີຫຼາຍ." : `ລອງເນັ້ນສຽງຄຳວ່າ "${targetWord}" ຕື່ມອີກ.`}
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Actions */}
        <div className="flex-1 flex flex-col px-4 md:px-10 py-8">
          <h3 className="text-[#355872] text-2xl md:text-4xl font-bold mb-10">ຜົນໄດ້ຮັບ (Result)</h3>

          <div className="space-y-10 mb-auto">
            {/* Voice Fluency */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <p className="text-sm md:text-lg">ການອ່ານອອກສຽງ (Voice Fluency)</p>
                <p className="text-lg md:text-xl">{voiceScore}%</p>
              </div>
              <div className="w-full h-4 md:h-6 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#355872] transition-all duration-1000" style={{ width: `${voiceScore}%` }}></div>
              </div>
            </div>

            {/* Mouth Accuracy */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <p className="text-sm md:text-lg">ການອ່ານປາກ (Mouth Accuracy)</p>
                <p className="text-lg md:text-xl">{mouthScore}%</p>
              </div>
              <div className="w-full h-4 md:h-6 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#355872] transition-all duration-1000" style={{ width: `${mouthScore}%` }}></div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <button onClick={() => navigate("/practice")} className="w-full max-w-sm py-3 bg-[#5DADE2] text-white text-xl font-bold rounded-2xl shadow-[0px_4px_0px_0px_#4682B4]">
              ຝຶກອີກຄັ້ງ (Practice Again)
            </button>
            <button onClick={() => navigate("/")} className="w-full max-w-sm py-3 bg-[#5DADE2] text-white text-xl font-bold rounded-2xl shadow-[0px_4px_0px_0px_#4682B4]">
              ຝຶກບົດຕໍ່ໄປ (Next)
            </button>
            
            <p className="text-xs font-bold text-[#355872] mt-4">ມື້ນີ້ຮູ້ສຶກແນວໃດ? (How do you feel today?)</p>
            <div className="flex gap-6 text-3xl">
              {['😁', '🙂', '😐', '🙁'].map((e, i) => <button key={i} className="grayscale hover:grayscale-0 active:scale-125 transition-all">{e}</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}