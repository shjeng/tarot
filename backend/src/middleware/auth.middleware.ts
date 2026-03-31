import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

// Express Request 타입에 user 필드를 전역으로 추가
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email?: string };
    }
  }
}

/**
 * 선택적 인증 미들웨어.
 * Authorization 헤더에 유효한 Bearer 토큰이 있으면 req.user를 설정하고,
 * 없거나 유효하지 않으면 에러 없이 그냥 다음 미들웨어로 넘어간다.
 * 로그인 여부에 따라 동작이 달라지는 엔드포인트에서 사용한다 (예: 일일 운세 히스토리 저장).
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (token) {
    // 토큰이 있을 경우에만 검증 시도. 실패해도 에러를 반환하지 않는다.
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      req.user = { id: user.id, email: user.email };
    }
  }
  next();
};

/**
 * 필수 인증 미들웨어.
 * Authorization 헤더에 유효한 Bearer 토큰이 없으면 401을 반환한다.
 * 토큰이 유효하면 req.user를 설정하고 다음 미들웨어로 넘어간다.
 * 로그인이 필수인 엔드포인트에서 사용한다 (예: 스프레드 리딩, 히스토리 조회).
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  // 토큰 자체가 없는 경우
  if (!token) {
    res.status(401).json({ error: '로그인이 필요하다냥.' });
    return;
  }

  // 토큰은 있지만 유효하지 않은 경우 (만료, 위조 등)
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: '유효하지 않은 토큰이다냥.' });
    return;
  }

  req.user = { id: user.id, email: user.email };
  next();
};
