/**
 * 펀딩 내역 수동 등록 스크립트 (Firebase Admin SDK 사용)
 *
 * 사전 준비:
 *   firebase login 이 되어있어야 합니다 (ADC 인증 사용).
 *   또는 GOOGLE_APPLICATION_CREDENTIALS 환경변수로 서비스 계정 키를 지정.
 *
 * 사용법:
 *   npx tsx scripts/add-funding.ts <성명> <금액> [입금일시]
 *
 * 예시:
 *   npx tsx scripts/add-funding.ts 김롱간 50000
 *   npx tsx scripts/add-funding.ts 김롱간 50000 "2026-03-09 14:30"
 */

import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ID = "birthday-funding-1be4b";

// 서비스 계정 키 파일이 있으면 사용, 없으면 ADC (firebase login 기반)
const serviceAccountPath = resolve(__dirname, "../service-account-key.json");

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID });
} else {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}

const db = getFirestore();

async function main() {
  const [, , name, amountStr, depositedAtStr] = process.argv;

  if (!name || !amountStr) {
    console.error("사용법: npx tsx scripts/add-funding.ts <성명> <금액> [입금일시]");
    console.error("예시:   npx tsx scripts/add-funding.ts 김롱간 50000");
    console.error('        npx tsx scripts/add-funding.ts 김롱간 50000 "2026-03-09 14:30"');
    process.exit(1);
  }

  const amount = parseInt(amountStr, 10);
  if (isNaN(amount) || amount <= 0) {
    console.error("금액은 양의 정수여야 합니다.");
    process.exit(1);
  }

  let depositedAt: Timestamp;
  if (depositedAtStr) {
    const parsed = new Date(depositedAtStr);
    if (isNaN(parsed.getTime())) {
      console.error("입금일시 형식이 올바르지 않습니다. (예: 2026-03-09 14:30)");
      process.exit(1);
    }
    depositedAt = Timestamp.fromDate(parsed);
  } else {
    depositedAt = Timestamp.now();
  }

  const snapshot = await db
    .collection("funding")
    .where("name", "==", name.trim())
    .get();

  let docId: string;
  if (snapshot.empty) {
    const docRef = await db.collection("funding").add({
      name: name.trim(),
      amount,
      depositedAt,
      createdAt: Timestamp.now(),
    });
    docId = docRef.id;
    console.log(`✅ 펀딩 등록 완료: ${name} / ${amount.toLocaleString()}원 / 입금일시: ${depositedAt.toDate().toLocaleString("ko-KR")} (ID: ${docId})`);
  } else {
    const existingDoc = snapshot.docs[0];
    await existingDoc.ref.update({ amount, depositedAt });
    docId = existingDoc.id;
    console.log(`✅ 펀딩 업데이트 완료: ${name} / ${amount.toLocaleString()}원 / 입금일시: ${depositedAt.toDate().toLocaleString("ko-KR")} (ID: ${docId})`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
