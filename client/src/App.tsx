import './App.css';

import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    getCurrentUser,
    login,
    logout,
} from './api/auth';

import AppRouterProvider from './providers/AppRouterProvider';

import type { User } from './types/sample';

function App() {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        getCurrentUser()
            .then((currentUser) => {
                setUser(currentUser);
            })
            .catch((error) => {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Не удалось подключиться к серверу',
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleLogin = useCallback(
        async (
            username: string,
            password: string,
        ) => {
            try {
                const currentUser =
                    await login(
                        username,
                        password,
                    );

                setUser(currentUser);
                setError('');
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Ошибка входа',
                );
            }
        },
        [],
    );

    const handleLogout = useCallback(
        async () => {
            try {
                await logout();
            } finally {
                setUser(null);
            }
        },
        [],
    );

    const handleSessionExpired =
        useCallback(() => {
            setUser(null);
            setError(
                'Сессия истекла. Войдите снова.',
            );
        }, []);

    if (loading) {
        return (
            <div className="page">
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <AppRouterProvider
            user={user}
            error={error}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onSessionExpired={
                handleSessionExpired
            }
        />
    );
}

export default App;