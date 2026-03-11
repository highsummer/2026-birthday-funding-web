import { useCallback, useEffect, useState } from "react";
import { api, type GuestbookEntry } from "./api";

const GOAL_AMOUNT = 599_000;

function formatCurrency(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Funding() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [showAmount, setShowAmount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  // 수정 모드
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editError, setEditError] = useState("");

  // 성명 확인 프롬프트 (수정/삭제 공용)
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyAction, setVerifyAction] = useState<"edit" | "delete">("edit");
  const [verifyName, setVerifyName] = useState("");

  const refreshData = useCallback(async () => {
    const [summaryData, guestbookData] = await Promise.all([
      api.getFundingSummary(),
      api.getGuestbook(),
    ]);
    setTotalAmount(summaryData.totalAmount);
    setDonorCount(summaryData.donorCount);
    setGuestbook(guestbookData.entries);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !nickname.trim() || !message.trim()) {
      setError("성명, 닉네임, 메시지를 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      await api.createGuestbookEntry({
        name: name.trim(),
        nickname: nickname.trim(),
        message: message.trim(),
        showAmount,
      });

      setName("");
      setNickname("");
      setMessage("");
      setShowAmount(false);
      setSuccess("방명록이 등록되었습니다!");
      await refreshData();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "등록 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startVerify = (entry: GuestbookEntry, action: "edit" | "delete") => {
    setVerifyingId(entry.id);
    setVerifyAction(action);
    setVerifyName("");
    setEditError("");
    setEditingId(null);
  };

  const handleVerify = async (entry: GuestbookEntry) => {
    if (!verifyName.trim()) {
      setEditError("성명을 입력해주세요.");
      return;
    }

    if (verifyAction === "edit") {
      // 서버에서 검증하므로 일단 수정 모드 진입, 저장 시 검증
      setEditingId(entry.id);
      setEditName(verifyName.trim());
      setEditNickname(entry.nickname);
      setEditMessage(entry.message);
      setEditError("");
      setVerifyingId(null);
      setVerifyName("");
    } else {
      await handleDelete(entry.id, verifyName.trim());
    }
  };

  const handleDelete = async (entryId: string, nameForVerify: string) => {
    setSubmitting(true);
    setEditError("");

    try {
      await api.deleteGuestbookEntry(entryId, nameForVerify);
      setVerifyingId(null);
      setVerifyName("");
      await refreshData();
    } catch (err) {
      console.error(err);
      setEditError(
        err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (entryId: string) => {
    if (!editMessage.trim()) {
      setEditError("메시지를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setEditError("");

    try {
      await api.updateGuestbookEntry(entryId, {
        name: editName,
        nickname: editNickname.trim(),
        message: editMessage.trim(),
      });
      setEditingId(null);
      setEditName("");
      await refreshData();
    } catch (err) {
      console.error(err);
      setEditError(
        err instanceof Error ? err.message : "수정 중 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const progress = Math.min((totalAmount / GOAL_AMOUNT) * 100, 100);

  return (
    <>
      {/* 펀딩 현황 */}
      <section className="px-4 pt-16 pb-12 text-center bg-neutral-950">
        <div className="mx-auto max-w-2xl">
          <p className="mb-1 text-sm font-semibold tracking-widest text-teal-400">
            그래서 부탁드립니다
          </p>
          <h2 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            생일선물형 펀딩
          </h2>
          <p className="mb-8 text-base text-neutral-400">
            Bambu Lab A1 Combo를 향하여
          </p>

          <div className="mx-auto max-w-md rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-teal-400 sm:text-3xl">
                {formatCurrency(totalAmount)}
              </span>
              <span className="text-sm text-neutral-500">
                목표 {formatCurrency(GOAL_AMOUNT)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              {donorCount}명 참여 · {progress.toFixed(0)}% 달성
            </p>
          </div>
        </div>
      </section>

      {/* 펀딩 참여 혜택 */}
      <section className="px-4 pt-10 pb-2 bg-neutral-950">
        <div className="mx-auto max-w-md rounded-xl border border-teal-400/20 bg-teal-400/5 p-5">
          <p className="mb-1 text-sm font-semibold text-teal-400">
            생일 펀딩 참여 특전
          </p>
          <p
            className="text-base text-neutral-300"
            style={{ wordBreak: "keep-all" }}
          >
            윤하가 직접 Bambu Lab A1 Combo로 프린팅한 기념품 증정
          </p>
        </div>
      </section>

      {/* 펀딩 참여 방법 */}
      <section className="px-4 pt-8 pb-2 bg-neutral-950">
        <div className="mx-auto max-w-md rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
          <p className="mb-3 text-sm font-semibold text-teal-400">
            펀딩에 참여하는 법
          </p>
          <ol
            className="list-decimal pl-5 space-y-3 text-base text-neutral-300"
            style={{ wordBreak: "keep-all" }}
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("토스뱅크 1000-5334-8464");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-neutral-800 px-2 py-0.5 text-left transition-colors hover:bg-neutral-700 active:bg-neutral-600"
              >
                <span>
                  토스뱅크{" "}
                  <span className="font-mono font-semibold text-white">
                    1000-5334-8464
                  </span>{" "}
                  황윤하
                </span>
                {copied ? (
                  <svg
                    className="h-4 w-4 shrink-0 text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 shrink-0 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>{" "}
              로 펀딩할 금액 송금
            </li>
            <li>
              방명록을 작성하기
              <p className="mt-1 text-sm text-neutral-500">
                방명록은 펀딩 참여가 확인된 후 보입니다. 다만 입금 내역을
                연동할 수 있는 방법이 없어서 제가 수동으로 작업합니다. 깨어 있는
                동안은 바로바로 하려고 노력하겠지만 조금 걸릴 수도 있어요...
              </p>
            </li>
            <li>나중에 윤하를 만나면 펀딩 특전 받기</li>
          </ol>
        </div>
      </section>

      {/* 방명록 작성 폼 */}
      <section className="px-4 pt-12 pb-12 bg-neutral-950">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-2xl font-bold text-neutral-100">
            방명록 작성
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
          >
            <p className="text-sm text-neutral-400">
              펀딩에 참여하신 분만 방명록을 작성할 수 있어요.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  성명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="입금자명과 동일하게"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  닉네임 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="방명록에 표시할 이름"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">
                메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="축하 메시지를 남겨주세요!"
                rows={3}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-100 placeholder-neutral-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAmount}
                onChange={(e) => setShowAmount(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-teal-400 focus:ring-teal-500/30"
              />
              <span className="text-sm text-neutral-400">
                방명록에 펀딩 금액 공개하기
              </span>
            </label>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-teal-500/10 px-4 py-2 text-sm text-teal-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "등록 중..." : "방명록 남기기"}
            </button>
          </form>
        </div>
      </section>

      {/* 방명록 목록 */}
      <section className="px-4 pt-4 pb-16 bg-neutral-950">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-2xl font-bold text-neutral-100">
            방명록{" "}
            <span className="text-teal-400">({guestbook.length})</span>
          </h2>
          {guestbook.length === 0 ? (
            <p className="text-center text-neutral-500">
              아직 방명록이 없습니다. 첫 번째로 남겨보세요!
            </p>
          ) : (
            <div className="space-y-4">
              {guestbook.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
                >
                  {editingId === entry.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                          닉네임
                        </label>
                        <input
                          type="text"
                          value={editNickname}
                          onChange={(e) => setEditNickname(e.target.value)}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                          메시지
                        </label>
                        <textarea
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                        />
                      </div>
                      {editError && (
                        <p className="text-sm text-red-400">{editError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(entry.id)}
                          disabled={submitting}
                          className="rounded-lg bg-teal-500 px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                          }}
                          className="rounded-lg bg-neutral-700 px-4 py-1.5 text-sm font-medium text-neutral-300 hover:bg-neutral-600"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold text-neutral-100">
                          {entry.nickname}
                          {entry.showAmount && entry.amount != null && (
                            <span className="ml-2 text-sm font-normal text-teal-500">
                              {formatCurrency(entry.amount)}
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-500">
                            {formatDate(entry.createdAt)}
                          </span>
                          <button
                            onClick={() => startVerify(entry, "edit")}
                            className="text-xs text-neutral-500 hover:text-teal-600"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => startVerify(entry, "delete")}
                            className="text-xs text-neutral-500 hover:text-red-500"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-neutral-300">
                        {entry.message}
                      </p>
                      {verifyingId === entry.id && (
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="text"
                            value={verifyName}
                            onChange={(e) => {
                              setVerifyName(e.target.value);
                              setEditError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleVerify(entry);
                            }}
                            placeholder="성명을 입력하세요"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
                          />
                          <button
                            onClick={() => handleVerify(entry)}
                            disabled={submitting}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 ${
                              verifyAction === "delete"
                                ? "bg-red-500"
                                : "bg-teal-500"
                            }`}
                          >
                            {verifyAction === "delete" ? "삭제" : "확인"}
                          </button>
                          <button
                            onClick={() => {
                              setVerifyingId(null);
                              setEditError("");
                            }}
                            className="text-sm text-neutral-500 hover:text-neutral-300"
                          >
                            취소
                          </button>
                          {editError && (
                            <span className="text-sm text-red-400">
                              {editError}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
