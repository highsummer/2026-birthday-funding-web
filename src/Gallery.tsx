import { useEffect, useMemo, useRef, useState } from "react";

interface Creation {
  image: string;
  title: string;
  description: string | React.ReactNode;
}

const CREATIONS: Creation[] = [
  {
    image: "/assets/creations/banana_hook.png",
    title: "바나나 걸이",
    description: "바나나를 걸어서 보관하면 좋다.",
  },
  {
    image: "/assets/creations/camera_enclosure.png",
    title: "카메라 인클로저",
    description: "롱간이 케이지에 넣으려고 카메라를 만들었던 흔적.",
  },
  {
    image: "/assets/creations/cup.png",
    title: "컵",
    description: (
      <>
        욕실에 칫솔을 보관하기 위해 아래로 물이 빠지는 특수한 컵을 만듦.{" "}
        <i>(그럼 컵이 맞나?)</i>
      </>
    ),
  },
  {
    image: "/assets/creations/desk_chisel.png",
    title: "데스크 웨지",
    description: "책상의 흔들림을 방지하기 위해 벽과 책상 사이에 끼우는 용도.",
  },
  {
    image: "/assets/creations/dryer_holder.png",
    title: "드라이기 거치대",
    description: "드라이기를 화장대 옆에 걸어두기 위해 만들었다.",
  },
  {
    image: "/assets/creations/holder.png",
    title: "홀더",
    description:
      "속이 빈 원통일 뿐이다. 그러나 욕실의 샤워 타올 거치대 높이를 적절히 유지해준다.",
  },
  {
    image: "/assets/creations/lantern.png",
    title: "랜턴",
    description: "캠핑에 쓰기 위해 안 쓰는 보조배터리로 랜턴을 만들었다.",
  },
  {
    image: "/assets/creations/led_angle.png",
    title: "LED 앵글",
    description: "오타쿠 장식장에 비쳐지는 LED를 받침.",
  },
  {
    image: "/assets/creations/legs.png",
    title: "난쟁이 선반 다리",
    description:
      "주방에 양념 등을 올려놓는 난쟁이 선반의 다리. 주방의 턱에 알맞게 앞과 뒤의 높이가 다르다.",
  },
  {
    image: "/assets/creations/limiter.png",
    title: "케이지 뚜껑 턱",
    description:
      "롱간이 케이지 뚜껑을 열 때 뚜껑을 받치는 턱. 끝에 자석을 붙여서 뚜껑을 고정한다.",
  },
  {
    image: "/assets/creations/nametag.png",
    title: "이름표",
    description: "캠핑 짐을 구분하기 위해 만든 이름표.",
  },
  {
    image: "/assets/creations/shower_head_rest.png",
    title: "샤워헤드 거치대",
    description:
      "샤워기 헤드의 굵기가 집에 달려있는 거치대보다 얇아서 샤워기 헤드를 고정할 용도로 만듦.",
  },
  {
    image: "/assets/creations/stamp.png",
    title: "스탬프",
    description: "놀라운 사실: 3D 프린터로 도장도 만들 수 있다!",
  },
  {
    image: "/assets/creations/tarot_card_case.png",
    title: "타로 카드 케이스",
    description: "타로 카드 보관용 맞춤 케이스.",
  },
  {
    image: "/assets/creations/tooth.png",
    title: '케이지 뚜껑 "앞니"',
    description: "케이지 뚜껑을 닫을 때 잘 맞물리도록 만든 앞니.",
  },
];

const CARD_WIDTH = 280;
const GAP = 16;
const STEP = CARD_WIDTH + GAP;

export default function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });

  // 셔플해서 무작위 순서로
  const shuffled = useMemo(() => {
    const arr = [...CREATIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // 순환을 위해 앞뒤로 복제 (3세트)
  const items = useMemo(
    () => [...shuffled, ...shuffled, ...shuffled],
    [shuffled],
  );

  // 초기 스크롤을 중간 세트로
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = shuffled.length * STEP;
  }, [shuffled]);

  // 순환 처리: 끝에 도달하면 중간으로 점프
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const setWidth = shuffled.length * STEP;
    if (el.scrollLeft < setWidth * 0.3) {
      el.scrollLeft += setWidth;
    } else if (el.scrollLeft > setWidth * 1.7) {
      el.scrollLeft -= setWidth;
    }
  };

  // 드래그 스크롤
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragState.current = {
      startX: e.pageX,
      scrollLeft: scrollRef.current?.scrollLeft ?? 0,
    };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.pageX - dragState.current.startX;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  };
  const onMouseUp = () => setIsDragging(false);

  // 좌우 버튼
  const scroll = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * STEP * 2, behavior: "smooth" });
  };

  return (
    <section className="relative py-16 bg-neutral-950">
      <div className="mx-auto max-w-2xl px-4 mb-8">
        <p className="mb-1 text-sm font-semibold tracking-widest text-teal-400">
          원래는 크리메이커 메탈 v1이 있었다
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          여태까지 만든 것
        </h2>
      </div>

      <div className="relative group">
        {/* 좌우 버튼 */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/80 sm:left-4 sm:p-3"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/80 sm:right-4 sm:p-3"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* 좌우 페이드 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r from-neutral-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l from-neutral-950 to-transparent" />

        {/* 스크롤 컨테이너 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="flex items-stretch gap-4 overflow-x-auto px-8 scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, i) => (
            <div
              key={`${item.image}-${i}`}
              className="flex-shrink-0 select-none"
              style={{ width: CARD_WIDTH }}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-colors hover:border-neutral-700">
                <div className="flex h-48 items-center justify-center bg-neutral-800/50 p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-neutral-100">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400" style={{ wordBreak: "keep-all" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
