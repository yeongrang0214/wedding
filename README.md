# 영냥 × 상뭉의 웨딩 아카이브

결혼 예산·지출과 할 일을 함께 관리하는 Next.js 웹사이트입니다. Vercel 배포와 Neon Postgres 영구 저장을 기준으로 구성되어 있습니다.

## 로컬 실행

1. Node.js 22 이상을 설치합니다.
2. `.env.example`을 복사해 `.env.local`을 만듭니다.
3. Neon에서 발급한 `DATABASE_URL`을 입력합니다.
4. 아래 명령을 실행합니다.

```bash
npm install
npm run dev
```

프로덕션 빌드 확인:

```bash
npm test
```

## GitHub에 올릴 파일

프로젝트 루트에서 Git 저장소를 만들어 전체 소스를 올리면 `.gitignore`가 불필요한 파일을 자동으로 제외합니다.

포함되는 주요 파일:

- `app/`
- `public/`
- `db/`
- `drizzle/`
- `.env.example`
- `.gitignore`
- `package.json`, `package-lock.json`
- `next.config.ts`, `tsconfig.json`
- `drizzle.config.ts`
- `postcss.config.mjs`, `eslint.config.mjs`
- `tests/`

절대 올리지 않는 파일:

- `.env`, `.env.local` 등 실제 환경 변수
- `node_modules/`
- `.next/`, `dist/`
- `.vercel/`

## Vercel 배포

1. 기존 사이트에서 `백업`을 눌러 현재 데이터를 JSON 파일로 저장합니다.
2. 이 프로젝트를 GitHub 저장소의 `main` 브랜치에 올립니다.
3. Vercel에서 **New Project**를 누르고 GitHub 저장소를 가져옵니다.
4. Framework Preset은 **Next.js**, Root Directory는 저장소 루트로 둡니다.
5. Vercel Marketplace에서 **Neon Postgres**를 프로젝트에 연결합니다.
6. 프로젝트의 Environment Variables에 `DATABASE_URL`이 등록됐는지 확인합니다.
7. `SITE_PASSWORD`에 홈페이지에서 함께 사용할 비밀번호를 등록합니다.
8. 배포하거나, 환경 변수를 나중에 연결했다면 한 번 Redeploy 합니다.
9. 새 사이트에서 `불러오기`로 1번의 JSON 백업을 선택한 뒤 `예산·지출 저장` 또는 `할 일 저장`을 누릅니다.

데이터베이스 테이블은 첫 저장 요청에서 자동으로 준비됩니다. `drizzle/`의 SQL은 스키마 이력을 위한 파일입니다.

## 휴대폰 앱으로 설치

- iPhone·iPad: Safari에서 사이트를 연 뒤 공유 버튼 → **홈 화면에 추가**를 누릅니다.
- Android: Chrome에서 사이트를 열고 표시되는 **앱 설치** 버튼을 누릅니다.

설치된 앱은 기존 사이트와 동일한 비밀번호 및 Neon 데이터를 사용합니다. 서비스 워커는 앱 아이콘과 정적 디자인 파일만 캐시하며 예산·지출·할 일 데이터와 API 응답은 오프라인 저장하지 않습니다.

## 개인정보 보호

홈페이지 전체는 Vercel의 `SITE_PASSWORD` 환경 변수와 암호화된 HTTP 전용 쿠키로 보호됩니다. 실제 `SITE_PASSWORD`와 `DATABASE_URL`은 GitHub에 커밋하지 말고 Vercel 환경 변수에만 저장하세요. 공용 기기에서는 상단의 `잠금` 버튼을 눌러 세션을 종료하세요.
