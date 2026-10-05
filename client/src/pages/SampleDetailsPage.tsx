import {
    useEffect,
    useState,
} from 'react';

import {
    useNavigate,
    useParams,
} from 'react-router';

import {
    getSample,
} from '../api/samples';

import SampleDetails from '../components/SampleDetails';

import type { Sample } from '../types/sample';

function SampleDetailsPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [sample, setSample] =
        useState<Sample | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        async function loadSample() {
            if (!id) {
                setError(
                    'Некорректный ID образца',
                );
                setLoading(false);
                return;
            }

            const sampleId = Number(id);

            if (
                !Number.isInteger(
                    sampleId,
                ) ||
                sampleId < 1
            ) {
                setError(
                    'Некорректный ID образца',
                );
                setLoading(false);
                return;
            }

            try {
                const result =
                    await getSample(
                        sampleId,
                    );

                setSample(result);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message ===
                        'SESSION_EXPIRED'
                ) {
                    navigate('/login', {
                        replace: true,
                    });
                    return;
                }

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Не удалось загрузить образец',
                );
            } finally {
                setLoading(false);
            }
        }

        loadSample();
    }, [id, navigate]);

    return (
        <div className="page">
            <div className="container">
                <div className="header">
                    <h1>
                        Образец №{id}
                    </h1>

                    <button
                        onClick={() =>
                            navigate(
                                '/samples',
                            )
                        }
                    >
                        Назад
                    </button>
                </div>

                {loading && (
                    <p>
                        Загрузка...
                    </p>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                {sample && (
                    <SampleDetails
                        sample={sample}
                        onBack={() =>
                            navigate(
                                '/samples',
                            )
                        }
                    />
                )}
            </div>
        </div>
    );
}

export default SampleDetailsPage;
