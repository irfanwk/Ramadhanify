import { z } from 'zod';

export const generateMemeSchema = z.object({
    category: z.string().min(1, "Category is required"),
    userJoke: z.string().optional(),
    genre: z.enum(['self-deprecating', 'pov-situational', 'ironi-meta', 'corporate-satire']),
    style: z.enum(['classic', 'aesthetic']),
});

export type GenerateMemeRequest = z.infer<typeof generateMemeSchema>;
