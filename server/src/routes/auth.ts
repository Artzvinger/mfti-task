import { Router } from 'express';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { users } from '../db/schema';

const router = Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        !username ||
        !password
    ) {
        return res.status(400).json({
            message: 'Username and password are required',
        });
    }

    const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

    const user = result[0];

    if (!user) {
        return res.status(401).json({
            message: 'Invalid username or password',
        });
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.passwordHash,
    );

    if (!passwordValid) {
        return res.status(401).json({
            message: 'Invalid username or password',
        });
    }

    req.session.userId = user.id;

    return res.json({
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            laboratoryId: user.laboratoryId,
        },
    });
});

router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: 'Not authenticated',
        });
    }

    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, req.session.userId))
        .limit(1);

    const user = result[0];

    if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({
            message: 'Not authenticated',
        });
    }

    return res.json({
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            laboratoryId: user.laboratoryId,
        },
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: 'Logout failed',
            });
        }

        res.clearCookie('connect.sid');

        return res.json({
            message: 'Logged out',
        });
    });
});

export default router;