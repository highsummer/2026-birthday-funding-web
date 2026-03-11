import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { getDb } from "./lib/firebase";
import { Resource } from "sst";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const db = getDb();
  const body = JSON.parse(event.body || "{}");
  const { password, name } = body;

  if (password !== Resource.AdminPassword.value) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "비밀번호가 올바르지 않습니다." }),
    };
  }

  if (!name?.trim()) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "성명을 입력해주세요." }),
    };
  }

  const trimmedName = name.trim();

  const snapshot = await db
    .collection("funding")
    .where("name", "==", trimmedName)
    .get();

  if (snapshot.empty) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `"${trimmedName}" 이름의 펀딩 내역이 없습니다.`,
      }),
    };
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deletedCount: snapshot.size,
      name: trimmedName,
    }),
  };
}
