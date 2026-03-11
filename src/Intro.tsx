export default function Intro() {
  return (
    <section className="px-4 py-20 bg-neutral-950">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-1 text-sm font-semibold tracking-widest text-teal-400">
          사실은요
        </p>
        <h2
          className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          style={{ wordBreak: "keep-all" }}
        >
          생일선물 대신 펀딩을 열었습니다
        </h2>
        <p
          className="text-lg leading-relaxed text-neutral-400"
          style={{ wordBreak: "keep-all" }}
        >
          매년 생일선물 뭐 갖고 싶냐는 질문을 받으면 딱히 떠오르는 게
          없었는데, 올해는 확실하게 갖고 싶은 게 하나 있습니다. 다만 혼자
          사기엔 좀 비싸서, 이렇게 염치 없이 펀딩 페이지를 만들어봤습니다.
        </p>
      </div>
    </section>
  );
}
