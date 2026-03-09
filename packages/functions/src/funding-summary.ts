import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getDb } from "./lib/firebase";

export async function handler(
  _event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const db = getDb();
  const snapshot = await db.collection("funding").get();

  let totalAmount = 0;
  snapshot.forEach((doc) => {
    totalAmount += doc.data().amount || 0;
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      totalAmount,
      donorCount: snapshot.size,
    }),
  };
}
