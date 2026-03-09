import { useRef } from "react";
import Excuse from "./Excuse";
import Funding from "./Funding";
import Gallery from "./Gallery";
import Hero from "./Hero";

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-black">
      {/* 패럴랙스 히어로 */}
      <Hero />

      {/* 히어로 하단 */}
      <div
        ref={heroRef}
        className="relative z-30 bg-gradient-to-b from-black via-neutral-950 to-neutral-950"
      >
        {/* 갤러리 */}
        <Gallery />

        {/* 왜 새로운 3D 프린터가 필요해? */}
        <Excuse />

        {/* 펀딩 현황 + 방명록 */}
        <Funding />
      </div>
    </div>
  );
}
