import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from 'react';

const API_URL = 'http://127.0.0.1:3000/api';

type User = {
    id: number;
    username: string;
    role: string;
    laboratoryId: number | null;
};

type Sample = {
    id: number;
    patientName: string;
    status: 'received' | 'processing' | 'completed';
    receivedAt: string;
    laboratoryId: number;
    createdAt: string;
};

type SamplesResponse = {
    data: Sample[];
    total: number;
    page: number;
    limit: number;
};

function App() {
    const [user, setUser] = useState<User | null>(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sessionMessage, setSessionMessage] = useState('');

    const [samples, setSamples] = useState<Sample[]>([]);
    const [samplesLoading, setSamplesLoading] = useState(false);
    const [samplesError, setSamplesError] = useState('');

    const [selectedSample, setSelectedSample] =
        useState<Sample | null>(null);

    const [sampleLoading, setSampleLoading] = useState(false);
    const [sampleError, setSampleError] = useState('');

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('receivedAt');
    const [order, setOrder] = useState('desc');

    const limit = 10;

    // Проверяем есть ли активная сессия
    useEffect(() => {
        fetch(`${API_URL}/auth/me`, {
            credentials: 'include',
        })
            .then(async (response) => {
                if (!response.ok) {
                    return null;
                }

                const data = await response.json();

                return data.user;
            })
            .then((currentUser) => {
                setUser(currentUser);
            })
            .catch(() => {
                setError('Не удалось подключиться к серверу');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Загружаем список образцов
    useEffect(() => {
        if (!user) {
            return;
        }

        async function loadSamples() {
            setSamplesLoading(true);
            setSamplesError('');

            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sort,
                order,
            });

            if (status) {
                params.set('status', status);
            }

            try {
                const response = await fetch(
                    `${API_URL}/samples?${params}`,
{
    credentials: 'include',
},
);

if (response.status === 401) {
    setUser(null);
    setSessionMessage(
        'Сессия истекла. Войдите снова.',
    );
    return;
}

const data = await response.json();

if (!response.ok) {
    setSamplesError(
        data.message || 'Не удалось загрузить образцы',
    );
    return;
}

const result: SamplesResponse = data;

setSamples(result.data);
setTotal(result.total);
} catch {
    setSamplesError(
        'Не удалось подключиться к серверу',
    );
} finally {
    setSamplesLoading(false);
}
}

loadSamples();
}, [user, page, status, sort, order]);

// Отправляем данные для входа
async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setError('');
    setSessionMessage('');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Ошибка входа');
            return;
        }

        setUser(data.user);
        setPassword('');
        setPage(1);
    } catch {
        setError('Не удалось подключиться к серверу');
    }
}

// Загружаем один образец
async function handleSampleClick(id: number) {
    setSampleLoading(true);
    setSampleError('');

    try {
        const response = await fetch(
            `${API_URL}/samples/${id}`,
            {
                credentials: 'include',
            },
        );

        if (response.status === 401) {
            setUser(null);
            setSessionMessage(
                'Сессия истекла. Войдите снова.',
            );
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            setSampleError(
                data.message || 'Не удалось загрузить образец',
            );
            return;
        }

        setSelectedSample(data);
    } catch {
        setSampleError(
            'Не удалось подключиться к серверу',
        );
    } finally {
        setSampleLoading(false);
    }
}

// Завершаем текущую сессию
async function handleLogout() {
    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    setUser(null);
    setSamples([]);
    setSelectedSample(null);
}

// Меняем фильтр статуса
function handleStatusChange(
    event: ChangeEvent<HTMLSelectElement>,
) {
    setStatus(event.target.value);
    setPage(1);
}

// Меняем поле сортировки
function handleSortChange(
    event: ChangeEvent<HTMLSelectElement>,
) {
    setSort(event.target.value);
    setPage(1);
}

// Меняем направление сортировки
function handleOrderChange(
    event: ChangeEvent<HTMLSelectElement>,
) {
    setOrder(event.target.value);
    setPage(1);
}

const totalPages = Math.ceil(total / limit);

if (loading) {
    return <div>Загрузка...</div>;
}

if (!user) {
    return (
        <div>
            <h1>Вход</h1>

            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Логин
                        <input
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Пароль
                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </label>
                </div>

                {(error || sessionMessage) && (
                    <p>{error || sessionMessage}</p>
                )}

                <button type="submit">
                    Войти
                </button>
            </form>
        </div>
    );
}

if (selectedSample) {
    return (
        <div>
            <h1>Образец №{selectedSample.id}</h1>

            {sampleLoading && <p>Загрузка...</p>}

            {sampleError && <p>{sampleError}</p>}

            <p>
                Пациент: {selectedSample.patientName}
            </p>

            <p>
                Статус: {selectedSample.status}
            </p>

            <p>
                Дата получения:{' '}
                {new Date(
                    selectedSample.receivedAt,
                ).toLocaleString('ru-RU')}
            </p>

            <p>
                Лаборатория: {selectedSample.laboratoryId}
            </p>

            <p>
                Дата создания:{' '}
                {new Date(
                    selectedSample.createdAt,
                ).toLocaleString('ru-RU')}
            </p>

            <button
                onClick={() => setSelectedSample(null)}
            >
                Назад
            </button>
        </div>
    );
}

return (
    <div>
        <h1>Образцы</h1>

        <p>
            Пользователь: {user.username}
        </p>

        <button onClick={handleLogout}>
            Выйти
        </button>

        <hr />

        <div>
            <label>
                Статус:{' '}
                <select
                    value={status}
                    onChange={handleStatusChange}
                >
                    <option value="">Все</option>
                    <option value="received">
                        Получен
                    </option>
                    <option value="processing">
                        В обработке
                    </option>
                    <option value="completed">
                        Завершён
                    </option>
                </select>
            </label>

            {' '}

            <label>
                Сортировка:{' '}
                <select
                    value={sort}
                    onChange={handleSortChange}
                >
                    <option value="receivedAt">
                        Дата получения
                    </option>
                    <option value="createdAt">
                        Дата создания
                    </option>
                </select>
            </label>

            {' '}

            <label>
                Порядок:{' '}
                <select
                    value={order}
                    onChange={handleOrderChange}
                >
                    <option value="desc">
                        Сначала новые
                    </option>
                    <option value="asc">
                        Сначала старые
                    </option>
                </select>
            </label>
        </div>

        <hr />

        {samplesLoading && (
            <p>Загрузка образцов...</p>
        )}

        {samplesError && (
            <p>{samplesError}</p>
        )}

        {!samplesLoading && !samplesError && (
            <>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Пациент</th>
                        <th>Статус</th>
                        <th>Дата получения</th>
                        <th>Лаборатория</th>
                    </tr>
                    </thead>

                    <tbody>
                    {samples.map((sample) => (
                        <tr
                            key={sample.id}
                            onClick={() =>
                                handleSampleClick(sample.id)
                            }
                        >
                            <td>{sample.id}</td>
                            <td>
                                {sample.patientName}
                            </td>
                            <td>{sample.status}</td>
                            <td>
                                {new Date(
                                    sample.receivedAt,
                                ).toLocaleString('ru-RU')}
                            </td>
                            <td>
                                {sample.laboratoryId}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {samples.length === 0 && (
                    <p>Образцы не найдены</p>
                )}
            </>
        )}

        <hr />

        <div>
            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                Назад
            </button>

            <span>
                    {' '}
                Страница {page} из {totalPages || 1}{' '}
                </span>

            <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
            >
                Вперёд
            </button>
        </div>

        <p>
            Всего образцов: {total}
        </p>
    </div>
);
}

export default App;
