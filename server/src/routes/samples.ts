import { Router } from 'express';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../db';
import { samples, users } from '../db/schema';
import { requireAuth } from '../middleware/authCheck';

const router = Router();

// Проверяем параметры для списка образцов
const samplesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z
        .enum(['received', 'processing', 'completed'])
        .optional(),
    sort: z
        .enum(['receivedAt', 'createdAt'])
        .default('receivedAt'),
    order: z
        .enum(['asc', 'desc'])
        .default('desc'),
});

// Получаем список образцов
router.get('/', requireAuth, async (req, res) => {

    // Проверяем параметры из URL
    const parsed = samplesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({
            message: 'Invalid query parameters',
            errors: parsed.error.flatten(),
        });
    }

    const { page, limit, status, sort, order } = parsed.data;

    // Находим текущего пользователя по его сессии
    const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, req.session.userId!))
        .limit(1);

    const user = userResult[0];

    if (!user) {
        return res.status(401).json({
            message: 'User not found',
        });
    }

    // Собираем условия для запроса
    const conditions = [];

    // Обычный пользователь видит только свою лабораторию
    if (user.role !== 'admin') {
        if (user.laboratoryId === null) {
            return res.status(403).json({
                message: 'Access denied',
            });
        }

        conditions.push(
            eq(samples.laboratoryId, user.laboratoryId),
        );
    }

    // Если передали статус, добавляем его в фильтр
    if (status) {
        conditions.push(eq(samples.status, status));
    }

    // Объединяем все условия через AND
    const whereCondition =
        conditions.length > 0
            ? and(...conditions)
            : undefined;

    // Выбираем поле для сортировки
    const sortColumn =
        sort === 'createdAt'
            ? samples.createdAt
            : samples.receivedAt;

    // Выбираем направление сортировки
    const orderBy =
        order === 'asc'
            ? asc(sortColumn)
            : desc(sortColumn);

    // Считаем сколько записей нужно пропустить
    const offset = (page - 1) * limit;

    // Получаем нужную страницу образцов
    const data = await db
        .select()
        .from(samples)
        .where(whereCondition)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

    // Считаем общее количество образцов
    const totalResult = await db
        .select({
            count: count(),
        })
        .from(samples)
        .where(whereCondition);

    const total = totalResult[0].count;

    // Возвращаем образцы и информацию для пагинации
    return res.json({
        data,
        total,
        page,
        limit,
    });
});

// Получаем один образец по ID
router.get('/:id', requireAuth, async (req, res) => {

    // Проверяем что ID является положительным числом
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            message: 'Invalid sample id',
        });
    }

    // Находим текущего пользователя
    const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, req.session.userId!))
        .limit(1);

    const user = userResult[0];

    if (!user) {
        return res.status(401).json({
            message: 'User not found',
        });
    }

    // Находим образец в базе
    const sampleResult = await db
        .select()
        .from(samples)
        .where(eq(samples.id, id))
        .limit(1);

    const sample = sampleResult[0];

    if (!sample) {
        return res.status(404).json({
            message: 'Sample not found',
        });
    }

    // Проверяем имеет ли пользователь доступ к этому образцу
    if (
        user.role !== 'admin' &&
        sample.laboratoryId !== user.laboratoryId
    ) {
        return res.status(403).json({
            message: 'Access denied',
        });
    }

    // Возвращаем найденный образец
    return res.json(sample);
});

export default router;