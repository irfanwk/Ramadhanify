import { Response } from 'express';
import * as Sentry from '@sentry/node';

export class BaseController {
    protected handleSuccess(res: Response, data: any, statusCode = 200): void {
        res.status(statusCode).json({
            success: true,
            data,
        });
    }

    protected handleError(error: any, res: Response, method: string): void {
        Sentry.captureException(error, { extra: { method } });

        // Simplistic error handling for now
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';

        res.status(statusCode).json({
            success: false,
            error: message,
        });
    }
}
