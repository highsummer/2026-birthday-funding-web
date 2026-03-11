import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { getDb } from "./lib/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { Resource } from "sst";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const db = getDb();
  const body = JSON.parse(event.body || "{}");
  const { password, name, amount, depositedAt } = body;

  if (password !== Resource.AdminPassword.value) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "비밀번호가 올바르지 않습니다." }),
    };
  }

  if (!name?.trim() || !amount) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "성명과 금액을 입력해주세요." }),
    };
  }

  const parsedAmount = parseInt(String(amount), 10);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "금액은 양의 정수여야 합니다." }),
    };
  }

  let depositedAtTs: FirebaseFirestore.Timestamp;
  if (depositedAt) {
    const parsed = new Date(depositedAt);
    if (isNaN(parsed.getTime())) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "입금일시 형식이 올바르지 않습니다.",
        }),
      };
    }
    depositedAtTs = Timestamp.fromDate(parsed);
  } else {
    depositedAtTs = Timestamp.now();
  }

  const trimmedName = name.trim();

  const snapshot = await db
    .collection("funding")
    .where("name", "==", trimmedName)
    .get();

  let docId: string;
  let action: "created" | "updated";

  if (snapshot.empty) {
    const docRef = await db.collection("funding").add({
      name: trimmedName,
      amount: parsedAmount,
      depositedAt: depositedAtTs,
      createdAt: Timestamp.now(),
    });
    docId = docRef.id;
    action = "created";
  } else {
    const existingDoc = snapshot.docs[0];
    await existingDoc.ref.update({
      amount: parsedAmount,
      depositedAt: depositedAtTs,
    });
    docId = existingDoc.id;
    action = "updated";
  }

  return {
    statusCode: action === "created" ? 201 : 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: docId,
      action,
      name: trimmedName,
      amount: parsedAmount,
    }),
  };
}
