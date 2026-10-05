import {
    useEffect,
    useState,
} from 'react';

import {
    useNavigate,
} from 'react-router';

import { getSamples } from '../api/samples';

import Pagination from '../components/Pagination';
import SamplesFilters from '../components/SamplesFilters';
import SamplesTable from '../components/SamplesTable';

import type {
    User,
    Sample,
} from '../types/sample';

type SamplesPageProps = {
    user: User;
    onLogout: () => Promise<void>;
    onSessionExpired: () => void;
};

function SamplesPage({
                         user,
                         onLogout,
                         onSessionExpired,
                     }: SamplesPageProps) {
    const navigate =
        useNavigate();

    const [samples, setSamples] =
        useState<Sample[]>([]);

    const [samplesLoading, setSamplesLoading] =
        useState(false);

    const [samplesError, setSamplesError] =
        useState('');

    const [page, setPage] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [status, setStatus] =
        useState('');

    const [sort, setSort] =
        useState('receivedAt');

    const [order, setOrder] =
        useState('desc');

    const limit = 10;

    useEffect(() => {
        async function loadSamples() {
            setSamplesLoading(true);
            setSamplesError('');

            try {
                const result =
                    await getSamples({
                        page,
                        limit,
                        status,
                        sort,
                        order,
                    });

                setSamples(
                    result.data,
                );

                setTotal(
                    result.total,
                );
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message ===
                    'SESSION_EXPIRED'
                ) {
                    onSessionExpired();
                    return;
                }

                setSamplesError(
                    error instanceof Error
                        ? error.message
                        : 'Не удалось загрузить образцы',
                );
            } finally {
                setSamplesLoading(false);
            }
        }

        loadSamples();
    }, [
        page,
        status,
        sort,
        order,
        onSessionExpired,
    ]);

    function handleStatusChange(
        event: React.ChangeEvent<HTMLSelectElement>,
    ) {
        setStatus(
            event.target.value,
        );
        setPage(1);
    }

    function handleSortChange(
        event: React.ChangeEvent<HTMLSelectElement>,
    ) {
        setSort(
            event.target.value,
        );
        setPage(1);
    }

    function handleOrderChange(
        event: React.ChangeEvent<HTMLSelectElement>,
    ) {
        setOrder(
            event.target.value,
        );
        setPage(1);
    }

    const totalPages =
        Math.ceil(total / limit);

    return (
        <div className="page">
            <div className="container">
                <div className="header">
                    <div>
                        <h1>
                            Образцы
                        </h1>

                        <p>
                            Пользователь:{' '}
                            {user.username}
                        </p>
                    </div>

                    <button
                        onClick={
                            onLogout
                        }
                    >
                        Выйти
                    </button>
                </div>

                <SamplesFilters
                    status={status}
                    sort={sort}
                    order={order}
                    onStatusChange={
                        handleStatusChange
                    }
                    onSortChange={
                        handleSortChange
                    }
                    onOrderChange={
                        handleOrderChange
                    }
                />

                {samplesLoading && (
                    <p>
                        Загрузка образцов...
                    </p>
                )}

                {samplesError && (
                    <p className="error">
                        {samplesError}
                    </p>
                )}

                {!samplesLoading &&
                    !samplesError && (
                        <SamplesTable
                            samples={
                                samples
                            }
                            onSampleClick={(
                                id,
                            ) =>
                                navigate(
                                    `/samples/${id}`,
                                )
                            }
                        />
                    )}

                <Pagination
                    page={page}
                    totalPages={
                        totalPages
                    }
                    onPrevious={() =>
                        setPage(
                            page - 1,
                        )
                    }
                    onNext={() =>
                        setPage(
                            page + 1,
                        )
                    }
                />

                <p>
                    Всего образцов:{' '}
                    {total}
                </p>
            </div>
        </div>
    );
}

export default SamplesPage;