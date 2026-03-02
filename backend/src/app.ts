import express from 'express';
import cors from 'cors';
import tarotRoutes from './routes/tarot.routes';

const app = express();

// 미들웨어 설정
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// 헬스 체크
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 타로 API 라우터 연결
app.use('/api/tarot', tarotRoutes);

export default app;
