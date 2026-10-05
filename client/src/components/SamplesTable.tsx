import type { Sample } from '../types/sample';

type SamplesTableProps = {
    samples: Sample[];
    onSampleClick: (id: number) => void;
};

function SamplesTable({
    samples,
    onSampleClick,
}: SamplesTableProps) {
    if (samples.length === 0) {
        return <p>Образцы не найдены.</p>;
    }

    return (
        <table className="samples-table">
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
                            onSampleClick(
                                sample.id,
                            )
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
                            ).toLocaleString(
                                'ru-RU',
                            )}
                        </td>
                        <td>
                            {sample.laboratoryId}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SamplesTable;
