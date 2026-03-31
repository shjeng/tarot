import { Router } from 'express';
import { getDailyTarot, getSpreadTarot, getMyHistory } from '../controllers/tarot.controller';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// 오늘의 운세 (1장) — 로그인 선택 (로그인 시 히스토리 자동 저장)
router.post('/daily', optionalAuth, getDailyTarot);

// 사주타로 스프레드 (3장) — 로그인 필수, 히스토리 자동 저장
router.post('/spread', requireAuth, getSpreadTarot);

// 나의 운세 히스토리 조회 — 로그인 필수
// 쿼리 파라미터: limit (기본 20, 최대 100), offset (기본 0)
router.get('/history', requireAuth, getMyHistory);

export default router;
