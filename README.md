# AI 타로 상담 서비스

Google Gemini AI를 활용한 타로 카드 운세 서비스입니다. 사용자의 생년월일, 고민과 함께 타로 카드를 뽑으면 AI가 사주와 타로를 결합한 맞춤형 운세를 제공합니다.

## 주요 기능

### 오늘의 운세
- 카드 1장을 뽑아 오늘의 간단한 운세를 확인

### AI 타로 상담
- 생년월일, 성별, 고민을 입력
- 과거 / 현재 / 미래를 나타내는 카드 3장 선택
- Google Gemini AI가 사주와 타로를 결합해 심층 분석 제공

## 기술 스택

### Frontend
| 기술 | 버전 |
|------|------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Framer Motion | 12 |

### Backend
| 기술 | 버전 |
|------|------|
| Node.js + Express | 5.2.1 |
| TypeScript | 5.9.3 |
| Google Gemini API | 2.5 Flash |

## 프로젝트 구조

```
tarot/
├── frontend/          # Next.js 앱
│   ├── app/
│   │   ├── page.tsx        # 메인 홈
│   │   ├── daily/          # 오늘의 운세
│   │   └── reading/        # AI 타로 상담
│   ├── components/
│   │   └── tarot/          # 카드 컴포넌트 (3D 플립 애니메이션)
│   └── data/
│       └── tarotCards.ts   # 메이저 아르카나 22장 데이터
│
└── backend/           # Express API 서버
    └── src/
        ├── routes/         # API 라우트
        ├── controllers/    # 요청 핸들러
        └── services/       # Gemini AI 연동
```

## 시작하기

### 환경 변수 설정

**backend/.env**
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### 백엔드 실행

```bash
cd backend
npm install
npm run dev
```

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| POST | `/api/tarot/daily` | 오늘의 운세 생성 |
| POST | `/api/tarot/spread` | 3장 스프레드 AI 상담 |

자세한 API 명세는 `backend/API.md` 참고

## 디자인 컨셉

- 다크 모드 기반의 신비로운 분위기
- 보라색 + 금색 포인트 컬러
- 모바일 퍼스트 반응형 디자인
