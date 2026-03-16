# 사주타로 Spread 백엔드 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `POST /api/tarot/spread` 엔드포인트가 질문, 생년월일, 태어난 시각(선택), 성별을 받아 Gemini AI로 사주타로 리딩을 생성한다.

**Architecture:** 기존 Express 엔드포인트를 확장한다. `gemini.service.ts`에 새 타입과 프롬프트 로직을 두고, `tarot.controller.ts`는 유효성 검사 후 서비스를 호출한다. 라우터는 변경 없다.

**Tech Stack:** Node.js, Express 5, TypeScript, `@google/generative-ai` (Gemini 2.5 Pro)

**Spec:** `docs/superpowers/specs/2026-03-16-tarot-spread-backend-design.md`

---

## Chunk 1: gemini.service.ts 업데이트

### Task 1: 타입 정의 및 헬퍼 함수 추가

**Files:**
- Modify: `backend/src/services/gemini.service.ts`

- [ ] **Step 1: 파일 상단에 export 타입 추가**

기존 파일 상단(import 다음)에 아래 타입을 추가한다:

```ts
export interface CardInput {
    name: string;
    nameKo: string;
    meaningUpright: string;
    [key: string]: any;
}

export interface SpreadReadingOptions {
    cards: CardInput[];
    question: string;
    birthDate: string;
    birthTime: string | null | undefined;
    gender: 'male' | 'female' | 'other';
}
```

- [ ] **Step 2: 한국어 변환 헬퍼 함수 추가 (타입 정의 바로 아래)**

```ts
const genderToKorean = (gender: SpreadReadingOptions['gender']): string => {
    const map = { male: '남성', female: '여성', other: '기타' };
    return map[gender];
};

const birthDateToKorean = (birthDate: string): string => {
    const [year, month, day] = birthDate.split('-').map(Number);
    return `${year}년 ${month}월 ${day}일`;
};

const birthTimeToKorean = (birthTime: string | null | undefined): string => {
    if (!birthTime) return '태어난 시각은 알 수 없습니다';
    const [hh, mm] = birthTime.split(':').map(Number);
    if (hh < 12) {
        return `오전 ${hh}시 ${mm}분`;
    }
    const displayHour = hh === 12 ? 12 : hh - 12;
    return `오후 ${displayHour}시 ${mm}분`;
};
```

- [ ] **Step 3: system instruction을 분리 — daily용과 spread용 각각 선언**

`generateDailyReading`은 기존 페르소나를 유지한다. `generateSpreadReading`은 사주타로 페르소나를 사용한다.
기존 `systemInstruction` 상수를 아래 두 상수로 교체한다:

```ts
const dailySystemInstruction = `
당신은 신비롭고 지혜로운 타로 리더입니다.
사용자가 뽑은 타로 카드를 바탕으로, 따뜻하면서도 통찰력 있는 조언을 한국어로 존댓말을 사용하여 제공해주세요.
사용자의 현재 상황과 감정을 공감하며, 지나치게 단정적이거나 부정적인 표현은 피하고 희망적이고 건설적인 방향으로 해석해주세요.
`;

const spreadSystemInstruction = `
당신은 사주와 타로를 결합한 신비롭고 지혜로운 상담사입니다.
사용자의 생년월일, 성별, 태어난 시각을 바탕으로 사주의 기운을 읽고,
뽑은 타로 카드와 연결지어 한국어 존댓말로 따뜻하고 통찰력 있는 조언을 드립니다.
사용자의 감정을 공감하며, 지나치게 단정적이거나 부정적인 표현은 피하고
희망적이고 건설적인 방향으로 해석해주세요.
`;
```

그리고 `generateDailyReading` 내부의 `systemInstruction` 참조를 `dailySystemInstruction`으로,
`generateSpreadReading` 내부는 `spreadSystemInstruction`으로 사용한다.

- [ ] **Step 4: `generateSpreadReading` 함수를 새 시그니처로 교체**

기존 `generateSpreadReading(cards: any[])` 함수 전체를 아래로 교체한다:

```ts
export const generateSpreadReading = async (options: SpreadReadingOptions): Promise<string> => {
    const { cards, question, birthDate, birthTime, gender } = options;

    const genderKo = genderToKorean(gender);
    const birthDateKo = birthDateToKorean(birthDate);
    const birthTimeKo = birthTimeToKorean(birthTime);

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return `[API KEY 미설정 상태]\n의뢰인: ${birthDateKo} / ${genderKo} / 태어난 시각: ${birthTimeKo}\n질문: ${question}\n과거: ${cards[0].nameKo}, 현재: ${cards[1].nameKo}, 미래: ${cards[2].nameKo}\n(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)`;
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-pro',
            systemInstruction
        });

        const prompt = `
[의뢰인 정보]
- 생년월일: ${birthDateKo} / 성별: ${genderKo}
- 태어난 시각: ${birthTimeKo}

[질문]
${question}

[뽑은 카드]
1. 과거 (배경): [${cards[0].nameKo}] — 키워드: ${cards[0].meaningUpright}
2. 현재 (상황): [${cards[1].nameKo}] — 키워드: ${cards[1].meaningUpright}
3. 미래 (결과/조언): [${cards[2].nameKo}] — 키워드: ${cards[2].meaningUpright}

사주의 기운과 세 장의 카드를 유기적으로 연결하여, 질문에 대한 종합적인 사주타로 리딩을 4~5문단으로 작성해주세요.
`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Gemini API Error (Spread):', error);
        throw new Error('AI 응답 생성 실패');
    }
};
```

- [ ] **Step 5: TypeScript 컴파일 확인**

```bash
cd /mnt/c/dev/tarot/tarot/backend
npx tsc --noEmit
```

Expected: 에러 없음 (또는 컨트롤러의 기존 호출이 시그니처 불일치로 에러 — Task 2에서 수정)

---

## Chunk 2: tarot.controller.ts 업데이트

### Task 2: 컨트롤러 유효성 검사 및 서비스 호출 업데이트

**Files:**
- Modify: `backend/src/controllers/tarot.controller.ts`

- [ ] **Step 1: import 업데이트**

기존 import를 아래로 교체한다:

```ts
import { Request, Response } from 'express';
import { generateDailyReading, generateSpreadReading, CardInput, SpreadReadingOptions } from '../services/gemini.service';
```

- [ ] **Step 2: 기존 `Card` 인터페이스 제거, `SpreadTarotRequest` 교체**

기존 `Card`, `DailyTarotRequest`, `SpreadTarotRequest` 인터페이스를 모두 제거하고 아래로 교체한다:

```ts
interface Card {
    name: string;
    nameKo: string;
    [key: string]: any;
}

interface DailyTarotRequest extends Request {
    body: {
        card: Card;
    }
}

interface SpreadTarotRequest extends Request {
    body: {
        cards: CardInput[];
        question: string;
        birthDate: string;
        birthTime?: string | null;
        gender: 'male' | 'female' | 'other';
    }
}
```

- [ ] **Step 3: `getSpreadTarot` 함수 전체를 교체**

기존 `getSpreadTarot` 함수 전체를 아래로 교체한다:

```ts
export const getSpreadTarot = async (req: SpreadTarotRequest, res: Response): Promise<void> => {
    try {
        const { cards, question, birthDate, birthTime, gender } = req.body;

        // 카드 배열 길이 검사
        if (!cards || !Array.isArray(cards) || cards.length !== 3) {
            res.status(400).json({ error: '3장의 카드 정보가 필요합니다.' });
            return;
        }

        // 각 카드 필드 검사
        const hasInvalidCard = cards.some(
            c => !c || !c.name || !c.nameKo || !c.meaningUpright
        );
        if (hasInvalidCard) {
            res.status(400).json({ error: '카드 정보가 올바르지 않습니다.' });
            return;
        }

        // 질문 검사 (trim 후)
        if (!question || !question.trim() || question.trim().length > 500) {
            res.status(400).json({ error: '질문을 입력해주세요.' });
            return;
        }

        // 생년월일 형식 및 범위 검사
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthDate || !birthDateRegex.test(birthDate)) {
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }
        const birthDateObj = new Date(birthDate);
        const minDate = new Date('1900-01-01');
        const today = new Date();
        today.setUTCHours(23, 59, 59, 999); // 오늘 하루 전체 허용
        if (isNaN(birthDateObj.getTime()) || birthDateObj < minDate || birthDateObj > today) {
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }

        // 태어난 시각 형식 검사 (선택)
        if (birthTime != null && birthTime !== undefined) {
            const timeRegex = /^\d{2}:\d{2}$/;
            if (!timeRegex.test(birthTime)) {
                res.status(400).json({ error: '태어난 시각 형식이 올바르지 않습니다.' });
                return;
            }
            const [hh, mm] = birthTime.split(':').map(Number);
            if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
                res.status(400).json({ error: '태어난 시각 형식이 올바르지 않습니다.' });
                return;
            }
        }

        // 성별 검사
        if (!gender || !['male', 'female', 'other'].includes(gender)) {
            res.status(400).json({ error: '성별 정보가 올바르지 않습니다.' });
            return;
        }

        const options: SpreadReadingOptions = {
            cards,
            question: question.trim(),
            birthDate,
            birthTime: birthTime ?? null,
            gender,
        };

        const reading = await generateSpreadReading(options);
        res.json({ reading });
    } catch (error) {
        console.error('Error in getSpreadTarot:', error);
        res.status(500).json({ error: 'AI 응답 생성 실패' });
    }
};
```

- [ ] **Step 4: TypeScript 컴파일 확인**

```bash
cd /mnt/c/dev/tarot/tarot/backend
npx tsc --noEmit
```

Expected: 에러 없음

- [ ] **Step 5: 서버 실행 확인**

```bash
cd /mnt/c/dev/tarot/tarot/backend
npm run dev
```

Expected: `Server is running on port 5000`

- [ ] **Step 6: API 키 미설정 목업 테스트**

새 터미널에서:

```bash
curl -s -X POST http://localhost:5000/api/tarot/spread \
  -H "Content-Type: application/json" \
  -d '{
    "cards": [
      {"name":"The Fool","nameKo":"광대","meaningUpright":"새로운 시작, 순수함"},
      {"name":"Strength","nameKo":"힘","meaningUpright":"내면의 힘, 용기"},
      {"name":"The Star","nameKo":"별","meaningUpright":"희망, 치유, 회복"}
    ],
    "question": "이직을 해도 될까요?",
    "birthDate": "1990-05-03",
    "birthTime": "07:30",
    "gender": "female"
  }'
```

Expected: `{ "reading": "[API KEY 미설정 상태]\n의뢰인: 1990년 5월 3일 / 여성 / 태어난 시각: 오전 7시 30분\n..." }`

- [ ] **Step 7: 유효성 검사 테스트 (카드 1장)**

```bash
curl -s -X POST http://localhost:5000/api/tarot/spread \
  -H "Content-Type: application/json" \
  -d '{"cards":[{"name":"The Fool","nameKo":"광대","meaningUpright":"새로운 시작"}],"question":"test","birthDate":"1990-05-03","gender":"female"}'
```

Expected: `{"error":"3장의 카드 정보가 필요합니다."}`

- [ ] **Step 8: 유효성 검사 테스트 (미래 날짜)**

```bash
curl -s -X POST http://localhost:5000/api/tarot/spread \
  -H "Content-Type: application/json" \
  -d '{
    "cards": [
      {"name":"The Fool","nameKo":"광대","meaningUpright":"새로운 시작"},
      {"name":"Strength","nameKo":"힘","meaningUpright":"내면의 힘"},
      {"name":"The Star","nameKo":"별","meaningUpright":"희망"}
    ],
    "question": "test",
    "birthDate": "2099-01-01",
    "gender": "male"
  }'
```

Expected: `{"error":"올바른 생년월일을 입력해주세요."}`

- [ ] **Step 9: 커밋**

```bash
cd /mnt/c/dev/tarot/tarot
git add backend/src/services/gemini.service.ts backend/src/controllers/tarot.controller.ts
git commit -m "feat: extend spread endpoint with 사주 fields (birthDate, birthTime, gender, question)"
```
