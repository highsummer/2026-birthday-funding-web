import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getDb } from "./lib/firebase";

export async function handler(
  _event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const db = getDb();

  const [guestbookSnap, fundingSnap] = await Promise.all([
    db.collection("guestbook").orderBy("createdAt", "desc").get(),
    db.collection("funding").get(),
  ]);

  // 펀딩 참여자별 금액 맵
  const fundingAmountByName = new Map<string, number>();
  fundingSnap.forEach((doc) => {
    const data = doc.data();
    const prev = fundingAmountByName.get(data.name) || 0;
    fundingAmountByName.set(data.name, prev + (data.amount || 0));
  });

  // 펀딩 확인된 방명록만, name 제거
  const entries = guestbookSnap.docs
    .filter((doc) => fundingAmountByName.has(doc.data().name))
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nickname: data.nickname,
        message: data.message,
        showAmount: data.showAmount || false,
        amount: data.showAmount
          ? fundingAmountByName.get(data.name)
          : undefined,
        createdAt: data.createdAt?.toDate().toISOString() || null,
      };
    });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  };
}
