import { Router } from 'express';
import { getDailyTarot, getSpreadTarot } from '../controllers/tarot.controller';

const router = Router();

// 오늘의 운세 (1장)
router.post('/daily', getDailyTarot);

// 3장 뽑기 (스프레드)
router.post('/spread', getSpreadTarot);

export default router;
