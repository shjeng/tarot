import dotenv from 'dotenv';
dotenv.config(); // import 호이스팅으로 인해 server.ts의 dotenv.config()보다 먼저 실행될 수 있으므로 여기서도 호출

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import { requestContext } from './context';
import { MailTransport } from './mail.transport';

const isDev = process.env.NODE_ENV === 'development';
const logDir = path.resolve(process.env.LOG_DIR || 'logs');
const logLevel = process.env.LOG_LEVEL || 'info';

// logs/ 디렉토리 자동 생성 (개발/프로덕션 모두 실행, 존재하면 무시)
fs.mkdirSync(logDir, { recursive: true });

// 모든 로그에 requestContext 자동 삽입
const contextFormat = winston.format((info) => {
    const ctx = requestContext.getStore();
    if (ctx) {
        info.requestId = ctx.requestId;
        info.ip = ctx.ip;
        info.method = ctx.method;
        info.endpoint = ctx.endpoint;
        info.userId = ctx.userId;
    }
    return info;
});

const kstTimestamp = () =>
    new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace('Z', '+09:00');

const jsonFormat = winston.format.combine(
    contextFormat(),
    winston.format.printf((info) => {
        const { level, message, requestId, ip, ...rest } = info;
        return JSON.stringify({ timestamp: kstTimestamp(), level, message, requestId, ip, ...rest });
    })
);

const consoleFormat = winston.format.combine(
    contextFormat(),
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, requestId }) => {
        const rid = requestId ? `[${String(requestId).slice(0, 8)}]` : '';
        return `${timestamp} ${level} ${rid} ${message}`;
    })
);

const transports: winston.transport[] = [];

if (isDev) {
    transports.push(new winston.transports.Console({ format: consoleFormat }));
} else {
    transports.push(
        // 전체 로그 (info 이상)
        new DailyRotateFile({
            dirname: logDir,
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '180d',
            maxSize: '50m',
            format: jsonFormat,
        }),
        // 에러 전용 로그
        new DailyRotateFile({
            dirname: logDir,
            filename: '%DATE%.error.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,
            maxFiles: '180d',
            maxSize: '50m',
            format: jsonFormat,
        })
    );
    if (process.env.MAIL_HOST && process.env.MAIL_USER) {
        transports.push(new MailTransport());
    }
}

export const logger = winston.createLogger({
    level: isDev ? 'debug' : logLevel,
    transports,
});
