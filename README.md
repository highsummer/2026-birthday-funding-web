# Birthday Funding

Bambu Lab A1 Combo 생일 펀딩 페이지.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: AWS Lambda (SST) + Firebase Firestore
- **Infra**: SST v4 (API Gateway, Lambda, S3, CloudFront, ACM, Route 53)
- **CI/CD**: GitHub Actions → `sst deploy`

## Project Structure

```
src/                  # React frontend
packages/functions/   # Lambda handlers (Firebase Admin SDK)
scripts/              # Admin CLI (add-funding, delete-funding)
sst.config.ts         # SST infra config
```

## Local Development

```bash
cp .env.example .env  # VITE_API_URL 설정
npm install
npm run dev
```

Backend (Lambda) 로컬 실행:

```bash
npx sst dev
```

## Deployment

```bash
npx sst deploy --stage production
```

GitHub Actions: `main` push 시 자동 배포.

## SST Secrets

```bash
npx sst secret set FirebaseServiceAccount "$(cat service-account-key.json)" --stage production
```

## Admin Scripts

```bash
npx tsx scripts/add-funding.ts <name> <amount> [depositedAt]
npx tsx scripts/delete-funding.ts <name>
```
