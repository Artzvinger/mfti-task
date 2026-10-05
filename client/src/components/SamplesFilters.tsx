import type { ChangeEvent } from 'react';

type SamplesFiltersProps = {
    status: string;
    sort: string;
    order: string;
    onStatusChange: (
        event: ChangeEvent<HTMLSelectElement>,
    ) => void;
    onSortChange: (
        event: ChangeEvent<HTMLSelectElement>,
    ) => void;
    onOrderChange: (
        event: ChangeEvent<HTMLSelectElement>,
    ) => void;
};

function SamplesFilters({
                            status,
                            sort,
                            order,
                            onStatusChange,
                            onSortChange,
                            onOrderChange,
                        }: SamplesFiltersProps) {
    return (
        <div className="filters">
            <label>
                Статус:{' '}
                <select
                    value={status}
                    onChange={onStatusChange}
                >
                    <option value="">
                        Все
                    </option>

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

            <label>
                Сортировка:{' '}
                <select
                    value={sort}
                    onChange={onSortChange}
                >
                    <option value="receivedAt">
                        Дата получения
                    </option>

                    <option value="createdAt">
                        Дата создания
                    </option>
                </select>
            </label>

            <label>
                Порядок:{' '}
                <select
                    value={order}
                    onChange={onOrderChange}
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
    );
}

export default SamplesFilters;