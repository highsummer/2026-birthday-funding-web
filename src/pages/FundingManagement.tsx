import { useState } from "react";
import { api } from "../api";

export default function FundingManagement() {
  const [password, setPassword] = useState("");

  // Add funding form
  const [addName, setAddName] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addDepositedAt, setAddDepositedAt] = useState("");
  const [addResult, setAddResult] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  // Delete funding form
  const [deleteName, setDeleteName] = useState("");
  const [deleteResult, setDeleteResult] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddResult(null);
    setAddError(null);
    setAddLoading(true);

    try {
      const res = await api.addFunding({
        password,
        name: addName,
        amount: parseInt(addAmount, 10),
        depositedAt: addDepositedAt || undefined,
      });
      const actionLabel = res.action === "created" ? "등록" : "업데이트";
      setAddResult(
        `✅ ${res.name} / ${res.amount.toLocaleString()}원 ${actionLabel} 완료`,
      );
      setAddName("");
      setAddAmount("");
      setAddDepositedAt("");
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setDeleteResult(null);
    setDeleteError(null);
    setDeleteLoading(true);

    try {
      const res = await api.deleteFunding({
        password,
        name: deleteName,
      });
      setDeleteResult(
        `✅ "${res.name}" 펀딩 내역 ${res.deletedCount}건 삭제 완료`,
      );
      setDeleteName("");
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-lg mx-auto space-y-8">
        <h1 className="text-2xl font-bold">펀딩 관리</h1>

        {/* Password */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:border-neutral-500"
            placeholder="관리자 비밀번호"
          />
        </div>

        {/* Add Funding */}
        <form onSubmit={handleAdd} className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-neutral-800 pb-2">
            펀딩 등록 / 수정
          </h2>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">성명</label>
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:border-neutral-500"
              placeholder="김롱간"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              금액 (원)
            </label>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:border-neutral-500"
              placeholder="50000"
              required
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              입금일시 (선택)
            </label>
            <input
              type="datetime-local"
              value={addDepositedAt}
              onChange={(e) => setAddDepositedAt(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:border-neutral-500"
            />
          </div>
          <button
            type="submit"
            disabled={addLoading || !password}
            className="w-full rounded-lg bg-white text-black font-semibold py-2 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {addLoading ? "처리 중..." : "등록"}
          </button>
          {addResult && <p className="text-green-400 text-sm">{addResult}</p>}
          {addError && <p className="text-red-400 text-sm">❌ {addError}</p>}
        </form>

        {/* Delete Funding */}
        <form onSubmit={handleDelete} className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-neutral-800 pb-2">
            펀딩 삭제
          </h2>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">성명</label>
            <input
              type="text"
              value={deleteName}
              onChange={(e) => setDeleteName(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-4 py-2 text-white focus:outline-none focus:border-neutral-500"
              placeholder="김롱간"
              required
            />
          </div>
          <button
            type="submit"
            disabled={deleteLoading || !password}
            className="w-full rounded-lg bg-red-600 text-white font-semibold py-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {deleteLoading ? "처리 중..." : "삭제"}
          </button>
          {deleteResult && (
            <p className="text-green-400 text-sm">{deleteResult}</p>
          )}
          {deleteError && (
            <p className="text-red-400 text-sm">❌ {deleteError}</p>
          )}
        </form>
      </div>
    </div>
  );
}
