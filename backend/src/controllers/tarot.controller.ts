import { Request, Response } from 'express';
import { generateDailyReading, generateSpreadReading } from '../services/gemini.service';

interface Card {
    name: string;
    nameKo: string;
    [key: string]: any; // 필요에 따라 추가 속성 정의
}

interface DailyTarotRequest extends Request {
    body: {
        card: Card;
    }
}

interface SpreadTarotRequest extends Request {
    body: {
        cards: Card[];
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
        res.status(500).json({ error: '타로 해석 중 오류가 발생했습니다.' });
    }
};

export const getSpreadTarot = async (req: SpreadTarotRequest, res: Response): Promise<void> => {
    try {
        const { cards } = req.body;

        if (!cards || !Array.isArray(cards) || cards.length !== 3) {
            res.status(400).json({ error: '3장의 카드 정보가 필요합니다.' });
            return;
        }

        const reading = await generateSpreadReading(cards);
        res.json({ reading });
    } catch (error) {
        console.error('Error in getSpreadTarot:', error);
        res.status(500).json({ error: '타로 해석 중 오류가 발생했습니다.' });
    }
};
