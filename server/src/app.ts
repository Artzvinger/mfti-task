import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';

import authRouter from './routes/auth';
import samplesRouter from './routes/samples';

const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const PgSession = pgSession(session);

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);

app.use(express.json());

app.use(
    session({
        store: new PgSession({
            pool,
            tableName: 'user_sessions',
            createTableIfMissing: true,
        }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 1000 * 60 * 60,
        },
    }),
);

app.use('/api/auth', authRouter);
app.use('/api/samples', samplesRouter);

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
    });
});

export default app;