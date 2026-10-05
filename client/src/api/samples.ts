import {
    sampleSchema,
    samplesResponseSchema,
} from '../schemas/sample';

import type {
    Sample,
    SamplesResponse,
} from '../types/sample';

const API_URL = 'http://localhost:3000/api';

type GetSamplesParams = {
    page: number;
    limit: number;
    status: string;
    sort: string;
    order: string;
};

export async function getSamples(
    params: GetSamplesParams,
): Promise<SamplesResponse> {
    const searchParams = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
        sort: params.sort,
        order: params.order,
    });

    if (params.status) {
        searchParams.set(
            'status',
            params.status,
        );
    }

    const response = await fetch(
        `${API_URL}/samples?${searchParams}`,
        {
            credentials: 'include',
        },
    );

    const data = await response.json();

    if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            'Не удалось загрузить образцы',
        );
    }

    const result =
        samplesResponseSchema.safeParse(data);

    if (!result.success) {
        throw new Error(
            'Сервер вернул некорректные данные образцов',
        );
    }

    return result.data;
}

export async function getSample(
    id: number,
): Promise<Sample> {
    const response = await fetch(
        `${API_URL}/samples/${id}`,
        {
            credentials: 'include',
        },
    );

    const data = await response.json();

    if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            'Не удалось загрузить образец',
        );
    }

    const result =
        sampleSchema.safeParse(data);

    if (!result.success) {
        throw new Error(
            'Сервер вернул некорректные данные образца',
        );
    }

    return result.data;
}