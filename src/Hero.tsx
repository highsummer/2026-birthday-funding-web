import { useCallback, useEffect, useState } from "react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [vh, setVh] = useState(800);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    setVh(window.innerHeight || 800);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 텍스트: 스크롤을 따라 올라가고 fade out
  const textOpacity = Math.max(1 - scrollY / (vh * 0.5), 0);
  const textTranslateY = -scrollY;
  // 이미지: 처음엔 아래에 있다가 천천히 중앙으로, 밝기도 점점 밝아짐
  const imgProgress = Math.min(scrollY / vh, 1);
  const imgOffsetY = (1 - imgProgress) * vh * 0.08 - scrollY * 0.2;
  const imgBrightness = 0.5 + imgProgress * 0.5;

  return (
    <div style={{ height: `${vh * 1.2}px` }} className="relative">
      {/* 보케 레이어 - 고정 */}
      <div
        className="pointer-events-none fixed inset-0 z-[18]"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        {/* 큰 보케 */}
        <div className="absolute left-[8%] top-[28%] h-28 w-28 rounded-full bg-teal-400/30 blur-2xl animate-bokeh-1 sm:h-44 sm:w-44" />
        <div className="absolute right-[10%] top-[22%] h-24 w-24 rounded-full bg-cyan-300/25 blur-2xl animate-bokeh-2 sm:h-36 sm:w-36" />
        <div className="absolute left-[18%] bottom-[28%] h-24 w-24 rounded-full bg-teal-500/25 blur-2xl animate-bokeh-3 sm:h-40 sm:w-40" />
        <div className="absolute right-[15%] bottom-[22%] h-20 w-20 rounded-full bg-cyan-400/30 blur-2xl animate-bokeh-1 sm:h-32 sm:w-32" />
        {/* 중간 보케 */}
        <div className="absolute left-[42%] top-[18%] h-16 w-16 rounded-full bg-white/15 blur-xl animate-bokeh-2 sm:h-24 sm:w-24" />
        <div className="absolute right-[32%] bottom-[18%] h-14 w-14 rounded-full bg-teal-300/20 blur-xl animate-bokeh-3 sm:h-20 sm:w-20" />
        <div className="absolute left-[30%] top-[40%] h-12 w-12 rounded-full bg-cyan-200/20 blur-xl animate-bokeh-1 sm:h-20 sm:w-20" />
        <div className="absolute right-[28%] top-[35%] h-14 w-14 rounded-full bg-teal-400/20 blur-xl animate-bokeh-2 sm:h-20 sm:w-20" />
        {/* 작은 보케 */}
        <div className="absolute left-[15%] top-[45%] h-8 w-8 rounded-full bg-white/20 blur-lg animate-bokeh-3 sm:h-12 sm:w-12" />
        <div className="absolute right-[22%] top-[40%] h-6 w-6 rounded-full bg-teal-300/25 blur-lg animate-bokeh-1 sm:h-10 sm:w-10" />
        <div className="absolute left-[50%] bottom-[35%] h-8 w-8 rounded-full bg-cyan-300/25 blur-lg animate-bokeh-2 sm:h-12 sm:w-12" />
        <div className="absolute right-[40%] top-[25%] h-6 w-6 rounded-full bg-white/15 blur-lg animate-bokeh-3 sm:h-10 sm:w-10" />
        <div className="absolute left-[35%] bottom-[40%] h-5 w-5 rounded-full bg-teal-200/20 blur-md animate-bokeh-1 sm:h-8 sm:w-8" />
        <div className="absolute right-[8%] top-[45%] h-6 w-6 rounded-full bg-cyan-400/20 blur-md animate-bokeh-2 sm:h-10 sm:w-10" />
        <div className="absolute left-[25%] top-[22%] h-5 w-5 rounded-full bg-white/20 blur-md animate-bokeh-3 sm:h-8 sm:w-8" />
        <div className="absolute right-[45%] bottom-[28%] h-4 w-4 rounded-full bg-teal-300/30 blur-md animate-bokeh-1 sm:h-6 sm:w-6" />
        {/* 미세 입자 - 블러 없이 선명 */}
        <div className="absolute left-[12%] top-[35%] h-1 w-1 rounded-full bg-teal-300 animate-particle-1" />
        <div className="absolute right-[14%] top-[30%] h-1 w-1 rounded-full bg-cyan-300 animate-particle-2" />
        <div className="absolute left-[25%] top-[25%] h-1 w-1 rounded-full bg-white animate-particle-3" />
        <div className="absolute right-[30%] bottom-[30%] h-1 w-1 rounded-full bg-teal-400 animate-particle-1" />
        <div className="absolute left-[40%] top-[20%] h-1 w-1 rounded-full bg-cyan-200 animate-particle-2" />
        <div className="absolute right-[20%] top-[45%] h-1 w-1 rounded-full bg-teal-200 animate-particle-3" />
        <div className="absolute left-[48%] bottom-[25%] h-1 w-1 rounded-full bg-white animate-particle-1" />
        <div className="absolute right-[38%] top-[38%] h-1 w-1 rounded-full bg-cyan-400 animate-particle-2" />
        <div className="absolute left-[22%] bottom-[35%] h-1 w-1 rounded-full bg-teal-300 animate-particle-3" />
        <div className="absolute right-[25%] top-[28%] h-1 w-1 rounded-full bg-white/80 animate-particle-1" />
        <div className="absolute left-[55%] top-[42%] h-1 w-1 rounded-full bg-cyan-300 animate-particle-2" />
        <div className="absolute right-[42%] bottom-[38%] h-1 w-1 rounded-full bg-teal-200 animate-particle-3" />
        <div className="absolute left-[33%] top-[32%] h-[3px] w-[3px] rounded-full bg-white animate-particle-1" />
        <div className="absolute right-[18%] bottom-[40%] h-[3px] w-[3px] rounded-full bg-teal-400 animate-particle-2" />
        <div className="absolute left-[45%] top-[48%] h-[3px] w-[3px] rounded-full bg-cyan-200 animate-particle-3" />
        <div className="absolute right-[48%] top-[22%] h-[3px] w-[3px] rounded-full bg-teal-300 animate-particle-1" />
        <div className="absolute left-[18%] top-[40%] h-[3px] w-[3px] rounded-full bg-white/90 animate-particle-2" />
        <div className="absolute right-[35%] bottom-[32%] h-[3px] w-[3px] rounded-full bg-cyan-400 animate-particle-3" />
        <div className="absolute left-[58%] bottom-[42%] h-1 w-1 rounded-full bg-teal-200 animate-particle-1" />
        <div className="absolute right-[52%] top-[34%] h-1 w-1 rounded-full bg-white animate-particle-2" />
      </div>

      {/* 텍스트 레이어 - 고정 */}
      <div
        className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/hero.png"
            alt="저 곧 생일인데 Bambu Lab A1 Combo 갖고싶습니다"
            className="max-w-[85%] sm:max-w-xl md:max-w-2xl"
            draggable={false}
          />
          <p className="text-sm tracking-widest text-neutral-400 sm:text-base">
            3월 25일 생일 기념 크라우드펀딩
          </p>
        </div>
      </div>

      {/* 하단 chevron - 스크롤 유도 */}
      <div
        className="pointer-events-none fixed bottom-8 left-0 right-0 z-20 flex justify-center"
        style={{ opacity: textOpacity }}
      >
        <svg
          className="h-8 w-8 animate-bounce text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* 이미지 레이어 - 고정, 패럴랙스 */}
      <div
        className="fixed inset-0 z-10 flex items-center justify-center"
        style={{
          transform: `translateY(${imgOffsetY}px)`,
          filter: `brightness(${imgBrightness})`,
        }}
      >
        <img
          src="/assets/A1.jpeg"
          alt="Bambu Lab A1 Combo"
          className="w-[85%] max-w-4xl"
        />
      </div>

      {/* 어두운 오버레이 - 텍스트 가독성 */}
      <div
        className="pointer-events-none fixed inset-0 z-[15] bg-black"
        style={{ opacity: textOpacity * 0.3 }}
      />
    </div>
  );
}
