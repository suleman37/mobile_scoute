import React from "react";

const Title = ({ text1, text2, light = false }) => {
  return (
    <div className="inline-flex items-center gap-2.5">
        <span className={`h-1.5 w-1.5 rounded-[10px] ${light ? "bg-[#8ab4ff]" : "bg-[#0071e3]"}`} />
        <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${light ? "text-white/55" : "text-[#6e6e73]"}`}>
          {text1} <span className={light ? "text-white" : "text-[#1d1d1f]"}>{text2}</span>
        </p>
      </div>
  );
};

export default Title;
