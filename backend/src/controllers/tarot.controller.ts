import { Request, Response } from 'express';
import { generateDailyReading, generateSpreadReading } from '../services/gemini.service';

export const getDailyTarot = async (req: Request, res: Response): Promise<void> => {
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

export const getSpreadTarot = async (req: Request, res: Response): Promise<void> => {
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
