export default function Excuse() {
  return (
    <section className="bg-neutral-950 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="mb-1 text-sm font-semibold tracking-widest text-teal-400">
          이미 잘 쓰고 있는 것 같은데...
        </p>
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          왜 새로운 3D 프린터가 필요해?
        </h2>
        <p
          className="text-lg leading-relaxed text-neutral-400"
          style={{ wordBreak: "keep-all" }}
        >
          갖고 있는 크리메이커 메탈 v1가 노후하여 여러 부속이 부서졌다. 날이 갈
          수록 프린팅 퀄리티가 떨어지는 중. 안 그래도 옛날 모델이라 느린데
          실패도 자주 한다. Bambu Lab A1 Combo로 교체하면...
        </p>
        <ul
          className="my-2 space-y-1 pl-8 text-lg leading-relaxed text-neutral-400 list-disc marker:text-teal-400"
          style={{ wordBreak: "keep-all" }}
        >
          <li>500mm/s의 빠른 속도로 프린팅할 수 있다.</li>
          <li>자동 캘리브레이션으로 계절과 관계 없이 프린팅 퀄리티 유지.</li>
          <li>Combo 모델은 <span className="bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-cyan-400 to-violet-400 bg-clip-text font-semibold text-transparent">다중 색상 프린팅</span>도 지원!</li>
        </ul>
        <p
          className="text-lg leading-relaxed text-neutral-400"
          style={{ wordBreak: "keep-all" }}
        >
          여러분의 도움이 필요하다.
        </p>
      </div>
    </section>
  );
}
