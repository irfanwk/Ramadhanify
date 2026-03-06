import { z } from 'zod';

export const generateMemeSchema = z.object({
    category: z.string().min(1, "Category is required"),
    userJoke: z.string().optional(),
    style: z.enum(['Classic', 'Aesthetic']),
});

export type GenerateMemeRequest = z.infer<typeof generateMemeSchema>;
