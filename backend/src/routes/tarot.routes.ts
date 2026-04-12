import { Router } from 'express';
import { getDailyTarot, getSpreadTarot, getMyHistory, createShareToken, getSharedReading } from '../controllers/tarot.controller';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// 오늘의 운세 (1장) — 로그인 선택 (로그인 시 히스토리 자동 저장)
router.post('/daily', optionalAuth, getDailyTarot);

// 사주타로 스프레드 (3장) — 로그인 필수, 히스토리 자동 저장
router.post('/spread', requireAuth, getSpreadTarot);

// 나의 운세 히스토리 조회 — 로그인 필수
// 쿼리 파라미터: limit (기본 20, 최대 100), offset (기본 0)
router.get('/history', requireAuth, getMyHistory);

// 공유 토큰 생성 — 로그인 필수, 본인 이력만 공유 가능
router.post('/history/:id/share', requireAuth, createShareToken);

// 공유 리딩 조회 — 인증 불필요 (공개)
router.get('/share/:token', getSharedReading);

export default router;
