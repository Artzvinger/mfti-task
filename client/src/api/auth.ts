import { userSchema } from '../schemas/sample';
import type { User } from '../types/sample';

const API_URL = 'http://localhost:3000/api';

export async function getCurrentUser(): Promise<User | null> {
    const response = await fetch(
        `${API_URL}/auth/me`,
        {
            credentials: 'include',
        },
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    const result = userSchema.safeParse(data.user);

    if (!result.success) {
        throw new Error(
            'Сервер вернул некорректные данные пользователя',
        );
    }

    return {
        id: result.data.id,
        username: result.data.username,
        role: result.data.role,
        laboratoryId:
            result.data.laboratoryId ?? null,
    };
}

export async function login(
    username: string,
    password: string,
): Promise<User> {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username,
                password,
            }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Ошибка входа',
        );
    }

    const result = userSchema.safeParse(data.user);

    if (!result.success) {
        throw new Error(
            'Сервер вернул некорректные данные пользователя',
        );
    }

    return {
        id: result.data.id,
        username: result.data.username,
        role: result.data.role,
        laboratoryId:
            result.data.laboratoryId ?? null,
    };
}

export async function logout(): Promise<void> {
    const response = await fetch(
        `${API_URL}/auth/logout`,
        {
            method: 'POST',
            credentials: 'include',
        },
    );

    if (!response.ok) {
        throw new Error('Ошибка выхода');
    }
}