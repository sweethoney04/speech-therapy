import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigator = useNavigate();
  return (
    <div>
      <h1>Home</h1>
      <button
        className="fixed bottom-8 right-8 flex flex-col items-center justify-center 
                     bg-[#5DADE2] text-white px-12 py-4 rounded-[20px] 
                     shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-b-4 border-[#355872]
                     transition-all hover:brightness-110 active:scale-95 z-50"
        onClick={() => navigator("/practice")}
      >
        <span className="text-2xl font-medium leading-tight">
          ເລີ່ມຕົ້ນຝຶກມື້ນີ້
        </span>
        <span className="text-lg font-medium opacity-90">
          Start Today's Session
        </span>
      </button>
    </div>
  );
}
