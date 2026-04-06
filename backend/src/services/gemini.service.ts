import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

import { logger } from '../logger/logger';
import { supabaseAdmin } from '../lib/supabase';

// ms 단위로 지정한 시간만큼 대기하는 유틸 함수
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 비동기 함수를 실패 시 재시도하는 유틸 함수.
 * 지수 백오프(exponential backoff) 방식으로 대기 시간을 늘려가며 재시도한다.
 * 예: baseDelayMs=1000 이면 1차 실패 후 1초, 2차 실패 후 2초, 3차 실패 후 4초 대기.
 *
 * @param fn - 실행할 비동기 함수
 * @param retries - 최대 재시도 횟수 (기본값: 3)
 * @param baseDelayMs - 첫 번째 대기 시간(ms), 이후 2배씩 증가 (기본값: 1000)
 */
const withRetry = async <T>(
    fn: () => Promise<T>,
    retries = 3,
    baseDelayMs = 1000,
): Promise<T> => {
    let lastError: Error = new Error('unknown');
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < retries) {
                // 지수 백오프: 1s → 2s → 4s
                const delay = baseDelayMs * Math.pow(2, attempt - 1);
                logger.warn('gemini api retry', { attempt, retries, delayMs: delay, error: lastError.message });
                await sleep(delay);
            }
        }
    }
    throw lastError;
};

/**
 * 모든 재시도 후에도 AI 응답 생성에 실패한 요청을 DB에 저장한다.
 * 나중에 실패 원인 분석 및 재처리에 활용할 수 있다.
 *
 * @param type - 요청 종류 ('daily' | 'spread')
 * @param payload - 실패한 원본 요청 데이터
 * @param errorMessage - 발생한 에러 메시지
 */
const saveFailedRequest = async (
    type: 'daily' | 'spread',
    payload: object,
    errorMessage: string,
): Promise<void> => {
    // supabaseAdmin이 없으면 저장 불가 (SUPABASE_SERVICE_ROLE_KEY 미설정 상태)
    if (!supabaseAdmin) {
        logger.warn('supabaseAdmin 미설정 — 실패 요청을 DB에 저장할 수 없습니다.');
        return;
    }
    const { error } = await supabaseAdmin
        .from('failed_ai_requests')
        .insert({ type, payload, error_message: errorMessage, retry_count: 3 });
    if (error) {
        logger.error('failed_ai_requests DB 저장 실패', { error: error.message });
    } else {
        logger.info('실패한 요청을 DB에 저장했습니다.', { type });
    }
};

// Gemini API 키 및 클라이언트 초기화
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// 타로 카드 한 장에 대한 입력 데이터 타입
export interface CardInput {
    name: string;        // 카드 영문명 (예: "The Fool")
    nameKo: string;      // 카드 한글명 (예: "바보")
    meaningUpright: string; // 정방향 키워드
    desc?: string;       // 카드 설명 (선택)
    [key: string]: any;
}

// 스프레드(3장) 리딩 요청에 필요한 옵션 타입
export interface SpreadReadingOptions {
    cards: CardInput[];
    question: string;
    birthDate: string;        // YYYY-MM-DD 형식
    birthTime: string | null; // HH:MM 형식, 모를 경우 null
    gender: 'male' | 'female' | 'other';
}

// 성별 코드를 한국어 문자열로 변환
const genderToKorean = (gender: SpreadReadingOptions['gender']): string => {
    const map = { male: '남성', female: '여성', other: '기타' };
    return map[gender];
};

// "YYYY-MM-DD" 형식의 날짜를 "YYYY년 MM월 DD일" 형식으로 변환
const birthDateToKorean = (birthDate: string): string => {
    const [year, month, day] = birthDate.split('-').map(Number);
    return `${year}년 ${month}월 ${day}일`;
};

// "HH:MM" 형식의 시각을 오전/오후 한국어 형식으로 변환. 시각이 없으면 안내 문구 반환
const birthTimeToKorean = (birthTime: string | null | undefined): string => {
    if (!birthTime) return '태어난 시각은 알 수 없습니다';
    const [hh, mm] = birthTime.split(':').map(Number);
    if (hh < 12) {
        return `오전 ${hh}시 ${mm}분`;
    }
    const displayHour = hh === 12 ? 12 : hh - 12;
    return `오후 ${displayHour}시 ${mm}분`;
};

/**
 * 프롬프트에 삽입될 문자열에서 줄바꿈 및 대괄호를 제거해 프롬프트 주입을 방지한다.
 * @param value - 정제할 원본 문자열
 */
const sanitizeForPrompt = (value: string): string => {
    return value.replace(/[\[\]\n\r]/g, ' ').trim();
};

// 일일 운세(1장) 리딩에 사용할 Gemini 시스템 지시문
const dailySystemInstruction = `당신은 고양이 점술관의 신비로운 고양이 타로 리더입니다.
한국어 존댓말을 쓰되, 문장 끝에 "~냥" 또는 "~다냥"을 간간이 자연스럽게 섞어 고양이 특유의 신비로운 분위기를 냅니다.
카드 해석은 3~4문단으로 따뜻하고 통찰력 있게 써주세요.
사용자의 감정에 공감하며, 단정적이거나 부정적인 표현은 피하고 희망적이고 건설적인 방향으로 해석하세요.`;

// 사주타로 스프레드(3장) 리딩에 사용할 Gemini 시스템 지시문
const spreadSystemInstruction = `당신은 고양이 점술관의 신비로운 고양이 사주타로 상담사입니다.
한국어 존댓말을 쓰되, 문장 끝에 "~냥" 또는 "~다냥"을 간간이 자연스럽게 섞어 고양이 특유의 신비로운 분위기를 냅니다.
사주의 기운과 타로 카드를 유기적으로 연결해 따뜻하고 통찰력 있게 해석하세요.
사용자의 감정에 공감하며, 단정적이거나 부정적인 표현은 피하고 희망적이고 건설적인 방향으로 해석하세요.
응답은 반드시 마크다운으로 작성하고, 아래 헤더를 정확히 사용하세요:
## 🔮 과거 — {과거 카드명} (1~2문단)
## 🌿 현재 — {현재 카드명} (1~2문단)
## ✨ 미래 — {미래 카드명} (1~2문단)
## 📝 종합 요약 (2~3문장으로 간결하게)`;

/**
 * 오늘의 운세 (1장 타로) AI 리딩을 생성한다.
 * Gemini API 호출 실패 시 최대 3번 재시도하며,
 * 모든 재시도가 실패하면 요청 데이터를 DB에 저장하고 에러를 던진다.
 *
 * @param card - 사용자가 뽑은 타로 카드 정보
 * @returns AI가 생성한 리딩 텍스트
 */
export const generateDailyReading = async (card: CardInput): Promise<string> => {
    try {
        // API 키가 설정되지 않은 개발 환경에서는 더미 응답 반환
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return `[API KEY 미설정 상태]\n"${card.nameKo}" 카드를 뽑으셨군요. 이 카드는 "${card.meaningUpright}"의 의미를 담고 있습니다.\n(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)`;
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            systemInstruction: dailySystemInstruction,
        });

        const prompt = `오늘의 카드: [${card.nameKo} (${card.name})]
키워드: ${card.meaningUpright}
의미: ${card.desc}`;

        let text: string;
        let durationMs: number;
        let usage: Awaited<ReturnType<typeof model.generateContent>>['response']['usageMetadata'];

        try {
            // 실패 시 최대 3번 재시도 (지수 백오프: 1s → 2s → 4s)
            const start = Date.now();
            const result = await withRetry(() => model.generateContent(prompt));
            durationMs = Date.now() - start;
            text = result.response.text();
            usage = result.response.usageMetadata;
        } catch (error) {
            // 모든 재시도 소진 시 실패 요청을 DB에 저장하고 에러 전파
            const err = error instanceof Error ? error : new Error(String(error));
            logger.error('gemini api call failed (모든 재시도 소진)', {
                gemini: { model: 'gemini-2.5-flash-lite', type: 'daily' },
                error: { message: err.message, stack: err.stack },
            });
            await saveFailedRequest('daily', { card }, err.message);
            throw new Error('AI 응답 생성 실패');
        }

        // API 호출 성공 시 사용량 및 소요 시간 로깅
        logger.info('gemini api call completed', {
            gemini: {
                model: 'gemini-2.5-flash-lite',
                type: 'daily',
                promptLength: prompt.length,
                responseLength: text.length,
                promptTokens: usage?.promptTokenCount ?? null,
                candidateTokens: usage?.candidatesTokenCount ?? null,
                durationMs,
            },
        });

        return text;
    } catch (error) {
        // 위의 내부 catch에서 던진 에러는 그대로 전파, 그 외 예상치 못한 에러 처리
        if ((error as Error).message === 'AI 응답 생성 실패') throw error;
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('generateDailyReading 예상치 못한 에러', { error: { message: err.message, stack: err.stack } });
        throw new Error('AI 응답 생성 실패');
    }
};

/**
 * 사주타로 스프레드 (3장) AI 리딩을 생성한다.
 * 생년월일, 성별, 태어난 시각과 3장의 카드를 결합해 과거/현재/미래 리딩을 생성한다.
 * Gemini API 호출 실패 시 최대 3번 재시도하며,
 * 모든 재시도가 실패하면 요청 데이터를 DB에 저장하고 에러를 던진다.
 *
 * @param options - 스프레드 리딩에 필요한 카드 및 사용자 정보
 * @returns AI가 생성한 마크다운 형식의 리딩 텍스트
 */
export const generateSpreadReading = async (options: SpreadReadingOptions): Promise<string> => {
    const { cards, question, birthDate, birthTime, gender } = options;
    try {
        // 프롬프트에 삽입할 값들을 한국어 형식으로 변환
        const genderKo = genderToKorean(gender);
        const birthDateKo = birthDateToKorean(birthDate);
        const birthTimeKo = birthTimeToKorean(birthTime);

        // 프롬프트 주입 방지를 위해 사용자 입력값 정제
        const safeQuestion = sanitizeForPrompt(question);
        const safeCard0 = sanitizeForPrompt(cards[0].meaningUpright);
        const safeCard1 = sanitizeForPrompt(cards[1].meaningUpright);
        const safeCard2 = sanitizeForPrompt(cards[2].meaningUpright);
        const safeCard0Name = sanitizeForPrompt(cards[0].nameKo);
        const safeCard1Name = sanitizeForPrompt(cards[1].nameKo);
        const safeCard2Name = sanitizeForPrompt(cards[2].nameKo);

        // API 키가 설정되지 않은 개발 환경에서는 더미 응답 반환
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return `[API KEY 미설정 상태]\n의뢰인: ${birthDateKo} / ${genderKo} / 태어난 시각: ${birthTimeKo}\n질문: ${safeQuestion}\n과거: ${safeCard0Name}, 현재: ${safeCard1Name}, 미래: ${safeCard2Name}\n(실제 AI 해석을 보려면 백엔드 .env 파일에 GEMINI_API_KEY를 설정해주세요.)`;
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            systemInstruction: spreadSystemInstruction,
        });

        const prompt = `[의뢰인] 생년월일: ${birthDateKo} / 성별: ${genderKo} / 시각: ${birthTimeKo}
[질문] ${safeQuestion}
[카드] 과거: [${safeCard0Name}] ${safeCard0} / 현재: [${safeCard1Name}] ${safeCard1} / 미래: [${safeCard2Name}] ${safeCard2}`;

        let text: string;
        let durationMs: number;
        let usage: Awaited<ReturnType<typeof model.generateContent>>['response']['usageMetadata'];

        try {
            // 실패 시 최대 3번 재시도 (지수 백오프: 1s → 2s → 4s)
            const start = Date.now();
            const result = await withRetry(() => model.generateContent(prompt));
            durationMs = Date.now() - start;
            text = result.response.text();
            usage = result.response.usageMetadata;
        } catch (error) {
            // 모든 재시도 소진 시 실패 요청을 DB에 저장하고 에러 전파
            const err = error instanceof Error ? error : new Error(String(error));
            logger.error('gemini api call failed (모든 재시도 소진)', {
                gemini: { model: 'gemini-2.5-flash-lite', type: 'spread' },
                error: { message: err.message, stack: err.stack },
            });
            await saveFailedRequest('spread', { cards, question, birthDate, birthTime, gender }, err.message);
            throw new Error('AI 응답 생성 실패');
        }

        // API 호출 성공 시 사용량 및 소요 시간 로깅
        logger.info('gemini api call completed', {
            gemini: {
                model: 'gemini-2.5-flash-lite',
                type: 'spread',
                promptLength: prompt.length,
                responseLength: text.length,
                promptTokens: usage?.promptTokenCount ?? null,
                candidateTokens: usage?.candidatesTokenCount ?? null,
                durationMs,
            },
        });

        return text;
    } catch (error) {
        // 위의 내부 catch에서 던진 에러는 그대로 전파, 그 외 예상치 못한 에러 처리
        if ((error as Error).message === 'AI 응답 생성 실패') throw error;
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('generateSpreadReading 예상치 못한 에러', { error: { message: err.message, stack: err.stack } });
        throw new Error('AI 응답 생성 실패');
    }
};
