import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';
import { RequestLog } from '../models/requestLog.model';
import { logger } from '../logger/logger';

// User-Agent 문자열을 파싱해서 기기/OS/브라우저 정보를 추출
const parseUserAgent = (ua: string) => {
    const parser = new UAParser(ua);
    const result = parser.getResult();

    // 모바일 기기 여부 판단 (device.type이 'mobile' 또는 'tablet'이면 모바일)
    const deviceType = result.device.type === 'mobile' || result.device.type === 'tablet'
        ? 'mobile'
        : result.device.type
            ? 'desktop'
            : ua.toLowerCase().match(/mobile|android|iphone|ipad/)
                ? 'mobile'
                : 'desktop';

    return {
        deviceType: deviceType as 'mobile' | 'desktop' | 'unknown',
        os: result.os.name ?? 'unknown',
        browser: result.browser.name ?? 'unknown',
    };
};

export const mongoLogger = (req: Request, res: Response, next: NextFunction): void => {
    // MongoDB가 연결되지 않은 경우 로깅 건너뜀
    if (mongoose.connection.readyState !== 1) {
        next();
        return;
    }

    // health check는 로깅 제외
    if (req.path === '/api/health') {
        next();
        return;
    }

    const startTime = Date.now();
    const requestId = uuidv4();
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const userAgent = req.headers['user-agent'] ?? '';
    const { deviceType, os, browser } = parseUserAgent(userAgent);

    // 요청 body 복사 (민감 정보 제외: password 등)
    const requestBody = { ...req.body };
    if (requestBody.password) delete requestBody.password;

    // res.json()을 가로채서 응답 body를 캡처
    let responseBody: Record<string, unknown> = {};
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
        responseBody = typeof body === 'object' && body !== null
            ? (body as Record<string, unknown>)
            : { data: body };
        return originalJson(body);
    };

    res.on('finish', async () => {
        const durationMs = Date.now() - startTime;

        try {
            await RequestLog.create({
                requestId,
                timestamp: new Date(),
                ip,
                userAgent,
                deviceType,
                os,
                browser,
                method: req.method,
                endpoint: req.path,
                requestBody,
                statusCode: res.statusCode,
                responseBody,
                durationMs,
                userId: req.user?.id ?? null,
            });
        } catch (err) {
            // 로그 저장 실패가 서비스에 영향을 주지 않도록 에러만 기록
            const error = err instanceof Error ? err : new Error(String(err));
            logger.error('MongoDB 요청 로그 저장 실패', { error: { message: error.message } });
        }
    });

    next();
};
