import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { logger } from './logger/logger';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
    logger.error('uncaughtException', { error: { message: err.message, stack: err.stack } });
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logger.error('unhandledRejection', { error: { message: err.message, stack: err.stack } });
});

app.listen(PORT, () => {
    logger.info(`server started on port ${PORT}`);
});
