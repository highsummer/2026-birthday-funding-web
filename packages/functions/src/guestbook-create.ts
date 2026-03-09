import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getDb } from "./lib/firebase";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const db = getDb();
  const body = JSON.parse(event.body || "{}");
  const { name, nickname, message, showAmount } = body;

  if (!name?.trim() || !nickname?.trim() || !message?.trim()) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "성명, 닉네임, 메시지를 모두 입력해주세요.",
      }),
    };
  }

  const trimmedName = name.trim();

  // 닉네임 일관성 검증
  const existingSnap = await db
    .collection("guestbook")
    .where("name", "==", trimmedName)
    .get();

  if (!existingSnap.empty) {
    const existingNickname = existingSnap.docs[0].data().nickname;
    if (existingNickname !== nickname.trim()) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "닉네임이 일치하지 않습니다.",
        }),
      };
    }
  }

  // 펀딩 금액 조회
  const fundingSnap = await db
    .collection("funding")
    .where("name", "==", trimmedName)
    .get();

  const fundingAmount = fundingSnap.docs.reduce(
    (sum, d) => sum + (d.data().amount || 0),
    0,
  );

  const now = new Date();
  const docRef = await db.collection("guestbook").add({
    name: trimmedName,
    nickname: nickname.trim(),
    message: message.trim(),
    showAmount: !!showAmount,
    amount: fundingAmount,
    createdAt: now,
  });

  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: docRef.id,
      nickname: nickname.trim(),
      message: message.trim(),
      showAmount: !!showAmount,
      amount: showAmount ? fundingAmount : undefined,
      createdAt: now.toISOString(),
    }),
  };
}
