import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getDb } from "./lib/firebase";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const db = getDb();
  const id = event.pathParameters?.id;
  const body = JSON.parse(event.body || "{}");
  const { name } = body;

  if (!id || !name?.trim()) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "잘못된 요청입니다." }),
    };
  }

  const docRef = db.collection("guestbook").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "방명록을 찾을 수 없습니다." }),
    };
  }

  if (doc.data()!.name !== name.trim()) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "성명이 일치하지 않습니다." }),
    };
  }

  await docRef.delete();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true }),
  };
}
