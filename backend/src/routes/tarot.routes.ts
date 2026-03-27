import { Router } from 'express';
import { getDailyTarot, getSpreadTarot } from '../controllers/tarot.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// 오늘의 운세 (1장) - 로그인 불필요
router.post('/daily', getDailyTarot);

// 3장 뽑기 (스프레드) - 로그인 필요
router.post('/spread', requireAuth, getSpreadTarot);

export default router;
