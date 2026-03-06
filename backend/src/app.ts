import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';

import memeRoutes from './routes/memeRoutes';
import greetingRoutes from './routes/greetingRoutes';

export const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Sentry request handler
if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
}

// Routes
app.use('/api/v1/content', memeRoutes);
app.use('/api/v1/content', greetingRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'ZodError') {
        res.status(400).json({ success: false, error: 'Validation Error', details: err.errors });
        return;
    }

    res.status(err.statusCode || 500).json({ success: false, error: err.message || 'Internal Server Error' });
});
