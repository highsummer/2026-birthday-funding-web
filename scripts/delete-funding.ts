/**
 * 펀딩 내역 삭제 스크립트 (성명 기준)
 *
 * 사용법:
 *   npx tsx scripts/delete-funding.ts <성명>
 *
 * 예시:
 *   npx tsx scripts/delete-funding.ts 홍길동
 */

import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ID = "birthday-funding-1be4b";

const serviceAccountPath = resolve(__dirname, "../service-account-key.json");

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID });
} else {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}

const db = getFirestore();

async function main() {
  const [, , name] = process.argv;

  if (!name) {
    console.error("사용법: npx tsx scripts/delete-funding.ts <성명>");
    console.error("예시:   npx tsx scripts/delete-funding.ts 홍길동");
    process.exit(1);
  }

  const snapshot = await db
    .collection("funding")
    .where("name", "==", name.trim())
    .get();

  if (snapshot.empty) {
    console.error(`❌ "${name}" 이름의 펀딩 내역이 없습니다.`);
    process.exit(1);
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log(`✅ "${name}" 펀딩 내역 ${snapshot.size}건 삭제 완료`);
  process.exit(0);
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
