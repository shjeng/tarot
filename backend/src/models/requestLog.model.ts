import mongoose, { Schema, Document } from 'mongoose';

// 요청 로그 문서 타입 정의
export interface IRequestLog extends Document {
    requestId: string;
    timestamp: Date;
    ip: string;
    userAgent: string;
    deviceType: 'mobile' | 'desktop' | 'unknown'; // 기기 종류
    os: string;                                     // 운영체제 (iOS, Android, Windows 등)
    browser: string;                                // 브라우저
    method: string;
    endpoint: string;
    requestBody: Record<string, unknown>;
    statusCode: number;
    responseBody: Record<string, unknown>;          // AI 응답 포함
    durationMs: number;
    userId: string | null;
}

const RequestLogSchema = new Schema<IRequestLog>(
    {
        requestId:    { type: String, required: true, index: true },
        // TTL 인덱스: 90일 후 MongoDB가 자동으로 문서 삭제 (60 * 60 * 24 * 90 = 7,776,000초)
        timestamp:    { type: Date, default: Date.now, expires: 7_776_000 },
        ip:           { type: String, default: 'unknown' },
        userAgent:    { type: String, default: '' },
        deviceType:   { type: String, enum: ['mobile', 'desktop', 'unknown'], default: 'unknown' },
        os:           { type: String, default: 'unknown' },
        browser:      { type: String, default: 'unknown' },
        method:       { type: String, required: true },
        endpoint:     { type: String, required: true, index: true },
        requestBody:  { type: Schema.Types.Mixed, default: {} },
        statusCode:   { type: Number, required: true },
        responseBody: { type: Schema.Types.Mixed, default: {} },
        durationMs:   { type: Number, required: true },
        userId:       { type: String, default: null, index: true },
    },
    {
        // 컬렉션명 고정
        collection: 'request_logs',
    }
);

export const RequestLog = mongoose.model<IRequestLog>('RequestLog', RequestLogSchema);
