import { Request, Response } from 'express';
import { generateDailyReading, generateSpreadReading, CardInput, SpreadReadingOptions } from '../services/gemini.service';

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
            res.status(400).json({ error: '카드 정보가 올바르지 않습니다.' });
            return;
        }

        const reading = await generateDailyReading(card);
        res.json({ reading });
    } catch (error) {
        console.error('Error in getDailyTarot:', error);
        res.status(500).json({ error: 'AI 응답 생성 실패' });
    }
};

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
        if (!question || !question.trim()) {
            res.status(400).json({ error: '질문을 입력해주세요.' });
            return;
        }
        if (question.trim().length > 500) {
            res.status(400).json({ error: '질문은 500자 이내로 입력해주세요.' });
            return;
        }

        // 생년월일 형식 및 범위 검사
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthDate || !birthDateRegex.test(birthDate)) {
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }
        const [byear, bmonth, bday] = birthDate.split('-').map(Number);
        // 실제 달력 유효성 검사 (예: 2월 30일 거부)
        const dateCheck = new Date(Date.UTC(byear, bmonth - 1, bday));
        if (
            dateCheck.getUTCFullYear() !== byear ||
            dateCheck.getUTCMonth() !== bmonth - 1 ||
            dateCheck.getUTCDate() !== bday
        ) {
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }
        const minDate = new Date(Date.UTC(1900, 0, 1));
        const todayUTC = new Date();
        const todayEnd = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate(), 23, 59, 59, 999));
        if (dateCheck < minDate || dateCheck > todayEnd) {
            res.status(400).json({ error: '올바른 생년월일을 입력해주세요.' });
            return;
        }

        // 태어난 시각 형식 검사 (선택)
        if (birthTime != null) {
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
