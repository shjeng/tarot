import mongoose from 'mongoose';
import { logger } from '../logger/logger';

// MongoDB 연결 함수 — 서버 시작 시 한 번 호출
export const connectMongoDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        logger.warn('MONGODB_URI 미설정 — MongoDB 연결을 건너뜁니다.');
        return;
    }

    try {
        await mongoose.connect(uri);
        logger.info('MongoDB 연결 성공');
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error('MongoDB 연결 실패', { error: { message: error.message } });
    }
};
