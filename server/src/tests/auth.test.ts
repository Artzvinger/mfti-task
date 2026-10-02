import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../app';

describe('Samples API authentication', () => {
    it('returns 401 for unauthenticated request', async () => {
        const response = await request(app).get('/api/samples');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            'Authentication required',
        );
    });
});

describe('Samples API success response', () => {
    it('returns 200 for authenticated admin request', async () => {
        const agent = request.agent(app);

        const loginResponse = await agent
            .post('/api/auth/login')
            .send({
                username: 'admin',
                password: 'password123',
            });

        expect(loginResponse.status).toBe(200);

        const response = await agent.get('/api/samples');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('page', 1);
        expect(response.body).toHaveProperty('limit', 20);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});

describe('Samples API validation', () => {
    it('returns 400 for invalid sample id', async () => {
        const agent = request.agent(app);

        const loginResponse = await agent
            .post('/api/auth/login')
            .send({
                username: 'admin',
                password: 'password123',
            });

        expect(loginResponse.status).toBe(200);

        const response = await agent.get('/api/samples/abc');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            'Invalid sample id',
        );
    });
});

describe('Samples API permissions', () => {
    it('returns 403 when user tries to access sample from another laboratory', async () => {
        const agent = request.agent(app);

        const loginResponse = await agent
            .post('/api/auth/login')
            .send({
                username: 'lab_user',
                password: 'password123',
            });

        expect(loginResponse.status).toBe(200);

        const response = await agent.get('/api/samples/1');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Access denied');
    });
});