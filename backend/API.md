# Tarot Backend API 문서

## 기본 정보

- **Base URL**: `http://localhost:5000`
- **Content-Type**: `application/json`
- **CORS**: `http://localhost:3000` (환경변수 `FRONTEND_URL`로 변경 가능)

---

## 환경 변수

| 변수명 | 설명 | 기본값 |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API 키 | - |
| `PORT` | 서버 포트 | `5000` |
| `FRONTEND_URL` | 허용할 프론트엔드 URL | `http://localhost:3000` |

---

## 공통 응답 형식

### 성공
```json
{
  "reading": "AI가 생성한 타로 리딩 텍스트"
}
```

### 실패
```json
{
  "error": "오류 메시지"
}
```

---

## 엔드포인트

### 1. 헬스 체크

서버 상태를 확인합니다.

- **URL**: `GET /api/health`
- **인증**: 불필요

#### 응답 예시
```json
{
  "status": "ok",
  "timestamp": "2026-03-18T00:00:00.000Z"
}
```

---

### 2. 오늘의 운세 (1장 뽑기)

타로 카드 1장을 기반으로 오늘의 운세를 AI가 해석합니다.

- **URL**: `POST /api/tarot/daily`
- **Content-Type**: `application/json`

#### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `card` | object | 필수 | 뽑은 타로 카드 정보 |
| `card.name` | string | 필수 | 카드 영문 이름 |
| `card.nameKo` | string | 필수 | 카드 한국어 이름 |
| `card.meaningUpright` | string | 선택 | 카드 정방향 키워드 |
| `card.desc` | string | 선택 | 카드 기본 설명 |

#### 요청 예시
```json
{
  "card": {
    "name": "The Sun",
    "nameKo": "태양",
    "meaningUpright": "성공, 활력, 긍정, 자신감",
    "desc": "밝은 에너지와 성공을 상징하는 카드"
  }
}
```

#### 응답 예시 (200 OK)
```json
{
  "reading": "오늘 태양 카드를 뽑으셨군요. 이 카드는 밝고 긍정적인 에너지를 상징합니다..."
}
```

#### 오류 응답

| 상태 코드 | 메시지 | 설명 |
|---|---|---|
| `400` | `카드 정보가 올바르지 않습니다.` | `card`, `card.name`, `card.nameKo` 누락 |
| `500` | `AI 응답 생성 실패` | Gemini API 오류 |

---

### 3. 3장 스프레드 (사주타로 리딩)

사용자 정보(생년월일, 성별, 태어난 시각)와 타로 카드 3장을 기반으로 과거-현재-미래 종합 리딩을 제공합니다.

- **URL**: `POST /api/tarot/spread`
- **Content-Type**: `application/json`

#### Request Body

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `cards` | array | 필수 | 타로 카드 3장 배열 |
| `cards[].name` | string | 필수 | 카드 영문 이름 |
| `cards[].nameKo` | string | 필수 | 카드 한국어 이름 |
| `cards[].meaningUpright` | string | 필수 | 카드 정방향 키워드 |
| `question` | string | 필수 | 사용자 질문 (최대 500자) |
| `birthDate` | string | 필수 | 생년월일 (`YYYY-MM-DD` 형식, 1900-01-01 이후) |
| `birthTime` | string \| null | 선택 | 태어난 시각 (`HH:MM` 형식, 24시간제) |
| `gender` | string | 필수 | 성별 (`male` / `female` / `other`) |

> **카드 순서**: `cards[0]` = 과거, `cards[1]` = 현재, `cards[2]` = 미래

#### 요청 예시
```json
{
  "cards": [
    {
      "name": "The Fool",
      "nameKo": "바보",
      "meaningUpright": "새로운 시작, 모험, 순수함"
    },
    {
      "name": "The Star",
      "nameKo": "별",
      "meaningUpright": "희망, 치유, 영감, 평온"
    },
    {
      "name": "The Sun",
      "nameKo": "태양",
      "meaningUpright": "성공, 활력, 긍정, 자신감"
    }
  ],
  "question": "올해 제 커리어는 어떻게 될까요?",
  "birthDate": "1995-06-15",
  "birthTime": "14:30",
  "gender": "female"
}
```

#### 응답 예시 (200 OK)
```json
{
  "reading": "의뢰인께서는 1995년 6월 15일 오후 2시 30분에 태어나신 여성이시군요..."
}
```

#### 오류 응답

| 상태 코드 | 메시지 | 설명 |
|---|---|---|
| `400` | `3장의 카드 정보가 필요합니다.` | `cards`가 배열이 아니거나 3장이 아닌 경우 |
| `400` | `카드 정보가 올바르지 않습니다.` | 카드 필수 필드 누락 |
| `400` | `질문을 입력해주세요.` | `question` 누락 또는 공백 |
| `400` | `질문은 500자 이내로 입력해주세요.` | `question` 500자 초과 |
| `400` | `올바른 생년월일을 입력해주세요.` | `birthDate` 형식 오류 또는 범위 초과 |
| `400` | `태어난 시각 형식이 올바르지 않습니다.` | `birthTime` 형식 오류 |
| `400` | `성별 정보가 올바르지 않습니다.` | `gender`가 허용값 외인 경우 |
| `500` | `AI 응답 생성 실패` | Gemini API 오류 |

---

## AI 모델

- **모델**: Google Gemini 2.5 Pro (`gemini-2.5-pro`)
- **Daily**: 타로 리더 페르소나로 오늘의 운세 3~4문단 생성
- **Spread**: 사주+타로 결합 상담사 페르소나로 종합 리딩 4~5문단 생성

> `GEMINI_API_KEY`가 설정되지 않은 경우 AI 응답 대신 안내 메시지가 반환됩니다.
