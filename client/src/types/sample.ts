export type User = {
    id: number;
    username: string;
    role: string;
    laboratoryId: number | null;
};

export type SampleStatus =
    | 'received'
    | 'processing'
    | 'completed';

export type Sample = {
    id: number;
    patientName: string;
    status: SampleStatus;
    receivedAt: string;
    laboratoryId: number;
    createdAt: string;
};

export type SamplesResponse = {
    data: Sample[];
    total: number;
    page: number;
    limit: number;
};