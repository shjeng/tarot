# 사주타로 백엔드 설계 스펙

**날짜:** 2026-03-16
**범위:** 백엔드만 (프론트엔드 수정 제외)

---

## 개요

3장의 타로 카드 + 사용자 질문 + 생년월일 + 태어난 시각(선택) + 성별을 받아 Gemini AI로 사주타로 리딩을 생성하는 백엔드 API를 완성한다.

---

## 변경 범위

기존 `POST /api/tarot/spread` 엔드포인트를 확장한다. 새 엔드포인트는 추가하지 않는다.

`generateSpreadReading` 함수의 시그니처를 변경한다. 기존 호출 위치는 `tarot.controller.ts` 단 한 곳이며, 해당 파일도 함께 수정한다. 다른 호출 위치 없음.

---

## 타입 정의

`CardInput` 인터페이스는 **`gemini.service.ts`에서 정의하고 export**한다.
`tarot.controller.ts`에서 import하여 사용한다. 두 파일 모두에 중복 정의하지 않는다.
기존 컨트롤러의 `Card` 인터페이스는 `CardInput`으로 교체된다.

```ts
// gemini.service.ts 에서 export
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
  gender: "male" | "female" | "other";
}
```

---

## API 인터페이스

### Request

```
POST /api/tarot/spread
Content-Type: application/json
```

```ts
{
  cards: CardInput[],        // 3장, 순서: [과거, 현재, 미래]
  question: string,          // 사용자 질문 (필수, trim 후 최대 500자)
  birthDate: string,         // "YYYY-MM-DD" (필수)
  birthTime: string | null,  // "HH:MM" 24시간제, 반드시 2자리 패딩 (예: "07:30"), 또는 null/undefined
  gender: "male" | "female" | "other"  // 필수
}
```

### Response (성공)

```ts
{ reading: string }
```

### Response (실패)

```ts
{ error: string }
```

---

## 유효성 검사

검사 순서: cards 배열 길이 → 각 카드 필드 → question → birthDate → birthTime → gender

| 필드 | 조건 | 400 에러 메시지 |
|------|------|----------------|
| `cards` 길이 | 정확히 3개 | `"3장의 카드 정보가 필요합니다."` |
| 각 카드 필드 | `name`·`nameKo`·`meaningUpright` 모두 존재 | `"카드 정보가 올바르지 않습니다."` |
| `question` | `.trim()` 후 1자 이상, 500자 이하 | `"질문을 입력해주세요."` |
| `birthDate` | `YYYY-MM-DD` 형식, 1900-01-01 이상, 서버 UTC 기준 오늘 이하(미래 날짜 거부) | `"올바른 생년월일을 입력해주세요."` |
| `birthTime` | null/undefined이거나 `^\d{2}:\d{2}$` 형식 (HH: 00~23, MM: 00~59) | `"태어난 시각 형식이 올바르지 않습니다."` |
| `gender` | `"male"` \| `"female"` \| `"other"` 중 하나 | `"성별 정보가 올바르지 않습니다."` |

---

## 데이터 변환 (프롬프트 및 목업 공통 적용)

아래 변환 로직은 Gemini 프롬프트 생성과 목업 응답 양쪽 모두에 동일하게 적용한다.

### gender → 한국어
| 입력값 | 표시 |
|--------|------|
| `"male"` | `"남성"` |
| `"female"` | `"여성"` |
| `"other"` | `"기타"` |

### birthDate → 한국어
`"1990-05-03"` → `"1990년 5월 3일"` (월, 일 앞의 0 제거)

### birthTime → 한국어 (24시간제 → 오전/오후)
- null/undefined: `"태어난 시각은 알 수 없습니다"`
- HH < 12: 오전, 표시 HH 그대로 (예: `"07:30"` → `"오전 7시 30분"`)
- HH >= 12: 오후, HH = 12이면 12 그대로, HH > 12이면 HH - 12 (예: `"14:30"` → `"오후 2시 30분"`)
- 자정 `"00:00"` → `"오전 0시 0분"` (의도된 동작)
- 정오 `"12:00"` → `"오후 12시 0분"`

---

## Gemini 모델

기존 코드와 동일하게 `gemini-2.5-pro` 사용.

---

## Gemini 프롬프트 설계

### System Instruction (기존 교체)

```
당신은 사주와 타로를 결합한 신비롭고 지혜로운 상담사입니다.
사용자의 생년월일, 성별, 태어난 시각을 바탕으로 사주의 기운을 읽고,
뽑은 타로 카드와 연결지어 한국어 존댓말로 따뜻하고 통찰력 있는 조언을 드립니다.
사용자의 감정을 공감하며, 지나치게 단정적이거나 부정적인 표현은 피하고
희망적이고 건설적인 방향으로 해석해주세요.
```

### User Prompt 구성 (예시)

```
[의뢰인 정보]
- 생년월일: 1990년 5월 3일 / 성별: 여성
- 태어난 시각: 오전 7시 30분

[질문]
이직을 해도 될까요?

[뽑은 카드]
1. 과거 (배경): [광대] — 키워드: 새로운 시작, 순수함
2. 현재 (상황): [힘] — 키워드: 내면의 힘, 용기
3. 미래 (결과/조언): [별] — 키워드: 희망, 치유, 회복

사주의 기운과 세 장의 카드를 유기적으로 연결하여, 질문에 대한 종합적인 사주타로 리딩을 4~5문단으로 작성해주세요.
```

---

## API 키 미설정 시 목업 응답

위의 데이터 변환(gender/birthDate/birthTime → 한국어)을 동일하게 적용하여 반환한다:

```
[API KEY 미설정 상태]
의뢰인: {birthDate한국어} / {gender한국어} / 태어난 시각: {birthTime한국어}
질문: {question}
과거: {cards[0].nameKo}, 현재: {cards[1].nameKo}, 미래: {cards[2].nameKo}
(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)
```

---

## 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `backend/src/services/gemini.service.ts` | `CardInput`·`SpreadReadingOptions` export, `generateSpreadReading` 시그니처·프롬프트·목업 업데이트, system instruction 교체 |
| `backend/src/controllers/tarot.controller.ts` | `CardInput` import, 기존 `Card` 인터페이스 제거, `SpreadTarotRequest` 확장, 유효성 검사 추가, 서비스 호출 업데이트, catch 에러 메시지를 `"AI 응답 생성 실패"`로 변경 |
| `backend/src/routes/tarot.routes.ts` | 변경 없음 |

---

## 에러 처리

| 상황 | HTTP 상태 | 응답 |
|------|-----------|------|
| 유효성 검사 실패 | `400` | `{ error: "에러 메시지" }` |
| Gemini API 오류 | `500` | `{ error: "AI 응답 생성 실패" }` |
| API 키 미설정 | `200` | 목업 응답 텍스트 반환 |
