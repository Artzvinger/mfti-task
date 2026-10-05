import { z } from 'zod';

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    role: z.string(),
    laboratoryId: z.number().nullable(),
});

export const sampleStatusSchema = z.enum([
    'received',
    'processing',
    'completed',
]);

export const sampleSchema = z.object({
    id: z.number(),
    patientName: z.string(),
    status: sampleStatusSchema,
    receivedAt: z.string(),
    laboratoryId: z.number(),
    createdAt: z.string(),
});

export const samplesResponseSchema = z.object({
    data: z.array(sampleSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Введите логин'),
    password: z.string().min(1, 'Введите пароль'),
});