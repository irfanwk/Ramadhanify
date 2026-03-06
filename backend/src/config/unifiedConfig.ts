import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('4000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    QWEN_API_KEY: z.string().min(1, "QWEN_API_KEY is required"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    SENTRY_DSN: z.string().optional(),
});

const _env = envSchema.parse(process.env);

export const config = {
    app: {
        port: parseInt(_env.PORT, 10),
        env: _env.NODE_ENV,
    },
    ai: {
        qwenApiKey: _env.QWEN_API_KEY,
    },
    db: {
        url: _env.DATABASE_URL,
    },
    sentry: {
        dsn: _env.SENTRY_DSN,
    },
};
