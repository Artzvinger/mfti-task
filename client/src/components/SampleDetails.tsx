import type { Sample } from '../types/sample';

type SampleDetailsProps = {
    sample: Sample;
    onBack: () => void;
};

function SampleDetails({
    sample,
    onBack,
}: SampleDetailsProps) {
    return (
        <div className="sample-details">
            <p>
                <strong>ID:</strong>{' '}
                {sample.id}
            </p>

            <p>
                <strong>Пациент:</strong>{' '}
                {sample.patientName}
            </p>

            <p>
                <strong>Статус:</strong>{' '}
                {sample.status}
            </p>

            <p>
                <strong>Дата получения:</strong>{' '}
                {new Date(
                    sample.receivedAt,
                ).toLocaleString('ru-RU')}
            </p>

            <p>
                <strong>Лаборатория:</strong>{' '}
                {sample.laboratoryId}
            </p>

            <p>
                <strong>Дата создания:</strong>{' '}
                {new Date(
                    sample.createdAt,
                ).toLocaleString('ru-RU')}
            </p>

            <button onClick={onBack}>
                Назад
            </button>
        </div>
    );
}

export default SampleDetails;