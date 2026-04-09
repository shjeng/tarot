import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestContext } from '../logger/context';
import { logger } from '../logger/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    if (req.path === '/api/health') {
        next();
        return;
    }

    const startTime = Date.now();

    // AsyncLocalStorage.run() 안에서 next()를 호출하므로
    // controller → service로 이어지는 모든 async 체인이 이 store를 상속한다.
    // res.on('finish') 콜백도 동일 async 컨텍스트에서 등록되어 store가 유지된다.
    requestContext.run(
        {
            requestId: uuidv4(),
            // Express 5에서 trust proxy 미설정 시 req.ip가 undefined일 수 있어 fallback 사용
            ip: req.ip ?? req.socket.remoteAddress ?? 'unknown',
            method: req.method,
            endpoint: req.path,
            userId: null, // 회원 기능 추가 시 채워짐
        },
        () => {
            res.on('finish', () => {
                // auth 미들웨어 실행 후 req.user가 채워지므로 여기서 context에 반영
                const ctx = requestContext.getStore();
                if (ctx) ctx.userId = req.user?.id ?? null;

                const durationMs = Date.now() - startTime;
                const level = res.statusCode >= 500 ? 'error' : 'info';

                logger.log(level, 'request completed', {
                    statusCode: res.statusCode,
                    durationMs,
                });
            });

            next();
        }
    );
};
