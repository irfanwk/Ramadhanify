import { z } from 'zod';

export const generateGreetingSchema = z.object({
    recipientName: z.string().min(1, "Recipient name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    tone: z.string().min(1, "Tone is required"),
    visualTheme: z.string().min(1, "Visual theme is required"),
});

export type GenerateGreetingRequest = z.infer<typeof generateGreetingSchema>;
