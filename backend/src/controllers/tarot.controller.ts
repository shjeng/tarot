import { Request, Response } from 'express';
import { generateDailyReading, generateSpreadReading, CardInput, SpreadReadingOptions } from '../services/gemini.service';
import { logger } from '../logger/logger';

interface DailyTarotRequest extends Request {
    body: {
        card: CardInput;
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

export const getDailyTarot = async (req: DailyTarotRequest, res: Response): Promise<void> => {
    try {
        const { card } = req.body;

        if (!card || !card.name || !card.nameKo) {
            logger.warn('validation failed', { statusCode: 400, reason: '카드 정보가 올바르지 않습니다.' });
            res.status(400).json({ error: '카드 정보가 올바르지 않습니다.' });
            return;
        }

        const reading = await generateDailyReading(card);
        res.json({ reading });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('getDailyTarot failed', { error: { message: err.message, stack: err.stack } });
        res.status(500).json({ error: 'AI 응답 생성 실패' });
    }
};

export const getSpreadTarot = async (req: SpreadTarotRequest, res: Response): Promise<void> => {
    try {
        const { cards, question, birthDate, birthTime, gender } = req.body;

        if (!cards || !Array.isArray(cards) || cards.length !== 3) {
            logger.warn('validation failed', { statusCode: 400, reason: '3장의 카드 정보가 필요합니다.' });
            res.status(400).json({ error: '3장의 카드 정보가 필요합니다.' });
            return;
        }

        const hasInvalidCard = cards.some(c => !c || !c.name || !c.nameKo || !c.meaningUpright);
        if (hasInvalidCard) {
            logger.warn('validation failed', { statusCode: 400, reason: '카드 정보가 올바르지 않습니다.' });
            res.status(400).json({ error: '카드 정보가 올바르지 않습니다.' });
            return;
        }

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
        res.json({ reading });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('getSpreadTarot failed', { error: { message: err.message, stack: err.stack } });
        res.status(500).json({ error: 'AI 응답 생성 실패' });
    }
};
