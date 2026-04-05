import express from 'express';
import cors from 'cors';
import tarotRoutes from './routes/tarot.routes';
import { requestLogger } from './middleware/requestLogger';
import { mongoLogger } from './middleware/mongoLogger';

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(requestLogger);
app.use(mongoLogger); // 요청/응답 데이터를 MongoDB에 저장

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tarot', tarotRoutes);

export default app;
