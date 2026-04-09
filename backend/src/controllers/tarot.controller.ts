import { Request, Response } from 'express';
import { generateDailyReading, generateSpreadReading, CardInput, SpreadReadingOptions } from '../services/gemini.service';
import { logger } from '../logger/logger';
import { createUserClient } from '../lib/supabase';

/**
 * 유저 JWT로 생성한 Supabase 클라이언트로 히스토리를 저장한다.
 * RLS가 정상 동작하므로 service_role key 없이도 자기 자신 데이터에 접근 가능하다.
 * 저장 실패 시 에러를 던지지 않고 로그만 남긴다 (히스토리 저장 실패가 리딩 응답에 영향을 주지 않도록).
 */
const saveHistory = async (
    accessToken: string,
    userId: string,
    type: 'daily' | 'spread',
    requestData: object,
    reading: string,
): Promise<void> => {
    const { error } = await createUserClient(accessToken)
        .from('reading_histories')
        .insert({ user_id: userId, type, request_data: requestData, reading });
    if (error) {
        logger.error('reading_histories DB 저장 실패', { error: error.message });
    }
};

// 일일 운세 요청 body 타입
interface DailyTarotRequest extends Request {
    body: {
        card: CardInput;
    }
}

// 스프레드(3장) 운세 요청 body 타입
interface SpreadTarotRequest extends Request {
    body: {
        cards: CardInput[];
        question: string;
        birthDate: string;
        birthTime?: string | null;
        gender: 'male' | 'female' | 'other';
    }
}

/**
 * POST /tarot/daily
 * 오늘의 운세 (1장 타로) 리딩을 생성한다.
 * 로그인 여부는 선택적이며, 로그인 상태일 경우 결과를 히스토리에 저장한다.
 */
export const getDailyTarot = async (req: DailyTarotRequest, res: Response): Promise<void> => {
    try {
        const { card } = req.body;

        // 필수 카드 정보 유효성 검사
        if (!card || !card.name || !card.nameKo) {
            logger.warn('validation failed', { statusCode: 400, reason: '카드 정보가 올바르지 않습니다.' });
            res.status(400).json({ error: '카드 정보가 올바르지 않습니다.' });
            return;
        }

        const reading = await generateDailyReading(card);

        // 로그인한 사용자인 경우에만 히스토리 저장 (optionalAuth 미들웨어에서 req.user 설정됨)
        if (req.user) {
            const token = req.headers.authorization!.slice(7);
            await saveHistory(token, req.user.id, 'daily', { card }, reading);
        }

        res.json({ reading });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('getDailyTarot failed', { error: { message: err.message, stack: err.stack } });
        res.status(500).json({ error: 'AI 응답 생성 실패' });
    }
};

/**
 * POST /tarot/spread
 * 사주타로 스프레드 (3장) 리딩을 생성한다.
 * requireAuth 미들웨어로 보호되어 로그인이 필수이며, 결과를 항상 히스토리에 저장한다.
 */
export const getSpreadTarot = async (req: SpreadTarotRequest, res: Response): Promise<void> => {
    try {
        const { cards, question, birthDate, birthTime, gender } = req.body;

        // 카드 3장 여부 및 배열 타입 검사
        if (!cards || !Array.isArray(cards) || cards.length !== 3) {
            logger.warn('validation failed', { statusCode: 400, reason: '3장의 카드 정보가 필요합니다.' });
            res.status(400).json({ error: '3장의 카드 정보가 필요합니다.' });
            return;
        }

        // 각 카드의 필수 필드(name, nameKo, meaningUpright) 존재 여부 검사
        const hasInvalidCard = cards.some(c => !c || !c.name || !c.nameKo || !c.meaningUpright);
        if (hasInvalidCard) {
            logger.warn('validation failed', { statusCode: 400, reason: '카드 정보가 올바르지 않습니다.' });
            res.status(400).json({ error: '카드 정보가 올바르지 않습니다.' });
            return;
        }

        // 질문 빈 값 및 길이 검사
        if (!question || !question.trim()) {
            logger.warn('validation failed', { statusCode: 400, reason: '질문을 입력해주세요.' });
            res.status(400).json({ error: '질문을 입력해주세요.' });
            return;
        }
        if (question.trim().length > 500) {
            logger.warn('validation failed', { statusCode: 400, reason: '질문은 500자 이내로 입력해주세요.' });
            res.status(400).json({ error: '질문은 500자 이내로 입력해주세요.' });
            return;
        }

        // 생년월일 형식(YYYY-MM-DD) 및 유효 날짜 범위 검사
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthDate || !birthDateRegex.test(birthDate)) {
            logger.warn('validation failed', { statusCode: 400, reason: '올바른 생년월일을 입력해주세요.' });
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }
        const [byear, bmonth, bday] = birthDate.split('-').map(Number);
        const dateCheck = new Date(Date.UTC(byear, bmonth - 1, bday));
        if (
            dateCheck.getUTCFullYear() !== byear ||
            dateCheck.getUTCMonth() !== bmonth - 1 ||
            dateCheck.getUTCDate() !== bday
        ) {
            logger.warn('validation failed', { statusCode: 400, reason: '올바른 생년월일을 입력해주세요.' });
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }
        const minDate = new Date(Date.UTC(1900, 0, 1));
        const todayUTC = new Date();
        const todayEnd = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate(), 23, 59, 59, 999));
        if (dateCheck < minDate || dateCheck > todayEnd) {
            logger.warn('validation failed', { statusCode: 400, reason: '올바른 생년월일을 입력해주세요.' });
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }

        // 태어난 시각 형식(HH:MM) 및 유효 범위 검사 (선택 필드)
        if (birthTime != null) {
            const timeRegex = /^\d{2}:\d{2}$/;
            if (!timeRegex.test(birthTime)) {
                logger.warn('validation failed', { statusCode: 400, reason: '태어난 시각 형식이 올바르지 않습니다.' });
                res.status(400).json({ error: '태어난 시각 형식이 올바르지 않습니다.' });
                return;
            }
            const [hh, mm] = birthTime.split(':').map(Number);
            if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
                logger.warn('validation failed', { statusCode: 400, reason: '태어난 시각 형식이 올바르지 않습니다.' });
                res.status(400).json({ error: '태어난 시각 형식이 올바르지 않습니다.' });
                return;
            }
        }

        // 성별 허용값 검사
        if (!gender || !['male', 'female', 'other'].includes(gender)) {
            logger.warn('validation failed', { statusCode: 400, reason: '성별 정보가 올바르지 않습니다.' });
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

        // spread는 requireAuth로 보호되므로 토큰이 항상 존재함
        const token = req.headers.authorization!.slice(7);
        await saveHistory(token, req.user!.id, 'spread', { cards, question, birthDate, birthTime, gender }, reading);

        res.json({ reading });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('getSpreadTarot failed', { error: { message: err.message, stack: err.stack } });
        res.status(500).json({ error: 'AI 응답 생성 실패' });
    }
};

/**
 * GET /tarot/history
 * 로그인한 사용자의 타로 리딩 히스토리를 최신순으로 반환한다.
 * 페이지네이션을 지원하며, 쿼리 파라미터로 limit과 offset을 받는다.
 *
 * @query limit - 한 번에 가져올 개수 (기본값: 20, 최대: 100)
 * @query offset - 건너뛸 개수 (기본값: 0)
 */
export const getMyHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        // 페이지네이션 파라미터 파싱 및 범위 제한
        const limit = Math.min(Number(req.query.limit) || 20, 100);
        const offset = Number(req.query.offset) || 0;

        // 유저 JWT로 클라이언트 생성 — RLS가 자동으로 본인 데이터만 필터링
        const token = req.headers.authorization!.slice(7);
        const { data, error, count } = await createUserClient(token)
            .from('reading_histories')
            .select('id, type, request_data, reading, created_at', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            logger.error('reading_histories 조회 실패', { error: error.message });
            res.status(500).json({ error: '히스토리 조회 실패' });
            return;
        } else {
            logger.info('reading_histories');
        }

        res.json({ histories: data, total: count ?? 0, limit, offset });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('getMyHistory failed', { error: { message: err.message, stack: err.stack } });
        res.status(500).json({ error: '히스토리 조회 실패' });
    }
};
