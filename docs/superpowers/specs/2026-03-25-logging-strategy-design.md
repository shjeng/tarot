# 백엔드 로그 전략 설계

**작성일:** 2026-03-25
**대상:** `tarot/backend`
**환경:** 단일 서버/VPS

---

## 1. 목표

| 요구사항 | 내용 |
|---------|------|
| 로그 파일 보관 | 날짜별 파일 분리, gzip 압축, 6개월 후 자동 삭제 |
| 에러 알림 | 이메일 (즉시), Slack (추후 추가) |
| 요청 추적 | IP, 엔드포인트, 응답시간, HTTP 상태코드 |
| Gemini API 추적 | 호출 시간, 입력 길이, 응답 길이, 토큰 수 |
| 회원 정보 추적 | userId (회원 기능 추가 시 채워짐, 현재는 null) |

---

## 2. 기술 스택

| 역할 | 패키지 |
|------|--------|
| 로거 코어 | `winston` |
| 파일 로테이션 | `winston-daily-rotate-file` |
| 이메일 알림 | `nodemailer` (커스텀 winston transport) |
| 요청 컨텍스트 전파 | `AsyncLocalStorage` (Node.js 내장, Spring MDC 대응) + `uuid` (requestId 생성) |
| Slack 알림 (예정) | `winston-slack-webhook-transport` |

---

## 3. 아키텍처

```
HTTP 요청
    ↓
[Request Logger Middleware]
    └─ AsyncLocalStorage.run({ requestId, ip, method, endpoint, userId })
         ↓
    [Controller]
         ↓
    [Gemini Service]        ← AsyncLocalStorage.getStore()로 context 자동 접근
         ↓
    [Logger (winston)]      ← 모든 레이어에서 context 자동 포함
         ├── Console Transport       (개발환경 전용)
         ├── Daily Rotate Transport  (logs/YYYY-MM-DD.log → gzip → 6개월 후 삭제)
         └── Mail Transport          (ERROR 레벨 이상 → 이메일 발송)
```

**전역 예외 처리:** `server.ts` 시작 시점에 아래를 등록해 프로세스 비정상 종료 전 반드시 로그를 남긴다.

```typescript
process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', { error: { message: err.message, stack: err.stack } });
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logger.error('unhandledRejection', { error: { message: err.message, stack: err.stack } });
});
```

---

## 4. 로그 레벨 정책

| 레벨 | 용도 | 알림 |
|------|------|------|
| `error` | Gemini API 실패, 처리되지 않은 예외, 500 응답 | 이메일 발송 |
| `warn` | 유효성 검사 실패, 400 응답 | 없음 |
| `info` | 요청/응답 요약, Gemini 호출 성공 | 없음 |
| `debug` | 개발 시 상세 내용 | 없음 (프로덕션 비활성화) |

---

## 5. 로그 포맷 (JSON)

모든 로그는 JSON 구조로 저장한다.

### 5-1. 일반 요청 로그 (info)
```json
{
  "timestamp": "2026-03-25T10:00:00.000Z",
  "level": "info",
  "message": "request completed",
  "requestId": "a1b2c3d4-...",
  "ip": "123.45.67.89",
  "userId": null,
  "method": "POST",
  "endpoint": "/api/tarot/spread",
  "statusCode": 200,
  "durationMs": 1823
}
```

### 5-2. 유효성 검사 실패 로그 (warn)
```json
{
  "timestamp": "2026-03-25T10:00:00.000Z",
  "level": "warn",
  "message": "validation failed",
  "requestId": "a1b2c3d4-...",
  "ip": "123.45.67.89",
  "userId": null,
  "method": "POST",
  "endpoint": "/api/tarot/spread",
  "statusCode": 400,
  "reason": "올바른 생년월일을 입력해주세요."
}
```

### 5-3. Gemini API 호출 로그 (info)

`ip`, `method`, `endpoint`, `requestId`는 `AsyncLocalStorage`에서 자동으로 읽어온다. 함수 인자로 전달하지 않는다.

```json
{
  "timestamp": "2026-03-25T10:00:00.000Z",
  "level": "info",
  "message": "gemini api call completed",
  "requestId": "a1b2c3d4-...",
  "ip": "123.45.67.89",
  "userId": null,
  "method": "POST",
  "endpoint": "/api/tarot/spread",
  "gemini": {
    "model": "gemini-2.5-flash-lite",
    "type": "spread",
    "promptLength": 412,
    "responseLength": 980,
    "promptTokens": 128,
    "candidateTokens": 310,
    "durationMs": 1750
  }
}
```

### 5-4. 에러 로그 (error)
```json
{
  "timestamp": "2026-03-25T10:00:00.000Z",
  "level": "error",
  "message": "gemini api call failed",
  "requestId": "a1b2c3d4-...",
  "ip": "123.45.67.89",
  "userId": null,
  "method": "POST",
  "endpoint": "/api/tarot/spread",
  "error": {
    "message": "Request failed with status code 429",
    "stack": "Error: Request failed...\n    at ..."
  }
}
```

> `userId`는 회원 기능 추가 시 자동으로 채워지도록 필드를 미리 확보한다.

---

## 6. 파일 로테이션 정책

```
logs/
├── 2026-03-25.log       ← 당일 로그 (plain JSON)
├── 2026-03-24.log.gz    ← 전날부터 gzip 압축
├── 2026-03-23.log.gz
└── ...                  ← 180일(6개월) 이후 자동 삭제
```

- 매일 자정 새 파일 생성
- 이전 파일 즉시 gzip 압축 (`zippedArchive: true`)
- 보관 기간: `maxFiles: '180d'`
- 단일 파일 최대 크기: `maxSize: '50m'` (VPS 디스크 보호)
- `logs/` 디렉토리는 logger 모듈 초기화 시 `fs.mkdirSync(logDir, { recursive: true })`로 자동 생성
- `logs/` 디렉토리는 `.gitignore`에 추가

---

## 7. 이메일 알림

- **트리거:** `error` 레벨 로그 발생 시 즉시 발송
- **중복 방지 (in-process):** `Map<string, number>` 에 `{endpoint}:{error.message}` 키로 마지막 발송 시각을 저장. 5분 이내 동일 키 재발생 시 발송 건너뜀.
  - 키 정의: `endpoint + ':' + error.message` (상세 stack은 제외)
  - 프로세스 재시작 시 Map이 초기화되므로 재시작 직후 중복 알림이 발송될 수 있음. 이는 허용된 트레이드오프로 간주한다.
- **제목:** `[TAROT ERROR] {method} {endpoint} - {error.message}`
- **본문:** timestamp, method, endpoint, IP, userId, 에러 메시지, stack trace
- **인터페이스:** `mail.transport.ts`는 Winston `TransportStream`을 상속하며, `log()` 메서드에서 `info.level === 'error'`일 때 nodemailer로 메일을 발송한다. `info` 객체에서 `ip`, `method`, `userId`, `endpoint`, `error` 필드를 직접 읽어 메일 본문을 구성한다.

---

## 8. `/api/health` 엔드포인트 처리

헬스 체크 요청은 로그 파일을 과도하게 채우지 않도록 request logger 미들웨어에서 제외한다.

```typescript
// requestLogger.ts
if (req.path === '/api/health') return next();
```

---

## 9. 요청 컨텍스트 전파 (AsyncLocalStorage)

Spring의 MDC(ThreadLocal)에 해당하는 Node.js 방식. `AsyncLocalStorage`를 사용하면 미들웨어에서 한 번 저장한 컨텍스트가 해당 요청의 async 체인 전체(controller → service → 중첩 Promise)에 자동으로 전파된다. 함수 인자로 context를 넘길 필요가 없다.

```typescript
// logger/context.ts
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  requestId: string;
  ip: string;
  method: string;
  endpoint: string;  // path만 저장 (예: "/api/tarot/spread")
  userId: string | null;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();
```

```typescript
// middleware/requestLogger.ts
import { v4 as uuidv4 } from 'uuid';
import { requestContext } from '../logger/context';

app.use((req, res, next) => {
  if (req.path === '/api/health') return next();

  requestContext.run(
    {
      requestId: uuidv4(),
      ip: req.ip ?? 'unknown',
      method: req.method,
      endpoint: req.path,
      userId: null,  // 회원 기능 추가 시 채워짐
    },
    () => next()
  );
});
```

```typescript
// services/gemini.service.ts — 인자 변경 없이 context 접근
import { requestContext } from '../logger/context';

export const generateSpreadReading = async (options: SpreadReadingOptions) => {
  const ctx = requestContext.getStore();  // 자동으로 현재 요청 context 획득

  logger.info('gemini api call completed', {
    requestId: ctx?.requestId,
    ip: ctx?.ip,
    // ...
  });
};
```

---

## 10. Slack 확장 (추후)

`winston-slack-webhook-transport` 패키지를 추가하고 `logger.ts`에 transport 1개를 추가하는 것으로 완료된다. 기존 코드 수정 없이 확장 가능하다.

```typescript
// logger.ts에 추가할 내용 (추후)
import SlackHook from 'winston-slack-webhook-transport';

logger.add(new SlackHook({
  webhookUrl: process.env.SLACK_WEBHOOK_URL!,
  level: 'error',
}));
```

---

## 11. 파일 구조

```
backend/src/
├── logger/
│   ├── logger.ts            ← winston 인스턴스 및 transport 설정, logs/ 디렉토리 생성
│   ├── context.ts           ← AsyncLocalStorage 인스턴스 및 RequestContext 타입
│   └── mail.transport.ts    ← nodemailer 기반 커스텀 mail transport (중복 방지 Map 포함)
├── middleware/
│   └── requestLogger.ts     ← requestId 생성, AsyncLocalStorage.run() 시작, /api/health 제외
└── services/
    └── gemini.service.ts    ← requestContext.getStore()로 context 접근, logger 호출 추가
```

---

## 12. 환경변수

```env
# 로그 설정
LOG_LEVEL=info          # 프로덕션: info / 개발: debug
LOG_DIR=logs

# 이메일 알림
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASS=your_app_password
MAIL_TO=alert@yourdomain.com

# Slack (추후)
# SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

---

## 13. 개발 vs 프로덕션

`NODE_ENV`가 `'development'`이면 개발 모드, 그 외 모든 값(`production`, `staging`, 미설정 등)은 프로덕션으로 처리한다.

| Transport | 개발 (`NODE_ENV=development`) | 프로덕션 (그 외) |
|-----------|-------------------------------|-----------------|
| Console | 활성화 (컬러 텍스트) | 비활성화 |
| 파일 로테이션 | 비활성화 | 활성화 |
| 이메일 알림 | 비활성화 | 활성화 |
| 로그 레벨 | `debug` | `LOG_LEVEL` 환경변수 값 (기본 `info`) |
